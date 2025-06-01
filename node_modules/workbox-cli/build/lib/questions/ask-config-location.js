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
exports.askConfigLocation = void 0;
const assert_1 = __importDefault(require("assert"));
const inquirer_1 = __importDefault(require("inquirer"));
const common_tags_1 = require("common-tags");
const constants_1 = require("../constants");
const errors_1 = require("../errors");
// The key used for the question/answer.
const name = 'configLocation';
const configLocationQuestion = {
    name,
    message: (0, common_tags_1.oneLine) `Where would you like to save these configuration options?`,
    type: 'input',
    default: constants_1.constants.defaultConfigFile,
};
/**
 * @return {Promise<Answers>} The answers from inquirer.
 */
function askQuestion() {
    return inquirer_1.default.prompt([configLocationQuestion]);
}
async function askConfigLocation() {
    const answers = await askQuestion();
    // The value of the answer when the question type is 'input' is String
    // and it has a default value, the casting is safe.
    const configLocation = answers[name].trim();
    (0, assert_1.default)(configLocation, errors_1.errors['invalid-config-location']);
    return configLocation;
}
exports.askConfigLocation = askConfigLocation;
