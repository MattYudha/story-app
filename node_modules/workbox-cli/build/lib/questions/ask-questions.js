"use strict";
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.askQuestions = void 0;
const ask_config_location_1 = require("./ask-config-location");
const ask_extensions_to_cache_1 = require("./ask-extensions-to-cache");
const ask_root_of_web_app_1 = require("./ask-root-of-web-app");
const ask_sw_dest_1 = require("./ask-sw-dest");
const ask_sw_src_1 = require("./ask-sw-src");
const ask_start_url_query_params_1 = require("./ask-start_url-query-params");
async function askQuestions(options = {}) {
    const isInjectManifest = 'injectManifest' in options;
    const globDirectory = await (0, ask_root_of_web_app_1.askRootOfWebApp)();
    const globPatterns = await (0, ask_extensions_to_cache_1.askExtensionsToCache)(globDirectory);
    const swSrc = isInjectManifest ? await (0, ask_sw_src_1.askSWSrc)() : undefined;
    const swDest = await (0, ask_sw_dest_1.askSWDest)(globDirectory);
    const configLocation = await (0, ask_config_location_1.askConfigLocation)();
    // See https://github.com/GoogleChrome/workbox/issues/2985
    const ignoreURLParametersMatching = isInjectManifest
        ? undefined
        : await (0, ask_start_url_query_params_1.askQueryParametersInStartUrl)();
    const config = {
        globDirectory,
        globPatterns,
        swDest,
    };
    if (swSrc) {
        config.swSrc = swSrc;
    }
    if (ignoreURLParametersMatching) {
        config.ignoreURLParametersMatching = ignoreURLParametersMatching;
    }
    return {
        config,
        configLocation,
    };
}
exports.askQuestions = askQuestions;
