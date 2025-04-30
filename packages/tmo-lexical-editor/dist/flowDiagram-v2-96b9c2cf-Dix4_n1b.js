/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { p as parser$1, f as flowDb } from './flowDb-956e92f1-9sMdT6m5.js';
import { f as flowRendererV2, a as flowStyles } from './styles-c10674c1-CKcqsMiz.js';
import { y as setConfig } from './index-MRVkW6E9.js';
import './index-3862675e-DeDnAbqF.js';
import './layout-Dqhl35L6.js';
import './graph-CKINgRXB.js';
import './percentages-YKFLWNK2-Cd-ZN6k-.js';
import '@lexical/link';
import '@lexical/list';
import '@lexical/react/LexicalComposer';
import '@lexical/rich-text';
import 'lexical';
import 'react';
import 'react-dom';
import 'react/jsx-runtime';
import '@lexical/react/LexicalHistoryPlugin';
import '@lexical/react/LexicalAutoFocusPlugin';
import '@lexical/react/LexicalCharacterLimitPlugin';
import '@lexical/react/LexicalCheckListPlugin';
import '@lexical/react/LexicalClearEditorPlugin';
import '@lexical/react/LexicalClickableLinkPlugin';
import '@lexical/react/LexicalCollaborationPlugin';
import '@lexical/react/LexicalComposerContext';
import '@lexical/react/LexicalErrorBoundary';
import '@lexical/react/LexicalHashtagPlugin';
import '@lexical/react/LexicalHorizontalRulePlugin';
import '@lexical/react/LexicalListPlugin';
import '@lexical/react/LexicalPlainTextPlugin';
import '@lexical/react/LexicalRichTextPlugin';
import '@lexical/react/LexicalSelectionAlwaysOnDisplay';
import '@lexical/react/LexicalTabIndentationPlugin';
import '@lexical/react/LexicalTablePlugin';
import '@lexical/react/useLexicalEditable';
import '@lexical/utils';
import 'y-websocket';
import 'yjs';
import '@lexical/code';
import '@lexical/file';
import '@lexical/markdown';
import '@lexical/react/LexicalCollaborationContext';
import '@lexical/yjs';
import '@lexical/react/LexicalHorizontalRuleNode';
import '@lexical/table';
import '@lexical/hashtag';
import '@lexical/react/LexicalBlockWithAlignableContents';
import '@lexical/react/LexicalDecoratorBlockNode';
import '@lexical/selection';
import '@lexical/react/LexicalAutoEmbedPlugin';
import '@lexical/react/LexicalAutoLinkPlugin';
import '@lexical/mark';
import '@lexical/react/LexicalEditorRefPlugin';
import '@lexical/react/LexicalOnChangePlugin';
import '@lexical/text';
import '@lexical/react/LexicalContentEditable';
import '@lexical/react/LexicalTypeaheadMenuPlugin';
import '@lexical/react/useLexicalNodeSelection';
import '@lexical/react/LexicalContextMenuPlugin';
import '@lexical/react/LexicalDraggableBlockPlugin';
import '@lexical/react/useLexicalTextEntity';
import '@lexical/react/LexicalLinkPlugin';
import '@lexical/react/LexicalMarkdownShortcutPlugin';
import '@lexical/react/LexicalTableOfContentsPlugin';
import '@lexical/react/LexicalTreeView';
import '@lexical/overflow';
import './clone-4vKt71Pb.js';
import './edges-e0da2a9e-zCAc__9h.js';
import './createText-2e5e7dd3-D8Qvg8bo.js';
import './line-CI6kb-bB.js';
import './array-BLOdk0P2.js';
import './path-C-hNZtgA.js';
import './channel-CKe_F0T4.js';

const diagram = {
  parser: parser$1,
  db: flowDb,
  renderer: flowRendererV2,
  styles: flowStyles,
  init: (cnf) => {
    if (!cnf.flowchart) {
      cnf.flowchart = {};
    }
    cnf.flowchart.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
    setConfig({ flowchart: { arrowMarkerAbsolute: cnf.arrowMarkerAbsolute } });
    flowRendererV2.setConf(cnf.flowchart);
    flowDb.clear();
    flowDb.setGen("gen-2");
  }
};

export { diagram };
