/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCollaborationContext } from '@lexical/react/LexicalCollaborationContext';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import { $getSelection, CLICK_COMMAND, COMMAND_PRIORITY_LOW, $isNodeSelection, $getNodeByKey } from 'lexical';
import { useMemo, useState, useRef, useEffect } from 'react';
import { B as Button, j as joinClasses, $ as $isPollNode, c as createPollOption } from './percentages-YKFLWNK2-DsATT4Rj.js';
import { jsx, jsxs } from 'react/jsx-runtime';
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
import '@lexical/react/useLexicalEditable';
import 'y-websocket';
import 'yjs';
import '@lexical/code';
import '@lexical/file';
import '@lexical/markdown';
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
  } = useCollaborationContext();
  const checkboxRef = useRef(null);
  const votesArray = option.votes;
  const checkedIndex = votesArray.indexOf(clientID);
  const checked = checkedIndex !== -1;
  const votes = votesArray.length;
  const text = option.text;
  return /*#__PURE__*/jsxs("div", {
    className: "PollNode__optionContainer",
    children: [/*#__PURE__*/jsx("div", {
      className: joinClasses('PollNode__optionCheckboxWrapper', checked && 'PollNode__optionCheckboxChecked'),
      children: /*#__PURE__*/jsx("input", {
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
    }), /*#__PURE__*/jsxs("div", {
      className: "PollNode__optionInputWrapper",
      children: [/*#__PURE__*/jsx("div", {
        className: "PollNode__optionInputVotes",
        style: {
          width: `${votes === 0 ? 0 : votes / totalVotes * 100}%`
        }
      }), /*#__PURE__*/jsx("span", {
        className: "PollNode__optionInputVotesCount",
        children: votes > 0 && (votes === 1 ? '1 vote' : `${votes} votes`)
      }), /*#__PURE__*/jsx("input", {
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
    }), /*#__PURE__*/jsx("button", {
      disabled: options.length < 3,
      className: joinClasses('PollNode__optionDelete', options.length < 3 && 'PollNode__optionDeleteDisabled'),
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
  const [editor] = useLexicalComposerContext();
  const totalVotes = useMemo(() => getTotalVotes(options), [options]);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [selection, setSelection] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    return mergeRegister(editor.registerUpdateListener(({
      editorState
    }) => {
      setSelection(editorState.read(() => $getSelection()));
    }), editor.registerCommand(CLICK_COMMAND, payload => {
      const event = payload;
      if (event.target === ref.current) {
        if (!event.shiftKey) {
          clearSelection();
        }
        setSelected(!isSelected);
        return true;
      }
      return false;
    }, COMMAND_PRIORITY_LOW));
  }, [clearSelection, editor, isSelected, nodeKey, setSelected]);
  const withPollNode = (cb, onUpdate) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isPollNode(node)) {
        cb(node);
      }
    }, {
      onUpdate
    });
  };
  const addOption = () => {
    withPollNode(node => {
      node.addOption(createPollOption());
    });
  };
  const isFocused = $isNodeSelection(selection) && isSelected;
  return /*#__PURE__*/jsx("div", {
    className: `PollNode__container ${isFocused ? 'focused' : ''}`,
    ref: ref,
    children: /*#__PURE__*/jsxs("div", {
      className: "PollNode__inner",
      children: [/*#__PURE__*/jsx("h2", {
        className: "PollNode__heading",
        children: question
      }), options.map((option, index) => {
        const key = option.uid;
        return /*#__PURE__*/jsx(PollOptionComponent, {
          withPollNode: withPollNode,
          option: option,
          index: index,
          options: options,
          totalVotes: totalVotes
        }, key);
      }), /*#__PURE__*/jsx("div", {
        className: "PollNode__footer",
        children: /*#__PURE__*/jsx(Button, {
          onClick: addOption,
          small: true,
          children: "Add Option"
        })
      })]
    })
  });
}

export { PollComponent as default };
