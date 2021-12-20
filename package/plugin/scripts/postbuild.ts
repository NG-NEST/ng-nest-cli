import { cp, mkdir } from 'shelljs';
import { resolve } from 'path';
import { writeFile } from 'fs';

export class PostBuild {
  pkg = require(resolve('./package.json'));
  name = this.pkg?.name || '';
  version = this.pkg?.version || '';
  constructor() {
    this.updatePackage();
    this.copyReadme();
    this.createScripts();
  }

  updatePackage() {
    const { name, version } = this.pkg;
    writeFile(
      resolve(`./dist/${name}/package.json`),
      JSON.stringify(
        {
          name,
          version,
          scripts: {
            preinstall: 'node scripts/preinstall.js',
            postinstall: 'node scripts/postinstall.js'
          }
        },
        null,
        2
      ),
      () => {}
    );
  }

  copyReadme() {
    cp('-Rf', resolve('./README.md'), resolve(`./dist/${this.name}`));
  }

  createScripts() {
    mkdir('-p', resolve(`./dist/${this.name}/scripts`));
    cp(
      '-Rf',
      resolve('./node_modules/@ng-nest/plugin/scripts/preinstall.js'),
      resolve(`./dist/${this.name}/scripts`)
    );
    cp(
      '-Rf',
      resolve('./node_modules/@ng-nest/plugin/scripts/postinstall.js'),
      resolve(`./dist/${this.name}/scripts`)
    );
  }
}
new PostBuild();
