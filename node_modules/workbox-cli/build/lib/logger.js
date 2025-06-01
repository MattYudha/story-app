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
exports.logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.logger = {
    debug: (...args) => console.log(chalk_1.default.gray(...args)),
    log: (...args) => console.log(...args),
    warn: (...args) => console.warn(chalk_1.default.yellow(...args)),
    error: (...args) => console.error(chalk_1.default.red.bold(...args)),
};
