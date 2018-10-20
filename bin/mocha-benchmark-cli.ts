#!/usr/bin/env node

import yargs = require('yargs2');
import MochaBenchmark from '..';
import crossSpawn = require('cross-spawn-extra');
import path = require('path');
import updateNotifier = require( 'update-notifier' );
import pkg = require( '../package.json' );

updateNotifier({ pkg }).notify();

crossSpawn.async('mocha', [
	'--require',
	//'mocha-benchmark2/register',
	path.join(__dirname, '../register'),
	...yargs.processArgs,
], {
	cwd: process.cwd(),
	stdio: 'inherit',
});
