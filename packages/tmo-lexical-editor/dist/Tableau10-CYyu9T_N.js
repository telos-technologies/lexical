/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

function colors(specifier) {
  var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
  while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
  return colors;
}

var schemeTableau10 = colors("4e79a7f28e2ce1575976b7b259a14fedc949af7aa1ff9da79c755fbab0ab");

exports.schemeTableau10 = schemeTableau10;
