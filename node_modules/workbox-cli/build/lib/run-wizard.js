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
exports.runWizard = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const common_tags_1 = require("common-tags");
const stringify_object_1 = __importDefault(require("stringify-object"));
const ask_questions_1 = require("./questions/ask-questions");
const logger_1 = require("./logger");
async function runWizard(options = {}) {
    const { configLocation, config } = await (0, ask_questions_1.askQuestions)(options);
    // See https://github.com/GoogleChrome/workbox/issues/2796
    const contents = `module.exports = ${(0, stringify_object_1.default)(config)};`;
    await fs_extra_1.default.writeFile(configLocation, contents);
    const command = 'injectManifest' in options ? 'injectManifest' : 'generateSW';
    logger_1.logger.log(`To build your service worker, run

  workbox ${command} ${configLocation}

as part of a build process. See https://goo.gl/fdTQBf for details.`);
    const configDocsURL = 'injectManifest' in options
        ? 'https://goo.gl/8bs14N'
        : 'https://goo.gl/gVo87N';
    logger_1.logger.log((0, common_tags_1.oneLine) `You can further customize your service worker by making changes
    to ${configLocation}. See ${configDocsURL} for details.`);
}
exports.runWizard = runWizard;
