"use strict";
/// <reference types="mocha" />
/// <reference types="benchmark" />
/// <reference types="chai" />
/// <reference types="node" />
const register_1 = require("./lib/register");
let g;
g = register_1.registerGlobal();
module.exports = g;
