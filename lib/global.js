"use strict";
/// <reference types="mocha" />
/// <reference types="benchmark" />
/// <reference types="chai" />
/// <reference types="node" />
function getGlobal() {
    if (typeof global !== 'undefined') {
        // @ts-ignore
        return global;
    }
    else if (typeof window !== 'undefined') {
        // @ts-ignore
        return window;
    }
    else if (typeof self !== 'undefined') {
        // @ts-ignore
        return self;
    }
    else if (typeof this !== 'undefined') {
        // @ts-ignore
        return this;
    }
    else {
        // @ts-ignore
        return {};
    }
}
module.exports = getGlobal.call(this);
