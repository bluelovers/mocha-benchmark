import { registerGlobal } from './lib/register';
declare let g: ReturnType<typeof registerGlobal>;
export = g;
