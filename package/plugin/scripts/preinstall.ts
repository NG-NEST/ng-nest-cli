import { rm } from 'shelljs';
import { resolve, join } from 'path';
const pkg = require('../package.json');
rm('-rf', join(resolve('../../views/plugins'), pkg.name));
