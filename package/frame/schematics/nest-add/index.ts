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
import { Schema } from './schema';

export function nestAdd(options: Schema): Rule {
  return chain([
    updatePackageJson(options),
    updateAppControllerTs(),
    updateAppModuleTs(),
    updateMainTs(),
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
    const { dependencies } = packageJson || {};
    if (options?.description && !packageJson.description) {
      packageJson.description = options.description;
    }
    Object.assign(dependencies, {
      'fastify-static': '^4.5.0',
      handlebars: '^4.7.7',
      hbs: '^4.2.0',
      'point-of-view': '^4.16.0'
    });
    await host.writeFile('package.json', JSON.stringify(packageJson, null, 2));

    return noop();
  };
}

function updateAppControllerTs(): Rule {
  return async (tree: Tree) => {
    const host = createHost(tree);
    let appControllerStr = await host.readFile('src/app.controller.ts');
    if (!appControllerStr) return noop();
    appControllerStr = appControllerStr.replace(
      `@Get()
  getHello(): string {
    return this.appService.getHello();
  }`,
      ''
    );
    await host.writeFile('src/app.controller.ts', appControllerStr);

    return noop();
  };
}

function updateAppModuleTs(): Rule {
  return async (tree: Tree) => {
    const host = createHost(tree);
    let appModuleStr = await host.readFile('src/app.module.ts');
    if (!appModuleStr) return noop();
    appModuleStr = appModuleStr.replace(
      `import { Module } from '@nestjs/common';`,
      `import { Module } from '@nestjs/common';
import { FrameModule } from './frame/frame.module';`
    );
    appModuleStr = appModuleStr.replace(`imports: [],`, `imports: [FrameModule],`);
    await host.writeFile('src/app.module.ts', appModuleStr);

    return noop();
  };
}

function updateMainTs(): Rule {
  return async (tree: Tree) => {
    const host = createHost(tree);
    let mainStr = await host.readFile('src/main.ts');
    if (!mainStr) return noop();
    mainStr = mainStr.replace(
      `import { NestFactory } from '@nestjs/core';`,
      `import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';`
    );
    mainStr = mainStr.replace(
      `await NestFactory.create(AppModule);`,
      `await NestFactory.create<NestExpressApplication>(AppModule);
  app.setBaseViewsDir('views');
  app.setViewEngine('hbs');`
    );
    await host.writeFile('src/main.ts', mainStr);

    return noop();
  };
}

function copyFiles(options: Schema): Rule {
  return async (tree: Tree) => {
    const host = createHost(tree);
    let packageJsonStr = await host.readFile('package.json');
    if (!packageJsonStr) return noop();
    const packageJson = JSON.parse(packageJsonStr);
    const templateSource = apply(url('./files'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        name: packageJson.name,
        description: options?.description || packageJson.name
      }),
      move(normalize(''))
    ]);
    return mergeWith(templateSource);
  };
}
