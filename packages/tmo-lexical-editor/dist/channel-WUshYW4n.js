/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var index = require('./index-JCRl9uKO.js');

/* IMPORT */
/* MAIN */
const channel = (color, channel) => {
    return index.Utils.lang.round(index.Color.parse(color)[channel]);
};

exports.channel = channel;
