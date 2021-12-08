import { cp, mkdir } from 'shelljs';
import { resolve } from 'path';
import { writeFile } from 'fs';
const pkg = require(resolve('./package.json'));
const { name, version } = pkg;

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
  resolve('./node_modules/@ng-nest/plugin/scripts/preinstall.js'),
  resolve(`./dist/${name}/scripts`)
);
cp(
  '-Rf',
  resolve('./node_modules/@ng-nest/plugin/scripts/postinstall.js'),
  resolve(`./dist/${name}/scripts`)
);
