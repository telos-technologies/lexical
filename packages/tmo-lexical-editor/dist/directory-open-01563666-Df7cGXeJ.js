/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var e=async(e=[{}])=>(Array.isArray(e)||(e=[e]),e[0].recursive=e[0].recursive||!1,new Promise((t,r)=>{const i=document.createElement("input");i.type="file",i.webkitdirectory=!0;const c=e=>{"function"==typeof a&&a(),t(e);},a=e[0].legacySetup&&e[0].legacySetup(c,()=>a(r),i);i.addEventListener("change",()=>{let t=Array.from(i.files);e[0].recursive?e[0].recursive&&e[0].skipDirectory&&(t=t.filter(t=>t.webkitRelativePath.split("/").every(t=>!e[0].skipDirectory({name:t,kind:"directory"})))):t=t.filter(e=>2===e.webkitRelativePath.split("/").length),c(t);}),i.click();}));

exports.default = e;
