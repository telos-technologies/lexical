/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var LexicalCollaborationContext = require('@lexical/react/LexicalCollaborationContext');
var LexicalComposerContext = require('@lexical/react/LexicalComposerContext');
var useLexicalNodeSelection = require('@lexical/react/useLexicalNodeSelection');
var utils = require('@lexical/utils');
var lexical = require('lexical');
var React = require('react');
var TmoLexicalEditor = require('./percentages-YKFLWNK2-B6-AE232.js');
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
require('@lexical/react/useLexicalEditable');
require('y-websocket');
require('yjs');
require('@lexical/code');
require('@lexical/file');
require('@lexical/markdown');
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

function getTotalVotes(options) {
  return options.reduce((totalVotes, next) => {
    return totalVotes + next.votes.length;
  }, 0);
}
function PollOptionComponent({
  option,
  index,
  options,
  totalVotes,
  withPollNode
}) {
  const {
    clientID
  } = LexicalCollaborationContext.useCollaborationContext();
  const checkboxRef = React.useRef(null);
  const votesArray = option.votes;
  const checkedIndex = votesArray.indexOf(clientID);
  const checked = checkedIndex !== -1;
  const votes = votesArray.length;
  const text = option.text;
  return /*#__PURE__*/jsxRuntime.jsxs("div", {
    className: "PollNode__optionContainer",
    children: [/*#__PURE__*/jsxRuntime.jsx("div", {
      className: TmoLexicalEditor.joinClasses('PollNode__optionCheckboxWrapper', checked && 'PollNode__optionCheckboxChecked'),
      children: /*#__PURE__*/jsxRuntime.jsx("input", {
        ref: checkboxRef,
        className: "PollNode__optionCheckbox",
        type: "checkbox",
        onChange: e => {
          withPollNode(node => {
            node.toggleVote(option, clientID);
          });
        },
        checked: checked
      })
    }), /*#__PURE__*/jsxRuntime.jsxs("div", {
      className: "PollNode__optionInputWrapper",
      children: [/*#__PURE__*/jsxRuntime.jsx("div", {
        className: "PollNode__optionInputVotes",
        style: {
          width: `${votes === 0 ? 0 : votes / totalVotes * 100}%`
        }
      }), /*#__PURE__*/jsxRuntime.jsx("span", {
        className: "PollNode__optionInputVotesCount",
        children: votes > 0 && (votes === 1 ? '1 vote' : `${votes} votes`)
      }), /*#__PURE__*/jsxRuntime.jsx("input", {
        className: "PollNode__optionInput",
        type: "text",
        value: text,
        onChange: e => {
          const target = e.target;
          const value = target.value;
          const selectionStart = target.selectionStart;
          const selectionEnd = target.selectionEnd;
          withPollNode(node => {
            node.setOptionText(option, value);
          }, () => {
            target.selectionStart = selectionStart;
            target.selectionEnd = selectionEnd;
          });
        },
        placeholder: `Option ${index + 1}`
      })]
    }), /*#__PURE__*/jsxRuntime.jsx("button", {
      disabled: options.length < 3,
      className: TmoLexicalEditor.joinClasses('PollNode__optionDelete', options.length < 3 && 'PollNode__optionDeleteDisabled'),
      "aria-label": "Remove",
      onClick: () => {
        withPollNode(node => {
          node.deleteOption(option);
        });
      }
    })]
  });
}
function PollComponent({
  question,
  options,
  nodeKey
}) {
  const [editor] = LexicalComposerContext.useLexicalComposerContext();
  const totalVotes = React.useMemo(() => getTotalVotes(options), [options]);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection.useLexicalNodeSelection(nodeKey);
  const [selection, setSelection] = React.useState(null);
  const ref = React.useRef(null);
  React.useEffect(() => {
    return utils.mergeRegister(editor.registerUpdateListener(({
      editorState
    }) => {
      setSelection(editorState.read(() => lexical.$getSelection()));
    }), editor.registerCommand(lexical.CLICK_COMMAND, payload => {
      const event = payload;
      if (event.target === ref.current) {
        if (!event.shiftKey) {
          clearSelection();
        }
        setSelected(!isSelected);
        return true;
      }
      return false;
    }, lexical.COMMAND_PRIORITY_LOW));
  }, [clearSelection, editor, isSelected, nodeKey, setSelected]);
  const withPollNode = (cb, onUpdate) => {
    editor.update(() => {
      const node = lexical.$getNodeByKey(nodeKey);
      if (TmoLexicalEditor.$isPollNode(node)) {
        cb(node);
      }
    }, {
      onUpdate
    });
  };
  const addOption = () => {
    withPollNode(node => {
      node.addOption(TmoLexicalEditor.createPollOption());
    });
  };
  const isFocused = lexical.$isNodeSelection(selection) && isSelected;
  return /*#__PURE__*/jsxRuntime.jsx("div", {
    className: `PollNode__container ${isFocused ? 'focused' : ''}`,
    ref: ref,
    children: /*#__PURE__*/jsxRuntime.jsxs("div", {
      className: "PollNode__inner",
      children: [/*#__PURE__*/jsxRuntime.jsx("h2", {
        className: "PollNode__heading",
        children: question
      }), options.map((option, index) => {
        const key = option.uid;
        return /*#__PURE__*/jsxRuntime.jsx(PollOptionComponent, {
          withPollNode: withPollNode,
          option: option,
          index: index,
          options: options,
          totalVotes: totalVotes
        }, key);
      }), /*#__PURE__*/jsxRuntime.jsx("div", {
        className: "PollNode__footer",
        children: /*#__PURE__*/jsxRuntime.jsx(TmoLexicalEditor.Button, {
          onClick: addOption,
          small: true,
          children: "Add Option"
        })
      })]
    })
  });
}

exports.default = PollComponent;
