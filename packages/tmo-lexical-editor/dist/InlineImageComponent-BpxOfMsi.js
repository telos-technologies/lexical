/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import { $getSelection, $isNodeSelection, $setSelection, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_LOW, CLICK_COMMAND, DRAGSTART_COMMAND, KEY_ENTER_COMMAND, KEY_ESCAPE_COMMAND, $getNodeByKey } from 'lexical';
import { useRef, useState, useCallback, useEffect, Suspense } from 'react';
import { u as useModal, L as LinkPlugin, a as LexicalContentEditable, T as TextInput, S as Select, D as DialogActions, B as Button } from './percentages-YKFLWNK2-DsATT4Rj.js';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import '@lexical/link';
import '@lexical/list';
import '@lexical/react/LexicalComposer';
import '@lexical/rich-text';
import 'react-dom';
import '@lexical/react/LexicalHistoryPlugin';
import '@lexical/react/LexicalCharacterLimitPlugin';
import '@lexical/react/LexicalCheckListPlugin';
import '@lexical/react/LexicalClearEditorPlugin';
import '@lexical/react/LexicalClickableLinkPlugin';
import '@lexical/react/LexicalCollaborationPlugin';
import '@lexical/react/LexicalHashtagPlugin';
import '@lexical/react/LexicalHorizontalRulePlugin';
import '@lexical/react/LexicalListPlugin';
import '@lexical/react/LexicalPlainTextPlugin';
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

const imageCache = new Set();
function useSuspenseImage(src) {
  if (!imageCache.has(src)) {
    throw new Promise(resolve => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
    });
  }
}
function LazyImage({
  altText,
  className,
  imageRef,
  src,
  width,
  height,
  position
}) {
  useSuspenseImage(src);
  return /*#__PURE__*/jsx("img", {
    className: className || undefined,
    src: src,
    alt: altText,
    ref: imageRef,
    "data-position": position,
    style: {
      display: 'block',
      height,
      width
    },
    draggable: "false"
  });
}
function UpdateInlineImageDialog({
  activeEditor,
  nodeKey,
  onClose
}) {
  const editorState = activeEditor.getEditorState();
  const node = editorState.read(() => $getNodeByKey(nodeKey));
  const [altText, setAltText] = useState(node.getAltText());
  const [showCaption, setShowCaption] = useState(node.getShowCaption());
  const [position, setPosition] = useState(node.getPosition());
  const handleShowCaptionChange = e => {
    setShowCaption(e.target.checked);
  };
  const handlePositionChange = e => {
    setPosition(e.target.value);
  };
  const handleOnConfirm = () => {
    const payload = {
      altText,
      position,
      showCaption
    };
    if (node) {
      activeEditor.update(() => {
        node.update(payload);
      });
    }
    onClose();
  };
  return /*#__PURE__*/jsxs(Fragment, {
    children: [/*#__PURE__*/jsx("div", {
      style: {
        marginBottom: '1em'
      },
      children: /*#__PURE__*/jsx(TextInput, {
        label: "Alt Text",
        placeholder: "Descriptive alternative text",
        onChange: setAltText,
        value: altText,
        "data-test-id": "image-modal-alt-text-input"
      })
    }), /*#__PURE__*/jsxs(Select, {
      style: {
        marginBottom: '1em',
        width: '208px'
      },
      value: position,
      label: "Position",
      name: "position",
      id: "position-select",
      onChange: handlePositionChange,
      children: [/*#__PURE__*/jsx("option", {
        value: "left",
        children: "Left"
      }), /*#__PURE__*/jsx("option", {
        value: "right",
        children: "Right"
      }), /*#__PURE__*/jsx("option", {
        value: "full",
        children: "Full Width"
      })]
    }), /*#__PURE__*/jsxs("div", {
      className: "Input__wrapper",
      children: [/*#__PURE__*/jsx("input", {
        id: "caption",
        type: "checkbox",
        checked: showCaption,
        onChange: handleShowCaptionChange
      }), /*#__PURE__*/jsx("label", {
        htmlFor: "caption",
        children: "Show Caption"
      })]
    }), /*#__PURE__*/jsx(DialogActions, {
      children: /*#__PURE__*/jsx(Button, {
        "data-test-id": "image-modal-file-upload-btn",
        onClick: () => handleOnConfirm(),
        children: "Confirm"
      })
    })]
  });
}
function InlineImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  showCaption,
  caption,
  position
}) {
  const [modal, showModal] = useModal();
  const imageRef = useRef(null);
  const buttonRef = useRef(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState(null);
  const activeEditorRef = useRef(null);
  const isEditable = useLexicalEditable();
  const $onEnter = useCallback(event => {
    const latestSelection = $getSelection();
    const buttonElem = buttonRef.current;
    if (isSelected && $isNodeSelection(latestSelection) && latestSelection.getNodes().length === 1) {
      if (showCaption) {
        // Move focus into nested editor
        $setSelection(null);
        event.preventDefault();
        caption.focus();
        return true;
      } else if (buttonElem !== null && buttonElem !== document.activeElement) {
        event.preventDefault();
        buttonElem.focus();
        return true;
      }
    }
    return false;
  }, [caption, isSelected, showCaption]);
  const $onEscape = useCallback(event => {
    if (activeEditorRef.current === caption || buttonRef.current === event.target) {
      $setSelection(null);
      editor.update(() => {
        setSelected(true);
        const parentRootElement = editor.getRootElement();
        if (parentRootElement !== null) {
          parentRootElement.focus();
        }
      });
      return true;
    }
    return false;
  }, [caption, editor, setSelected]);
  useEffect(() => {
    let isMounted = true;
    const unregister = mergeRegister(editor.registerUpdateListener(({
      editorState
    }) => {
      if (isMounted) {
        setSelection(editorState.read(() => $getSelection()));
      }
    }), editor.registerCommand(SELECTION_CHANGE_COMMAND, (_, activeEditor) => {
      activeEditorRef.current = activeEditor;
      return false;
    }, COMMAND_PRIORITY_LOW), editor.registerCommand(CLICK_COMMAND, payload => {
      const event = payload;
      if (event.target === imageRef.current) {
        if (event.shiftKey) {
          setSelected(!isSelected);
        } else {
          clearSelection();
          setSelected(true);
        }
        return true;
      }
      return false;
    }, COMMAND_PRIORITY_LOW), editor.registerCommand(DRAGSTART_COMMAND, event => {
      if (event.target === imageRef.current) {
        // TODO This is just a temporary workaround for FF to behave like other browsers.
        // Ideally, this handles drag & drop too (and all browsers).
        event.preventDefault();
        return true;
      }
      return false;
    }, COMMAND_PRIORITY_LOW), editor.registerCommand(KEY_ENTER_COMMAND, $onEnter, COMMAND_PRIORITY_LOW), editor.registerCommand(KEY_ESCAPE_COMMAND, $onEscape, COMMAND_PRIORITY_LOW));
    return () => {
      isMounted = false;
      unregister();
    };
  }, [clearSelection, editor, isSelected, nodeKey, $onEnter, $onEscape, setSelected]);
  const draggable = isSelected && $isNodeSelection(selection);
  const isFocused = isSelected && isEditable;
  return /*#__PURE__*/jsxs(Suspense, {
    fallback: null,
    children: [/*#__PURE__*/jsxs(Fragment, {
      children: [/*#__PURE__*/jsxs("span", {
        draggable: draggable,
        children: [isEditable && /*#__PURE__*/jsx("button", {
          className: "image-edit-button",
          ref: buttonRef,
          onClick: () => {
            showModal('Update Inline Image', onClose => /*#__PURE__*/jsx(UpdateInlineImageDialog, {
              activeEditor: editor,
              nodeKey: nodeKey,
              onClose: onClose
            }));
          },
          children: "Edit"
        }), /*#__PURE__*/jsx(LazyImage, {
          className: isFocused ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}` : null,
          src: src,
          altText: altText,
          imageRef: imageRef,
          width: width,
          height: height,
          position: position
        })]
      }), showCaption && /*#__PURE__*/jsx("span", {
        className: "image-caption-container",
        children: /*#__PURE__*/jsxs(LexicalNestedComposer, {
          initialEditor: caption,
          children: [/*#__PURE__*/jsx(AutoFocusPlugin, {}), /*#__PURE__*/jsx(LinkPlugin, {}), /*#__PURE__*/jsx(RichTextPlugin, {
            contentEditable: /*#__PURE__*/jsx(LexicalContentEditable, {
              placeholder: "Enter a caption...",
              placeholderClassName: "InlineImageNode__placeholder",
              className: "InlineImageNode__contentEditable"
            }),
            ErrorBoundary: LexicalErrorBoundary
          })]
        })
      })]
    }), modal]
  });
}

export { UpdateInlineImageDialog, InlineImageComponent as default };
