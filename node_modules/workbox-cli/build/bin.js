#! /usr/bin/env node
"use strict";
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const meow_1 = __importDefault(require("meow"));
const update_notifier_1 = __importDefault(require("update-notifier"));
const app_1 = require("./app");
const cleanup_stack_trace_js_1 = require("./lib/cleanup-stack-trace.js");
const help_text_1 = require("./lib/help-text");
const logger_1 = require("./lib/logger");
void (async () => {
    const params = (0, meow_1.default)(help_text_1.helpText);
    (0, update_notifier_1.default)({ pkg: params.pkg }).notify();
    try {
        await (0, app_1.app)(params);
    }
    catch (error) {
        if (error instanceof Error) {
            // Show the full error and stack trace if we're run with --debug.
            if (params.flags.debug) {
                if (error.stack) {
                    logger_1.logger.error(`\n${error.stack}`);
                }
            }
            else {
                logger_1.logger.error(`\n${error.message}`);
                logger_1.logger.debug(`${(0, cleanup_stack_trace_js_1.cleanupStackTrace)(error, 'app.js')}\n`);
            }
        }
        process.exit(1);
    }
})();
