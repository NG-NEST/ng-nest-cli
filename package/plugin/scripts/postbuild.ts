import { cp } from 'shelljs';
import { resolve } from 'path';
import { writeFile } from 'fs';
const pkg = require('../../package.json');
const { name, version } = pkg;

writeFile(
  resolve('./dist/package.json'),
  JSON.stringify({
    name,
    version,
    scripts: {
      preinstall: 'node ./node_modules/@ng-nest/plugin/scripts/preinstall.js',
      postinstall: 'node ./node_modules/@ng-nest/plugin/scripts/postinstall.js',
      preuninstall: 'node ./node_modules/@ng-nest/plugin/scripts/preuninstall.js'
    }
  }),
  () => {}
);
cp('-Rf', resolve('./README.md'), resolve('./dist'));
