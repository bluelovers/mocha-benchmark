/**
 * Created by user on 2018/6/2/002.
 */
import * as MochaReportersBase from 'mocha/lib/reporters/base';
export * from 'mocha/lib/reporters/base';
import { color as mcolor } from 'mocha/lib/reporters/base';
import { styles } from 'mocha-logger';
import { log, pending, success, error } from 'mocha-logger';
export { log, pending, success, error, };
export { mcolor, styles };
export { MochaReportersBase };
export declare function _log(msg: string, s?: string, ...argv: string[]): void;
export declare function logSuccess(msg: string, ...argv: any[]): void;
