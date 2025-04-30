/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { mergeRegister } from '@lexical/utils';
import { isHTMLElement, $getNodeByKey, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_HIGH, KEY_ESCAPE_COMMAND, $getSelection, $isNodeSelection } from 'lexical';
import { forwardRef, useState, useRef, useCallback, useEffect } from 'react';
import { b as $isEquationNode, r as reactErrorBoundary_umdExports, K as KatexRenderer } from './percentages-YKFLWNK2-BpgWzMVa.js';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import '@lexical/link';
import '@lexical/list';
import '@lexical/react/LexicalComposer';
import '@lexical/rich-text';
import 'react-dom';
import '@lexical/react/LexicalHistoryPlugin';
import '@lexical/react/LexicalAutoFocusPlugin';
import '@lexical/react/LexicalCharacterLimitPlugin';
import '@lexical/react/LexicalCheckListPlugin';
import '@lexical/react/LexicalClearEditorPlugin';
import '@lexical/react/LexicalClickableLinkPlugin';
import '@lexical/react/LexicalCollaborationPlugin';
import '@lexical/react/LexicalErrorBoundary';
import '@lexical/react/LexicalHashtagPlugin';
import '@lexical/react/LexicalHorizontalRulePlugin';
import '@lexical/react/LexicalListPlugin';
import '@lexical/react/LexicalPlainTextPlugin';
import '@lexical/react/LexicalRichTextPlugin';
import '@lexical/react/LexicalSelectionAlwaysOnDisplay';
import '@lexical/react/LexicalTabIndentationPlugin';
import '@lexical/react/LexicalTablePlugin';
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

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function EquationEditor({
  equation,
  setEquation,
  inline
}, forwardedRef) {
  const onChange = event => {
    setEquation(event.target.value);
  };
  return inline && isHTMLElement(forwardedRef) ? /*#__PURE__*/jsxs("span", {
    className: "EquationEditor_inputBackground",
    children: [/*#__PURE__*/jsx("span", {
      className: "EquationEditor_dollarSign",
      children: "$"
    }), /*#__PURE__*/jsx("input", {
      className: "EquationEditor_inlineEditor",
      value: equation,
      onChange: onChange,
      autoFocus: true,
      ref: forwardedRef
    }), /*#__PURE__*/jsx("span", {
      className: "EquationEditor_dollarSign",
      children: "$"
    })]
  }) : /*#__PURE__*/jsxs("div", {
    className: "EquationEditor_inputBackground",
    children: [/*#__PURE__*/jsx("span", {
      className: "EquationEditor_dollarSign",
      children: '$$\n'
    }), /*#__PURE__*/jsx("textarea", {
      className: "EquationEditor_blockEditor",
      value: equation,
      onChange: onChange,
      ref: forwardedRef
    }), /*#__PURE__*/jsx("span", {
      className: "EquationEditor_dollarSign",
      children: '\n$$'
    })]
  });
}
var EquationEditor$1 = /*#__PURE__*/forwardRef(EquationEditor);

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function EquationComponent({
  equation,
  inline,
  nodeKey
}) {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const [equationValue, setEquationValue] = useState(equation);
  const [showEquationEditor, setShowEquationEditor] = useState(false);
  const inputRef = useRef(null);
  const onHide = useCallback(restoreSelection => {
    setShowEquationEditor(false);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isEquationNode(node)) {
        node.setEquation(equationValue);
        if (restoreSelection) {
          node.selectNext(0, 0);
        }
      }
    });
  }, [editor, equationValue, nodeKey]);
  useEffect(() => {
    if (!showEquationEditor && equationValue !== equation) {
      setEquationValue(equation);
    }
  }, [showEquationEditor, equation, equationValue]);
  useEffect(() => {
    if (!isEditable) {
      return;
    }
    if (showEquationEditor) {
      return mergeRegister(editor.registerCommand(SELECTION_CHANGE_COMMAND, payload => {
        const activeElement = document.activeElement;
        const inputElem = inputRef.current;
        if (inputElem !== activeElement) {
          onHide();
        }
        return false;
      }, COMMAND_PRIORITY_HIGH), editor.registerCommand(KEY_ESCAPE_COMMAND, payload => {
        const activeElement = document.activeElement;
        const inputElem = inputRef.current;
        if (inputElem === activeElement) {
          onHide(true);
          return true;
        }
        return false;
      }, COMMAND_PRIORITY_HIGH));
    } else {
      return editor.registerUpdateListener(({
        editorState
      }) => {
        const isSelected = editorState.read(() => {
          const selection = $getSelection();
          return $isNodeSelection(selection) && selection.has(nodeKey) && selection.getNodes().length === 1;
        });
        if (isSelected) {
          setShowEquationEditor(true);
        }
      });
    }
  }, [editor, nodeKey, onHide, showEquationEditor, isEditable]);
  return /*#__PURE__*/jsx(Fragment, {
    children: showEquationEditor && isEditable ? /*#__PURE__*/jsx(EquationEditor$1, {
      equation: equationValue,
      setEquation: setEquationValue,
      inline: inline,
      ref: inputRef
    }) : /*#__PURE__*/jsx(reactErrorBoundary_umdExports.ErrorBoundary, {
      onError: e => editor._onError(e),
      fallback: null,
      children: /*#__PURE__*/jsx(KatexRenderer, {
        equation: equationValue,
        inline: inline,
        onDoubleClick: () => {
          if (isEditable) {
            setShowEquationEditor(true);
          }
        }
      })
    })
  });
}

export { EquationComponent as default };
