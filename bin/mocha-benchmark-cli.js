#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs2");
const crossSpawn = require("cross-spawn");
const path = require("path");
crossSpawn('mocha', [
    '--require',
    //'mocha-benchmark2/register',
    path.join(__dirname, '../register'),
    ...yargs.processArgs,
], {
    cwd: process.cwd(),
    stdio: 'inherit',
});
