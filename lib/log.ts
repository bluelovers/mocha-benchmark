/**
 * Created by user on 2018/6/2/002.
 */

import * as MochaReportersBase from 'mocha/lib/reporters/base';
export * from 'mocha/lib/reporters/base';
import { color as mcolor } from 'mocha/lib/reporters/base';
import { styles } from 'mocha-logger';

import {
	log,
	pending,
	success,
	error,
} from 'mocha-logger';

export {
	log,
	pending,
	success,
	error,
}

export { mcolor, styles }

export { MochaReportersBase }

export function _log(msg: string, s?: string, ...argv: string[])
{
	let fmt = [
		mcolor('error stack', '    ' + (s || '-')),
		msg,
		...argv,
	].join(' ');

	console.log(fmt);
}

export function logSuccess(msg: string, ...argv)
{
	_log(mcolor('bright pass', msg), ...argv);
}
