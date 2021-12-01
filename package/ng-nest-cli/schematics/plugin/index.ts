import {
  Rule,
  Tree,
  SchematicsException,
  apply,
  url,
  applyTemplates,
  move,
  chain,
  mergeWith
} from '@angular-devkit/schematics';

import { strings, normalize, virtualFs, workspaces } from '@angular-devkit/core';

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
    const { workspace } = await workspaces.readWorkspace('/', host);
    let { defaultProject } = workspace.extensions;
    const project = workspace.projects.get(defaultProject as string);
    if (!project) {
      throw new SchematicsException(`Invalid project name: ${defaultProject}`);
    }

    let angularJson = await host.readFile('angular.json');
    if (angularJson) {
      angularJson = JSON.parse(angularJson);
    }

    return chain([]);
  };
}
