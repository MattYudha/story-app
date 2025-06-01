"use strict";
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const common_tags_1 = require("common-tags");
const workboxBuild = __importStar(require("workbox-build"));
const assert_1 = __importDefault(require("assert"));
const chokidar_1 = __importDefault(require("chokidar"));
const pretty_bytes_1 = __importDefault(require("pretty-bytes"));
const upath_1 = __importDefault(require("upath"));
const constants_js_1 = require("./lib/constants.js");
const errors_js_1 = require("./lib/errors.js");
const logger_js_1 = require("./lib/logger.js");
const read_config_js_1 = require("./lib/read-config.js");
const run_wizard_js_1 = require("./lib/run-wizard.js");
/**
 * Runs the specified build command with the provided configuration.
 *
 * @param {Object} options
 */
async function runBuildCommand({ command, config, watch }) {
    const { count, filePaths, size, warnings } = await workboxBuild[command](config);
    for (const warning of warnings) {
        logger_js_1.logger.warn(warning);
    }
    if (filePaths.length === 1) {
        logger_js_1.logger.log(`The service worker file was written to ${config.swDest}`);
    }
    else {
        const message = filePaths
            .sort()
            .map((filePath) => `  • ${filePath}`)
            .join(`\n`);
        logger_js_1.logger.log(`The service worker files were written to:\n${message}`);
    }
    logger_js_1.logger.log(`The service worker will precache ${count} URLs, ` +
        `totaling ${(0, pretty_bytes_1.default)(size)}.`);
    if (watch) {
        logger_js_1.logger.log(`\nWatching for changes...`);
    }
}
const app = async (params) => {
    var _a;
    // This should not be a user-visible error, unless meow() messes something up.
    (0, assert_1.default)(params && Array.isArray(params.input), errors_js_1.errors['missing-input']);
    // Default to showing the help message if there's no command provided.
    const [command = 'help', option] = params.input;
    switch (command) {
        case 'wizard': {
            await (0, run_wizard_js_1.runWizard)(params.flags);
            break;
        }
        case 'copyLibraries': {
            (0, assert_1.default)(option, errors_js_1.errors['missing-dest-dir-param']);
            const parentDirectory = upath_1.default.resolve(process.cwd(), option);
            const dirName = await workboxBuild.copyWorkboxLibraries(parentDirectory);
            const fullPath = upath_1.default.join(parentDirectory, dirName);
            logger_js_1.logger.log(`The Workbox libraries were copied to ${fullPath}`);
            logger_js_1.logger.log((0, common_tags_1.oneLine) `Add a call to workbox.setConfig({modulePathPrefix: '...'})
        to your service worker to use these local libraries.`);
            logger_js_1.logger.log(`See https://goo.gl/Fo9gPX for further documentation.`);
            break;
        }
        case 'generateSW':
        case 'injectManifest': {
            const configPath = upath_1.default.resolve(process.cwd(), option || constants_js_1.constants.defaultConfigFile);
            let configFromDisk;
            try {
                configFromDisk = (0, read_config_js_1.readConfig)(configPath);
            }
            catch (error) {
                if (error instanceof Error) {
                    logger_js_1.logger.error(errors_js_1.errors['invalid-common-js-module']);
                    throw error;
                }
            }
            logger_js_1.logger.log(`Using configuration from ${configPath}.`);
            const config = configFromDisk;
            // Determine whether we're in --watch mode, or one-off mode.
            if ((_a = params === null || params === void 0 ? void 0 : params.flags) === null || _a === void 0 ? void 0 : _a.watch) {
                const options = {
                    ignoreInitial: true,
                };
                if (config.globIgnores) {
                    options.ignored = config.globIgnores;
                }
                if (config.globDirectory) {
                    options.cwd = config.globDirectory;
                }
                if (config.globPatterns) {
                    chokidar_1.default
                        .watch(config.globPatterns, options)
                        .on('all', async () => {
                        await runBuildCommand({ command, config, watch: true });
                    })
                        .on('ready', async () => {
                        await runBuildCommand({ command, config, watch: true });
                    })
                        .on('error', (err) => {
                        logger_js_1.logger.error(err.toString());
                    });
                }
            }
            else {
                await runBuildCommand({ command, config, watch: false });
            }
            break;
        }
        case 'help': {
            params.showHelp();
            break;
        }
        default: {
            throw new Error(errors_js_1.errors['unknown-command'] + ` ` + command);
        }
    }
};
exports.app = app;
