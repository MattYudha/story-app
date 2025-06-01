#! /usr/bin/env node
import meow from 'meow';
export interface SupportedFlags extends meow.AnyFlags {
    debug: meow.BooleanFlag;
    injectManifest: meow.BooleanFlag;
    watch: meow.BooleanFlag;
}
