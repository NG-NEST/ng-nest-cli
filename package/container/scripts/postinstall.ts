import { cp, mkdir } from 'shelljs';
import { resolve, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const pkg = require('../package.json');
const config = require('../config.json');
mkdir('-p', join(resolve('../../views/containers'), pkg.name));
cp('-Rf', resolve('./app/*'), join(resolve('../../views/containers'), pkg.name));

const rootConfigPath = resolve('../../src/config.json');
let rootConfig;
if (existsSync(rootConfigPath)) {
  rootConfig = JSON.parse(readFileSync(rootConfigPath).toString());
} else {
  rootConfig = { containers: [], plugins: [] };
}
let container = rootConfig.containers.find((x: any) => x.name === pkg.name);
if (container) {
  container = Object.assign(container, config);
} else {
  rootConfig.containers.push(config);
}
writeFileSync(rootConfigPath, JSON.stringify(rootConfig, null, 2), { encoding: 'utf-8' });
