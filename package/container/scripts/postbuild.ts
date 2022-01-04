import { cp, mkdir } from 'shelljs';
import { join, resolve } from 'path';
import { readdirSync, statSync, writeFileSync } from 'fs';

export class PostBuild {
  pkg = require(resolve('./package.json'));
  name = this.pkg?.name || '';
  version = this.pkg?.version || '';
  description = this.pkg?.description || '';
  constructor() {
    this.updatePackage();
    this.copyReadme();
    this.createScripts();
    this.createConfig();
  }

  updatePackage() {
    writeFileSync(
      resolve(`./dist/${this.name}/package.json`),
      JSON.stringify(
        {
          name: this.name,
          version: this.version,
          description: this.description,
          scripts: {
            preinstall: 'node scripts/preinstall.js',
            postinstall: 'node scripts/postinstall.js'
          }
        },
        null,
        2
      ),
      { encoding: 'utf-8' }
    );
  }

  copyReadme() {
    cp('-Rf', resolve('./README.md'), resolve(`./dist/${this.name}`));
  }

  createScripts() {
    mkdir('-p', resolve(`./dist/${this.name}/scripts`));
    cp(
      '-Rf',
      resolve('./node_modules/@ng-nest/container/scripts/preinstall.js'),
      resolve(`./dist/${this.name}/scripts`)
    );
    cp(
      '-Rf',
      resolve('./node_modules/@ng-nest/container/scripts/postinstall.js'),
      resolve(`./dist/${this.name}/scripts`)
    );
  }

  createConfig() {
    const rootPath = resolve(`./dist/${this.name}/app`);
    const filesMap: { [filePath: string]: string } = {};
    const readFileMap = (dir: string) => {
      let paths = readdirSync(dir);
      paths.forEach((item) => {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          readFileMap(fullPath);
        } else {
          const filePath = fullPath.replace(rootPath, '').replace(/\\/g, '/');
          filesMap[filePath] = `views/containers/${this.name}${filePath}`;
        }
      });
    };
    readFileMap(rootPath);

    writeFileSync(
      resolve(`./dist/${this.name}/config.json`),
      JSON.stringify(
        {
          name: this.name,
          version: this.version,
          description: this.description,
          filesMap
        },
        null,
        2
      ),
      { encoding: 'utf-8' }
    );
  }
}
new PostBuild();
