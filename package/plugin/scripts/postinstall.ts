import { cp, mkdir } from 'shelljs';
import { resolve, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const pkg = require('../package.json');
const config = require('../config.json');
mkdir('-p', join(resolve('../../views/plugins'), pkg.name));
cp('-Rf', resolve('./app/*'), join(resolve('../../views/plugins'), pkg.name));

const rootConfigPath = resolve('../../src/config.json');
let rootConfig;
if (existsSync(rootConfigPath)) {
  rootConfig = JSON.parse(readFileSync(rootConfigPath).toString());
} else {
  rootConfig = { containers: [], plugins: [] };
}
let plugin = rootConfig.plugins.find((x: any) => x.name === pkg.name);
if (plugin) {
  plugin = Object.assign(plugin, config);
} else {
  rootConfig.plugins.push(config);
}
writeFileSync(rootConfigPath, JSON.stringify(rootConfig, null, 2), { encoding: 'utf-8' });
