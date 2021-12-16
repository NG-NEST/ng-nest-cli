import { cp, mkdir } from 'shelljs';
import { resolve } from 'path';
import { writeFile } from 'fs';

export class PostBuild {
  pkg = require(resolve('./package.json'));
  constructor() {
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
    cp('-Rf', resolve('./README.md'), resolve(`./dist/${name}`));
    mkdir('-p', resolve(`./dist/${name}/scripts`));
    cp(
      '-Rf',
      resolve('./node_modules/@ng-nest/container/scripts/preinstall.js'),
      resolve(`./dist/${name}/scripts`)
    );
    cp(
      '-Rf',
      resolve('./node_modules/@ng-nest/container/scripts/postinstall.js'),
      resolve(`./dist/${name}/scripts`)
    );
  }
}
new PostBuild();
