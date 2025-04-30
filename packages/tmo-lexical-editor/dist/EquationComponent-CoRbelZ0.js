/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var LexicalComposerContext = require('@lexical/react/LexicalComposerContext');
var useLexicalEditable = require('@lexical/react/useLexicalEditable');
var utils = require('@lexical/utils');
var lexical = require('lexical');
var React = require('react');
var TmoLexicalEditor = require('./percentages-YKFLWNK2-CsBndlsw.js');
var jsxRuntime = require('react/jsx-runtime');
require('@lexical/link');
require('@lexical/list');
require('@lexical/react/LexicalComposer');
require('@lexical/rich-text');
require('react-dom');
require('@lexical/react/LexicalHistoryPlugin');
require('@lexical/react/LexicalAutoFocusPlugin');
require('@lexical/react/LexicalCharacterLimitPlugin');
require('@lexical/react/LexicalCheckListPlugin');
require('@lexical/react/LexicalClearEditorPlugin');
require('@lexical/react/LexicalClickableLinkPlugin');
require('@lexical/react/LexicalCollaborationPlugin');
require('@lexical/react/LexicalErrorBoundary');
require('@lexical/react/LexicalHashtagPlugin');
require('@lexical/react/LexicalHorizontalRulePlugin');
require('@lexical/react/LexicalListPlugin');
require('@lexical/react/LexicalPlainTextPlugin');
require('@lexical/react/LexicalRichTextPlugin');
require('@lexical/react/LexicalSelectionAlwaysOnDisplay');
require('@lexical/react/LexicalTabIndentationPlugin');
require('@lexical/react/LexicalTablePlugin');
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
  return inline && lexical.isHTMLElement(forwardedRef) ? /*#__PURE__*/jsxRuntime.jsxs("span", {
    className: "EquationEditor_inputBackground",
    children: [/*#__PURE__*/jsxRuntime.jsx("span", {
      className: "EquationEditor_dollarSign",
      children: "$"
    }), /*#__PURE__*/jsxRuntime.jsx("input", {
      className: "EquationEditor_inlineEditor",
      value: equation,
      onChange: onChange,
      autoFocus: true,
      ref: forwardedRef
    }), /*#__PURE__*/jsxRuntime.jsx("span", {
      className: "EquationEditor_dollarSign",
      children: "$"
    })]
  }) : /*#__PURE__*/jsxRuntime.jsxs("div", {
    className: "EquationEditor_inputBackground",
    children: [/*#__PURE__*/jsxRuntime.jsx("span", {
      className: "EquationEditor_dollarSign",
      children: '$$\n'
    }), /*#__PURE__*/jsxRuntime.jsx("textarea", {
      className: "EquationEditor_blockEditor",
      value: equation,
      onChange: onChange,
      ref: forwardedRef
    }), /*#__PURE__*/jsxRuntime.jsx("span", {
      className: "EquationEditor_dollarSign",
      children: '\n$$'
    })]
  });
}
var EquationEditor$1 = /*#__PURE__*/React.forwardRef(EquationEditor);

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
  const [editor] = LexicalComposerContext.useLexicalComposerContext();
  const isEditable = useLexicalEditable.useLexicalEditable();
  const [equationValue, setEquationValue] = React.useState(equation);
  const [showEquationEditor, setShowEquationEditor] = React.useState(false);
  const inputRef = React.useRef(null);
  const onHide = React.useCallback(restoreSelection => {
    setShowEquationEditor(false);
    editor.update(() => {
      const node = lexical.$getNodeByKey(nodeKey);
      if (TmoLexicalEditor.$isEquationNode(node)) {
        node.setEquation(equationValue);
        if (restoreSelection) {
          node.selectNext(0, 0);
        }
      }
    });
  }, [editor, equationValue, nodeKey]);
  React.useEffect(() => {
    if (!showEquationEditor && equationValue !== equation) {
      setEquationValue(equation);
    }
  }, [showEquationEditor, equation, equationValue]);
  React.useEffect(() => {
    if (!isEditable) {
      return;
    }
    if (showEquationEditor) {
      return utils.mergeRegister(editor.registerCommand(lexical.SELECTION_CHANGE_COMMAND, payload => {
        const activeElement = document.activeElement;
        const inputElem = inputRef.current;
        if (inputElem !== activeElement) {
          onHide();
        }
        return false;
      }, lexical.COMMAND_PRIORITY_HIGH), editor.registerCommand(lexical.KEY_ESCAPE_COMMAND, payload => {
        const activeElement = document.activeElement;
        const inputElem = inputRef.current;
        if (inputElem === activeElement) {
          onHide(true);
          return true;
        }
        return false;
      }, lexical.COMMAND_PRIORITY_HIGH));
    } else {
      return editor.registerUpdateListener(({
        editorState
      }) => {
        const isSelected = editorState.read(() => {
          const selection = lexical.$getSelection();
          return lexical.$isNodeSelection(selection) && selection.has(nodeKey) && selection.getNodes().length === 1;
        });
        if (isSelected) {
          setShowEquationEditor(true);
        }
      });
    }
  }, [editor, nodeKey, onHide, showEquationEditor, isEditable]);
  return /*#__PURE__*/jsxRuntime.jsx(jsxRuntime.Fragment, {
    children: showEquationEditor && isEditable ? /*#__PURE__*/jsxRuntime.jsx(EquationEditor$1, {
      equation: equationValue,
      setEquation: setEquationValue,
      inline: inline,
      ref: inputRef
    }) : /*#__PURE__*/jsxRuntime.jsx(TmoLexicalEditor.reactErrorBoundary_umdExports.ErrorBoundary, {
      onError: e => editor._onError(e),
      fallback: null,
      children: /*#__PURE__*/jsxRuntime.jsx(TmoLexicalEditor.KatexRenderer, {
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

exports.default = EquationComponent;
