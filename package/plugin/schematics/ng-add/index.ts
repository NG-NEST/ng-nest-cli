import {
  Rule,
  Tree,
  chain,
  SchematicContext,
  apply,
  url,
  applyTemplates,
  move,
  mergeWith,
  noop
} from '@angular-devkit/schematics';
import { strings, normalize } from '@angular-devkit/core';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { createHost } from '../utils/create-host';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { WorkspaceDefinition } from '@angular-devkit/core/src/workspace';
import { addModuleImport } from '../utils/root-module';
import { Schema } from './schema';

const addModules = {
  BrowserAnimationsModule: '@angular/platform-browser/animations',
  LayoutModule: './layout/layout.module',
  AppRoutingModule: './app-routing.module'
};

export function ngAdd(options: Schema): Rule {
  return chain([
    updatePackageJson(options),
    updateAngularJson(),
    ...Object.entries(addModules).map((x) => addModuleImport(x[0], x[1])),
    updateAppComponentHtml(),
    updateAppComponentTs(),
    updateIndexHtml(),
    copyFiles(options),
    (_: Tree, context: SchematicContext) => {
      context.addTask(new NodePackageInstallTask());
    }
  ]);
}

function updatePackageJson(options: Schema): Rule {
  return async (tree: Tree) => {
    const host = createHost(tree);
    let packageJsonStr = await host.readFile('package.json');
    if (!packageJsonStr) return noop();
    const packageJson = JSON.parse(packageJsonStr);
    const { scripts, name, dependencies } = packageJson || {};
    if (options?.description && !packageJson.description) {
      packageJson.description = options.description;
    }
    if (!scripts.local) {
      scripts.local = `ng run ${name}:local:production`;
    }
    if (!scripts.postbuild) {
      scripts.postbuild = `node ./node_modules/@ng-nest/plugin/scripts/postbuild.js`;
    }
    if (!scripts.prelocal) {
      scripts.prelocal = `node ./node_modules/@ng-nest/plugin/scripts/prelocal.js`;
    }
    if (!dependencies['@ng-nest/ui']) {
      dependencies['@ng-nest/ui'] = '^13.0.0';
    }
    await host.writeFile('package.json', JSON.stringify(packageJson, null, 2));

    return noop();
  };
}

function updateAngularJson(): Rule {
  return async (tree: Tree) => {
    const host = createHost(tree);
    let angularJsonStr = await host.readFile('angular.json');
    if (!angularJsonStr) return noop();
    let angularJson = JSON.parse(angularJsonStr);
    let architect = angularJson.projects[angularJson.defaultProject].architect;
    let outputPath: string = architect.build.options.outputPath;
    let styles: string[] = architect.build.options.styles;
    if (outputPath.lastIndexOf('/app') === -1) {
      architect.build.options.outputPath += '/app';
      architect.build.options.baseHref = `/`;
    }
    if (!architect.local) {
      architect.local = JSON.parse(JSON.stringify(architect.build));
      architect.local.options.outputPath = `../nestjs/plugins/${angularJson.defaultProject}`;
      architect.local.options.baseHref = '/';
    }
    if (architect.serve) {
      if (!architect.serve.options) architect.serve.options = {};
      architect.serve.options.proxyConfig = 'proxy.config.json';
    }
    if (styles) {
      styles.unshift('node_modules/@ng-nest/plugin/style/index.css');
      styles.unshift('node_modules/@ng-nest/ui/style/core/index.css');
    }
    await host.writeFile('angular.json', JSON.stringify(angularJson, null, 2));

    return noop();
  };
}

function updateAppComponentHtml(): Rule {
  return async (tree: Tree) => {
    const host = createHost(tree);
    await host.writeFile(
      'src/app/app.component.html',
      `<app-menu></app-menu>
<app-content></app-content>`
    );

    return noop();
  };
}

function updateAppComponentTs(): Rule {
  return async (tree: Tree) => {
    const host = createHost(tree);
    const workspace = (await getWorkspace(tree)) as unknown as WorkspaceDefinition;
    const appComponentTsPath = 'src/app/app.component.ts';
    let appComponentStr = await host.readFile(appComponentTsPath);
    if (!appComponentStr) return noop();
    const { defaultProject } = workspace.extensions;
    appComponentStr = appComponentStr.replace(
      "selector: 'app-root'",
      `selector: '${defaultProject}'`
    );
    appComponentStr = appComponentStr.replace(
      "import { Component } from '@angular/core';",
      `import { Component, ViewEncapsulation } from '@angular/core';`
    );
    appComponentStr = appComponentStr.replace(
      "styleUrls: ['./app.component.css']",
      `styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom`
    );
    await host.writeFile(appComponentTsPath, appComponentStr);

    return noop();
  };
}

function updateIndexHtml(): Rule {
  return async (tree: Tree) => {
    const host = createHost(tree);
    const workspace = (await getWorkspace(tree)) as unknown as WorkspaceDefinition;
    const indexHtmlPath = 'src/index.html';
    let indexHtmlStr = await host.readFile(indexHtmlPath);
    if (!indexHtmlStr) return noop();
    const { defaultProject } = workspace.extensions;
    indexHtmlStr = indexHtmlStr.replace(
      '<app-root></app-root>',
      `<${defaultProject}></${defaultProject}>`
    );
    await host.writeFile(indexHtmlPath, indexHtmlStr);

    return noop();
  };
}

function copyFiles(options: Schema): Rule {
  return async (tree: Tree) => {
    const workspace = (await getWorkspace(tree)) as unknown as WorkspaceDefinition;
    const { defaultProject } = workspace.extensions;
    const templateSource = apply(url('./files'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        name: defaultProject,
        descirption: options?.description || defaultProject
      }),
      move(normalize(''))
    ]);
    return mergeWith(templateSource);
  };
}
