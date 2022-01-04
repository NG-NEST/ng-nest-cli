// npm v7+ 不支持 preuninstall
// https://github.com/npm/cli/issues/3042
import { readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { rm } from 'shelljs';

const pkg = require('../package.json');
rm('-rf', join(resolve('../../views/containers/'), pkg.name));

const configPath = resolve('../../src/config.json');
const config = JSON.parse(readFileSync(configPath).toString());
let container = config.containers.find((x: any) => x.name === pkg.name);
if (container) {
  config.containers.splice(config.containers.indexOf(container), 1);
}
writeFileSync(configPath, JSON.stringify(config, null, 2));
