import { Rule, Tree, SchematicsException, chain } from '@angular-devkit/schematics';

import { virtualFs, workspaces } from '@angular-devkit/core';

function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    async readFile(path: string): Promise<string> {
      const data = tree.read(path);
      if (!data) {
        throw new SchematicsException('File not found.');
      }
      return virtualFs.fileBufferToString(data);
    },
    async writeFile(path: string, data: string): Promise<void> {
      return tree.overwrite(path, data);
    },
    async isDirectory(path: string): Promise<boolean> {
      return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
    },
    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    }
  };
}

export function plugin(): Rule {
  return async (tree: Tree) => {
    const host = createHost(tree);

    // update angular.json 
    let angularJsonStr = await host.readFile('angular.json');
    if (angularJsonStr) {
      let angularJson = JSON.parse(angularJsonStr);
      let architect = angularJson.projects[angularJson.defaultProject].architect;
      let outputPath: string = architect.build.options.outputPath;
      if (outputPath.lastIndexOf('/static') === -1) {
        architect.build.options.outputPath += '/static';
        await host.writeFile('angular.json', JSON.stringify(angularJson, null, 2));
      }
    }

    // 

    return chain([]);
  };
}
