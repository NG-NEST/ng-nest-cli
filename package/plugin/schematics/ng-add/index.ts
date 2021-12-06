import { Rule, Tree, chain, SchematicContext } from '@angular-devkit/schematics';
import { workspaces } from '@angular-devkit/core';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { createHost } from '../utils/create-host';

export function ngAdd(): Rule {
  return chain([
    async (tree: Tree) => {
      await updateAngularJson(createHost(tree));
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
      await host.writeFile('angular.json', JSON.stringify(angularJson, null, 2));
    }
  }
}

// async function updatePackageJson(host: workspaces.WorkspaceHost) {}
