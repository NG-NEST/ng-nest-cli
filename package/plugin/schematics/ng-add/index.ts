import { Rule, Tree, chain, SchematicContext } from '@angular-devkit/schematics';
import { workspaces } from '@angular-devkit/core';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { createHost } from '../utils/create-host';

export function ngAdd(): Rule {
  return chain([
    async (tree: Tree) => {
      const host = createHost(tree);
      await updateAngularJson(host);
      await updatePackageJson(host);
    },
    (_: Tree, context: SchematicContext) => {
      context.addTask(new NodePackageInstallTask());
    }
  ]);
}

async function updateAngularJson(host: workspaces.WorkspaceHost) {
  let angularJsonStr = await host.readFile('angular.json');
  if (angularJsonStr) {
    let angularJson = JSON.parse(angularJsonStr);
    let architect = angularJson.projects[angularJson.defaultProject].architect;
    let outputPath: string = architect.build.options.outputPath;
    if (outputPath.lastIndexOf('/app') === -1) {
      architect.build.options.outputPath += '/app';
    }
    if (!architect.local) {
      architect.local = JSON.parse(JSON.stringify(architect.build));
      architect.local.options.outputPath = `../nestjs/plugins/${angularJson.defaultProject}`;
    }
    await host.writeFile('angular.json', JSON.stringify(angularJson, null, 2));
  }
}

async function updatePackageJson(host: workspaces.WorkspaceHost) {
  let packageJsonStr = await host.readFile('package.json');
  if (packageJsonStr) {
    const packageJson = JSON.parse(packageJsonStr);
    const { scripts, name } = packageJson || {};
    scripts.build = `ng build --base-href /${name}/`;
    if (!scripts.local) {
      scripts.local = `ng run ${name}:local:production`;
    }
    if (!scripts.postbuild) {
      scripts.postbuild = `node ./node_modules/@ng-nest/plugin/scripts/postbuild.js`;
    }
    if (!scripts.prelocal) {
      scripts.prelocal = `node ./node_modules/@ng-nest/plugin/scripts/prelocal.js`;
    }
    await host.writeFile('package.json', JSON.stringify(packageJson, null, 2));
  }
}
