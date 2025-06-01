"use strict";
/*
  Copyright 2021 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askQueryParametersInStartUrl = void 0;
const assert_1 = __importDefault(require("assert"));
const inquirer_1 = __importDefault(require("inquirer"));
const common_tags_1 = require("common-tags");
const errors_1 = require("../errors");
const constants_1 = require("../constants");
const START_URL_QUERY_PARAMS_PROMPT = 'Please enter the search parameter(s) that you would like to ignore (separated by comma):';
// The keys used for the questions/answers.
const question_ignoreURLParametersMatching = 'ignoreURLParametersMatching';
const question_shouldAskForIgnoreURLParametersMatching = 'shouldAskForIgnoreURLParametersMatching';
/**
 * @return {Promise<Object>} The answers from inquirer.
 */
async function askQuestion() {
    return inquirer_1.default.prompt([
        {
            name: question_shouldAskForIgnoreURLParametersMatching,
            message: (0, common_tags_1.oneLine) `Does your web app manifest include search parameter(s)
      in the 'start_url', other than 'utm_' or 'fbclid'
      (like '?source=pwa')?`,
            type: 'confirm',
            default: false,
        },
        {
            name: question_ignoreURLParametersMatching,
            when: (answer) => answer.shouldAskForIgnoreURLParametersMatching,
            message: START_URL_QUERY_PARAMS_PROMPT,
            type: 'input',
        },
    ]);
}
async function askQueryParametersInStartUrl(defaultIgnoredSearchParameters = constants_1.constants.ignoreURLParametersMatching) {
    const { shouldAskForIgnoreURLParametersMatching, ignoreURLParametersMatching = '', } = await askQuestion();
    if (!shouldAskForIgnoreURLParametersMatching) {
        return defaultIgnoredSearchParameters;
    }
    (0, assert_1.default)(ignoreURLParametersMatching.length > 0, errors_1.errors['no-search-parameters-supplied']);
    const ignoreSearchParameters = ignoreURLParametersMatching
        .trim()
        .split(',')
        .filter(Boolean);
    (0, assert_1.default)(ignoreSearchParameters.length > 0, errors_1.errors['no-search-parameters-supplied']);
    (0, assert_1.default)(ignoreSearchParameters.every((param) => !param.match(/^[^\w|-]/g)), errors_1.errors['invalid-search-parameters-supplied']);
    return defaultIgnoredSearchParameters.concat(ignoreSearchParameters.map((searchParam) => new RegExp(`^${searchParam}`)));
}
exports.askQueryParametersInStartUrl = askQueryParametersInStartUrl;
