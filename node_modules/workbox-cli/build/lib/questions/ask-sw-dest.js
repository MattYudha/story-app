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
exports.askSWDest = void 0;
const assert_1 = __importDefault(require("assert"));
const inquirer_1 = __importDefault(require("inquirer"));
const upath_1 = __importDefault(require("upath"));
const errors_1 = require("../errors");
// The key used for the question/answer.
const name = 'swDest';
/**
 * @param {string} defaultDir
 * @return {Promise<Answers>} The answers from inquirer.
 */
function askQuestion(defaultDir) {
    return inquirer_1.default.prompt([
        {
            name,
            message: `Where would you like your service worker file to be saved?`,
            type: 'input',
            default: upath_1.default.join(defaultDir, 'sw.js'),
        },
    ]);
}
async function askSWDest(defaultDir = '.') {
    const answers = await askQuestion(defaultDir);
    // When prompt type is input the return type is string
    // casting is safe
    const swDest = answers[name].trim();
    (0, assert_1.default)(swDest, errors_1.errors['invalid-sw-dest']);
    return swDest;
}
exports.askSWDest = askSWDest;
