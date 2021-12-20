import { noop, Rule, Tree } from '@angular-devkit/schematics';
import {
  addDeclarationToModule,
  addModuleImportToRootModule,
  getAppModulePath,
  getProjectFromWorkspace,
  getProjectMainFile
} from '@angular/cdk/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { WorkspaceDefinition } from '@angular-devkit/core/src/workspace';
import { readSourceFile } from './source-file';
import { InsertChange } from '@schematics/angular/utility/change';

export function addModuleImport(name: string, src: string): Rule {
  return async (tree: Tree) => {
    const workspace = (await getWorkspace(tree)) as unknown as WorkspaceDefinition;
    const project = getProjectFromWorkspace(workspace);
    addModuleImportToRootModule(tree, name, src, project);

    return noop();
  };
}

export function addComponentImport(name: string, src: string): Rule {
  return async (tree: Tree) => {
    const workspace = (await getWorkspace(tree)) as unknown as WorkspaceDefinition;
    const project = getProjectFromWorkspace(workspace);
    const appModulePath = getAppModulePath(tree, getProjectMainFile(project));
    const source = readSourceFile(tree, appModulePath);
    const declarationChanges = addDeclarationToModule(source, appModulePath, name, src);
    const declarationRecorder = tree.beginUpdate(appModulePath);
    for (const change of declarationChanges) {
      if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    tree.commitUpdate(declarationRecorder);

    return noop();
  };
}
