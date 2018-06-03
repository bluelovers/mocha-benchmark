#!/usr/bin/env node

import yargs = require('yargs2');
import MochaBenchmark from '..';
import crossSpawn = require('cross-spawn');
import path = require('path');

crossSpawn('mocha', [
	'--require',
	//'mocha-benchmark2/register',
	path.join(__dirname, '../register'),
	...yargs.processArgs,
], {
	cwd: process.cwd(),
	stdio: 'inherit',
});
