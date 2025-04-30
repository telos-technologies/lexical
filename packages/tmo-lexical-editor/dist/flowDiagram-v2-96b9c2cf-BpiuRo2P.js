/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var flowDb956e92f1 = require('./flowDb-956e92f1-DT_uCbmG.js');
var stylesC10674c1 = require('./styles-c10674c1-UNHdFv00.js');
var index = require('./index-mmnU_sIP.js');
require('./index-3862675e-CyeVLxrY.js');
require('./layout-DwrzENB5.js');
require('./graph-C1bSurKb.js');
require('./percentages-YKFLWNK2-B6-AE232.js');
require('@lexical/link');
require('@lexical/list');
require('@lexical/react/LexicalComposer');
require('@lexical/rich-text');
require('lexical');
require('react');
require('react-dom');
require('react/jsx-runtime');
require('@lexical/react/LexicalHistoryPlugin');
require('@lexical/react/LexicalAutoFocusPlugin');
require('@lexical/react/LexicalCharacterLimitPlugin');
require('@lexical/react/LexicalCheckListPlugin');
require('@lexical/react/LexicalClearEditorPlugin');
require('@lexical/react/LexicalClickableLinkPlugin');
require('@lexical/react/LexicalCollaborationPlugin');
require('@lexical/react/LexicalComposerContext');
require('@lexical/react/LexicalErrorBoundary');
require('@lexical/react/LexicalHashtagPlugin');
require('@lexical/react/LexicalHorizontalRulePlugin');
require('@lexical/react/LexicalListPlugin');
require('@lexical/react/LexicalPlainTextPlugin');
require('@lexical/react/LexicalRichTextPlugin');
require('@lexical/react/LexicalSelectionAlwaysOnDisplay');
require('@lexical/react/LexicalTabIndentationPlugin');
require('@lexical/react/LexicalTablePlugin');
require('@lexical/react/useLexicalEditable');
require('@lexical/utils');
require('y-websocket');
require('yjs');
require('@lexical/code');
require('@lexical/file');
require('@lexical/markdown');
require('@lexical/react/LexicalCollaborationContext');
require('@lexical/yjs');
require('@lexical/react/LexicalHorizontalRuleNode');
require('@lexical/table');
require('@lexical/hashtag');
require('@lexical/react/LexicalBlockWithAlignableContents');
require('@lexical/react/LexicalDecoratorBlockNode');
require('@lexical/selection');
require('@lexical/react/LexicalAutoEmbedPlugin');
require('@lexical/react/LexicalAutoLinkPlugin');
require('@lexical/mark');
require('@lexical/react/LexicalEditorRefPlugin');
require('@lexical/react/LexicalOnChangePlugin');
require('@lexical/text');
require('@lexical/react/LexicalContentEditable');
require('@lexical/react/LexicalTypeaheadMenuPlugin');
require('@lexical/react/useLexicalNodeSelection');
require('@lexical/react/LexicalContextMenuPlugin');
require('@lexical/react/LexicalDraggableBlockPlugin');
require('@lexical/react/useLexicalTextEntity');
require('@lexical/react/LexicalLinkPlugin');
require('@lexical/react/LexicalMarkdownShortcutPlugin');
require('@lexical/react/LexicalTableOfContentsPlugin');
require('@lexical/react/LexicalTreeView');
require('@lexical/overflow');
require('./clone-ChVJxP3t.js');
require('./edges-e0da2a9e-BalRcvg1.js');
require('./createText-2e5e7dd3-CEpT7yZY.js');
require('./line-BTiOMuO4.js');
require('./array-CXkWfjpv.js');
require('./path-DJdBAFfR.js');
require('./channel-CPoLGWF7.js');

const diagram = {
  parser: flowDb956e92f1.parser$1,
  db: flowDb956e92f1.flowDb,
  renderer: stylesC10674c1.flowRendererV2,
  styles: stylesC10674c1.flowStyles,
  init: (cnf) => {
    if (!cnf.flowchart) {
      cnf.flowchart = {};
    }
    cnf.flowchart.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
    index.setConfig({ flowchart: { arrowMarkerAbsolute: cnf.arrowMarkerAbsolute } });
    stylesC10674c1.flowRendererV2.setConf(cnf.flowchart);
    flowDb956e92f1.flowDb.clear();
    flowDb956e92f1.flowDb.setGen("gen-2");
  }
};

exports.diagram = diagram;
