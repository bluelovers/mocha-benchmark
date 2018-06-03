/// <reference types="mocha" />
/// <reference types="benchmark" />
/// <reference types="chai" />
/// <reference types="node" />

import * as MochaBenchmark from './mocha_benchmark';
import { registerGlobal } from './lib/register';
import { IGlobal } from './mocha_benchmark';
import Benchmark = require('benchmark');
import * as _chai from 'chai';

let g: ReturnType<typeof registerGlobal>;
g = registerGlobal();

export = g;
