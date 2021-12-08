import { cp, mkdir } from 'shelljs';
import { resolve, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const pkg = require('../package.json');
mkdir('-p', join(resolve('../../plugins'), pkg.name));
cp('-Rf', resolve('./app/*'), join(resolve('../../plugins'), pkg.name));

const configPath = resolve('../../src/config.json');
let config;
if (existsSync(configPath)) {
  config = JSON.parse(readFileSync(configPath).toString());
} else {
  config = { plugins: [] };
}
let plugin = config.plugins.find((x: any) => x.name === pkg.name);
if (plugin) {
  plugin = Object.assign(plugin, { version: pkg.version });
} else {
  config.plugins.push({
    name: pkg.name,
    version: pkg.version
  });
}
writeFileSync(configPath, JSON.stringify(config, null, 2), { encoding: 'utf-8' });
