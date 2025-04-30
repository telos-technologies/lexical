/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var LexicalAutoFocusPlugin = require('@lexical/react/LexicalAutoFocusPlugin');
var LexicalComposerContext = require('@lexical/react/LexicalComposerContext');
var LexicalErrorBoundary = require('@lexical/react/LexicalErrorBoundary');
var LexicalNestedComposer = require('@lexical/react/LexicalNestedComposer');
var LexicalRichTextPlugin = require('@lexical/react/LexicalRichTextPlugin');
var useLexicalEditable = require('@lexical/react/useLexicalEditable');
var useLexicalNodeSelection = require('@lexical/react/useLexicalNodeSelection');
var utils = require('@lexical/utils');
var lexical = require('lexical');
var React = require('react');
var TmoLexicalEditor = require('./percentages-YKFLWNK2-HdVqVAvt.js');
var jsxRuntime = require('react/jsx-runtime');
require('@lexical/link');
require('@lexical/list');
require('@lexical/react/LexicalComposer');
require('@lexical/rich-text');
require('react-dom');
require('@lexical/react/LexicalHistoryPlugin');
require('@lexical/react/LexicalCharacterLimitPlugin');
require('@lexical/react/LexicalCheckListPlugin');
require('@lexical/react/LexicalClearEditorPlugin');
require('@lexical/react/LexicalClickableLinkPlugin');
require('@lexical/react/LexicalCollaborationPlugin');
require('@lexical/react/LexicalHashtagPlugin');
require('@lexical/react/LexicalHorizontalRulePlugin');
require('@lexical/react/LexicalListPlugin');
require('@lexical/react/LexicalPlainTextPlugin');
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
  return /*#__PURE__*/jsxRuntime.jsx("img", {
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
  const node = editorState.read(() => lexical.$getNodeByKey(nodeKey));
  const [altText, setAltText] = React.useState(node.getAltText());
  const [showCaption, setShowCaption] = React.useState(node.getShowCaption());
  const [position, setPosition] = React.useState(node.getPosition());
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
  return /*#__PURE__*/jsxRuntime.jsxs(jsxRuntime.Fragment, {
    children: [/*#__PURE__*/jsxRuntime.jsx("div", {
      style: {
        marginBottom: '1em'
      },
      children: /*#__PURE__*/jsxRuntime.jsx(TmoLexicalEditor.TextInput, {
        label: "Alt Text",
        placeholder: "Descriptive alternative text",
        onChange: setAltText,
        value: altText,
        "data-test-id": "image-modal-alt-text-input"
      })
    }), /*#__PURE__*/jsxRuntime.jsxs(TmoLexicalEditor.Select, {
      style: {
        marginBottom: '1em',
        width: '208px'
      },
      value: position,
      label: "Position",
      name: "position",
      id: "position-select",
      onChange: handlePositionChange,
      children: [/*#__PURE__*/jsxRuntime.jsx("option", {
        value: "left",
        children: "Left"
      }), /*#__PURE__*/jsxRuntime.jsx("option", {
        value: "right",
        children: "Right"
      }), /*#__PURE__*/jsxRuntime.jsx("option", {
        value: "full",
        children: "Full Width"
      })]
    }), /*#__PURE__*/jsxRuntime.jsxs("div", {
      className: "Input__wrapper",
      children: [/*#__PURE__*/jsxRuntime.jsx("input", {
        id: "caption",
        type: "checkbox",
        checked: showCaption,
        onChange: handleShowCaptionChange
      }), /*#__PURE__*/jsxRuntime.jsx("label", {
        htmlFor: "caption",
        children: "Show Caption"
      })]
    }), /*#__PURE__*/jsxRuntime.jsx(TmoLexicalEditor.DialogActions, {
      children: /*#__PURE__*/jsxRuntime.jsx(TmoLexicalEditor.Button, {
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
  const [modal, showModal] = TmoLexicalEditor.useModal();
  const imageRef = React.useRef(null);
  const buttonRef = React.useRef(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection.useLexicalNodeSelection(nodeKey);
  const [editor] = LexicalComposerContext.useLexicalComposerContext();
  const [selection, setSelection] = React.useState(null);
  const activeEditorRef = React.useRef(null);
  const isEditable = useLexicalEditable.useLexicalEditable();
  const $onEnter = React.useCallback(event => {
    const latestSelection = lexical.$getSelection();
    const buttonElem = buttonRef.current;
    if (isSelected && lexical.$isNodeSelection(latestSelection) && latestSelection.getNodes().length === 1) {
      if (showCaption) {
        // Move focus into nested editor
        lexical.$setSelection(null);
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
  const $onEscape = React.useCallback(event => {
    if (activeEditorRef.current === caption || buttonRef.current === event.target) {
      lexical.$setSelection(null);
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
  React.useEffect(() => {
    let isMounted = true;
    const unregister = utils.mergeRegister(editor.registerUpdateListener(({
      editorState
    }) => {
      if (isMounted) {
        setSelection(editorState.read(() => lexical.$getSelection()));
      }
    }), editor.registerCommand(lexical.SELECTION_CHANGE_COMMAND, (_, activeEditor) => {
      activeEditorRef.current = activeEditor;
      return false;
    }, lexical.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical.CLICK_COMMAND, payload => {
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
    }, lexical.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical.DRAGSTART_COMMAND, event => {
      if (event.target === imageRef.current) {
        // TODO This is just a temporary workaround for FF to behave like other browsers.
        // Ideally, this handles drag & drop too (and all browsers).
        event.preventDefault();
        return true;
      }
      return false;
    }, lexical.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical.KEY_ENTER_COMMAND, $onEnter, lexical.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical.KEY_ESCAPE_COMMAND, $onEscape, lexical.COMMAND_PRIORITY_LOW));
    return () => {
      isMounted = false;
      unregister();
    };
  }, [clearSelection, editor, isSelected, nodeKey, $onEnter, $onEscape, setSelected]);
  const draggable = isSelected && lexical.$isNodeSelection(selection);
  const isFocused = isSelected && isEditable;
  return /*#__PURE__*/jsxRuntime.jsxs(React.Suspense, {
    fallback: null,
    children: [/*#__PURE__*/jsxRuntime.jsxs(jsxRuntime.Fragment, {
      children: [/*#__PURE__*/jsxRuntime.jsxs("span", {
        draggable: draggable,
        children: [isEditable && /*#__PURE__*/jsxRuntime.jsx("button", {
          className: "image-edit-button",
          ref: buttonRef,
          onClick: () => {
            showModal('Update Inline Image', onClose => /*#__PURE__*/jsxRuntime.jsx(UpdateInlineImageDialog, {
              activeEditor: editor,
              nodeKey: nodeKey,
              onClose: onClose
            }));
          },
          children: "Edit"
        }), /*#__PURE__*/jsxRuntime.jsx(LazyImage, {
          className: isFocused ? `focused ${lexical.$isNodeSelection(selection) ? 'draggable' : ''}` : null,
          src: src,
          altText: altText,
          imageRef: imageRef,
          width: width,
          height: height,
          position: position
        })]
      }), showCaption && /*#__PURE__*/jsxRuntime.jsx("span", {
        className: "image-caption-container",
        children: /*#__PURE__*/jsxRuntime.jsxs(LexicalNestedComposer.LexicalNestedComposer, {
          initialEditor: caption,
          children: [/*#__PURE__*/jsxRuntime.jsx(LexicalAutoFocusPlugin.AutoFocusPlugin, {}), /*#__PURE__*/jsxRuntime.jsx(TmoLexicalEditor.LinkPlugin, {}), /*#__PURE__*/jsxRuntime.jsx(LexicalRichTextPlugin.RichTextPlugin, {
            contentEditable: /*#__PURE__*/jsxRuntime.jsx(TmoLexicalEditor.LexicalContentEditable, {
              placeholder: "Enter a caption...",
              placeholderClassName: "InlineImageNode__placeholder",
              className: "InlineImageNode__contentEditable"
            }),
            ErrorBoundary: LexicalErrorBoundary.LexicalErrorBoundary
          })]
        })
      })]
    }), modal]
  });
}

exports.UpdateInlineImageDialog = UpdateInlineImageDialog;
exports.default = InlineImageComponent;
