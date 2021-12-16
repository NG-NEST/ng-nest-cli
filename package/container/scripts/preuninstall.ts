// npm v7+ 不支持 preuninstall
// https://github.com/npm/cli/issues/3042
import { readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { rm } from 'shelljs';

const pkg = require('../package.json');
rm('-rf', join(resolve('../../plugins/'), pkg.name));

const configPath = resolve('../../src/config.json');
const config = JSON.parse(readFileSync(configPath).toString());
let plugin = config.plugins.find((x: any) => x.name === pkg.name);
if (plugin) {
  config.plugins.splice(config.plugins.indexOf(plugin), 1);
}
writeFileSync(configPath, JSON.stringify(config, null, 2));
