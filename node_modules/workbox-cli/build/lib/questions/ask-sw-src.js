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
exports.askSWSrc = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const common_tags_1 = require("common-tags");
// The key used for the question/answer.
const name = 'swSrc';
/**
 * @return {Promise<Answers>} The answers from inquirer.
 */
function askQuestion() {
    return inquirer_1.default.prompt([
        {
            name,
            message: (0, common_tags_1.oneLine) `Where's your existing service worker file? To be used with
      injectManifest, it should include a call to
      'self.__WB_MANIFEST'`,
            type: 'input',
        },
    ]);
}
async function askSWSrc() {
    const answers = await askQuestion();
    // When prompt type is input the return is string or null
    return answers[name] ? answers[name].trim() : null;
}
exports.askSWSrc = askSWSrc;
