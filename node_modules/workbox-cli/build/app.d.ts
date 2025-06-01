import meow from 'meow';
import { SupportedFlags } from './bin.js';
export declare const app: (params: meow.Result<SupportedFlags>) => Promise<void>;
