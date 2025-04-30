/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var LexicalAutoFocusPlugin = require('@lexical/react/LexicalAutoFocusPlugin');
var LexicalCollaborationContext = require('@lexical/react/LexicalCollaborationContext');
var LexicalCollaborationPlugin = require('@lexical/react/LexicalCollaborationPlugin');
var LexicalComposerContext = require('@lexical/react/LexicalComposerContext');
var LexicalErrorBoundary = require('@lexical/react/LexicalErrorBoundary');
var LexicalHashtagPlugin = require('@lexical/react/LexicalHashtagPlugin');
var LexicalHistoryPlugin = require('@lexical/react/LexicalHistoryPlugin');
var LexicalNestedComposer = require('@lexical/react/LexicalNestedComposer');
var LexicalRichTextPlugin = require('@lexical/react/LexicalRichTextPlugin');
var useLexicalEditable = require('@lexical/react/useLexicalEditable');
var useLexicalNodeSelection = require('@lexical/react/useLexicalNodeSelection');
var utils = require('@lexical/utils');
var lexical = require('lexical');
var React = require('react');
var TmoLexicalEditor = require('./percentages-YKFLWNK2-B6-AE232.js');
var ImageResizer = require('./ImageResizer-BMHKiNbw.js');
var jsxRuntime = require('react/jsx-runtime');
require('@lexical/link');
require('@lexical/list');
require('@lexical/react/LexicalComposer');
require('@lexical/rich-text');
require('react-dom');
require('@lexical/react/LexicalCharacterLimitPlugin');
require('@lexical/react/LexicalCheckListPlugin');
require('@lexical/react/LexicalClearEditorPlugin');
require('@lexical/react/LexicalClickableLinkPlugin');
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

var brokenImage = "data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%3Csvg%20width%3D%22800px%22%20height%3D%22800px%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%20%20%20%20%3Cpath%20d%3D%22M22%203H2v18h20v-2h-2v-2h2v-2h-2v-2h2v-2h-2V9h2V7h-2V5h2V3zm-2%204v2h-2v2h2v2h-2v2h2v2h-2v2H4V5h14v2h2zm-6%202h-2v2h-2v2H8v2H6v2h2v-2h2v-2h2v-2h2v2h2v-2h-2V9zM6%207h2v2H6V7z%22%20fill%3D%22%23000000%22%2F%3E%3C%2Fsvg%3E";

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const imageCache = new Map();
const RIGHT_CLICK_IMAGE_COMMAND = lexical.createCommand('RIGHT_CLICK_IMAGE_COMMAND');
function useSuspenseImage(src) {
  let cached = imageCache.get(src);
  if (typeof cached === 'boolean') {
    return cached;
  } else if (!cached) {
    cached = new Promise(resolve => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(false);
      img.onerror = () => resolve(true);
    }).then(hasError => {
      imageCache.set(src, hasError);
      return hasError;
    });
    imageCache.set(src, cached);
    throw cached;
  }
  throw cached;
}
function isSVG(src) {
  return src.toLowerCase().endsWith('.svg');
}
function LazyImage({
  altText,
  className,
  imageRef,
  src,
  width,
  height,
  maxWidth,
  onError
}) {
  const [dimensions, setDimensions] = React.useState(null);
  const isSVGImage = isSVG(src);

  // Set initial dimensions for SVG images
  React.useEffect(() => {
    if (imageRef.current && isSVGImage) {
      const {
        naturalWidth,
        naturalHeight
      } = imageRef.current;
      setDimensions({
        height: naturalHeight,
        width: naturalWidth
      });
    }
  }, [imageRef, isSVGImage]);
  const hasError = useSuspenseImage(src);
  React.useEffect(() => {
    if (hasError) {
      onError();
    }
  }, [hasError, onError]);
  if (hasError) {
    return /*#__PURE__*/jsxRuntime.jsx(BrokenImage, {});
  }

  // Calculate final dimensions with proper scaling
  const calculateDimensions = () => {
    if (!isSVGImage) {
      return {
        height,
        maxWidth,
        width
      };
    }

    // Use natural dimensions if available, otherwise fallback to defaults
    const naturalWidth = dimensions?.width || 200;
    const naturalHeight = dimensions?.height || 200;
    let finalWidth = naturalWidth;
    let finalHeight = naturalHeight;

    // Scale down if width exceeds maxWidth while maintaining aspect ratio
    if (finalWidth > maxWidth) {
      const scale = maxWidth / finalWidth;
      finalWidth = maxWidth;
      finalHeight = Math.round(finalHeight * scale);
    }

    // Scale down if height exceeds maxHeight while maintaining aspect ratio
    const maxHeight = 500;
    if (finalHeight > maxHeight) {
      const scale = maxHeight / finalHeight;
      finalHeight = maxHeight;
      finalWidth = Math.round(finalWidth * scale);
    }
    return {
      height: finalHeight,
      maxWidth,
      width: finalWidth
    };
  };
  const imageStyle = calculateDimensions();
  return /*#__PURE__*/jsxRuntime.jsx("img", {
    className: className || undefined,
    src: src,
    alt: altText,
    ref: imageRef,
    style: imageStyle,
    onError: onError,
    draggable: "false",
    onLoad: e => {
      if (isSVGImage) {
        const img = e.currentTarget;
        setDimensions({
          height: img.naturalHeight,
          width: img.naturalWidth
        });
      }
    }
  });
}
function BrokenImage() {
  return /*#__PURE__*/jsxRuntime.jsx("img", {
    src: brokenImage,
    style: {
      height: 200,
      opacity: 0.2,
      width: 200
    },
    draggable: "false",
    alt: "Broken image"
  });
}
function ImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  maxWidth,
  resizable,
  showCaption,
  caption,
  captionsEnabled
}) {
  const imageRef = React.useRef(null);
  const buttonRef = React.useRef(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection.useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = React.useState(false);
  const {
    isCollabActive
  } = LexicalCollaborationContext.useCollaborationContext();
  const [editor] = LexicalComposerContext.useLexicalComposerContext();
  const [selection, setSelection] = React.useState(null);
  const activeEditorRef = React.useRef(null);
  const [isLoadError, setIsLoadError] = React.useState(false);
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
  const onClick = React.useCallback(payload => {
    const event = payload;
    if (isResizing) {
      return true;
    }
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
  }, [isResizing, isSelected, setSelected, clearSelection]);
  const onRightClick = React.useCallback(event => {
    editor.getEditorState().read(() => {
      const latestSelection = lexical.$getSelection();
      const domElement = event.target;
      if (domElement.tagName === 'IMG' && lexical.$isRangeSelection(latestSelection) && latestSelection.getNodes().length === 1) {
        editor.dispatchCommand(RIGHT_CLICK_IMAGE_COMMAND, event);
      }
    });
  }, [editor]);
  React.useEffect(() => {
    const rootElement = editor.getRootElement();
    const unregister = utils.mergeRegister(editor.registerUpdateListener(({
      editorState
    }) => {
      const updatedSelection = editorState.read(() => lexical.$getSelection());
      if (lexical.$isNodeSelection(updatedSelection)) {
        setSelection(updatedSelection);
      } else {
        setSelection(null);
      }
    }), editor.registerCommand(lexical.SELECTION_CHANGE_COMMAND, (_, activeEditor) => {
      activeEditorRef.current = activeEditor;
      return false;
    }, lexical.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical.CLICK_COMMAND, onClick, lexical.COMMAND_PRIORITY_LOW), editor.registerCommand(RIGHT_CLICK_IMAGE_COMMAND, onClick, lexical.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical.DRAGSTART_COMMAND, event => {
      if (event.target === imageRef.current) {
        // TODO This is just a temporary workaround for FF to behave like other browsers.
        // Ideally, this handles drag & drop too (and all browsers).
        event.preventDefault();
        return true;
      }
      return false;
    }, lexical.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical.KEY_ENTER_COMMAND, $onEnter, lexical.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical.KEY_ESCAPE_COMMAND, $onEscape, lexical.COMMAND_PRIORITY_LOW));
    rootElement?.addEventListener('contextmenu', onRightClick);
    return () => {
      unregister();
      rootElement?.removeEventListener('contextmenu', onRightClick);
    };
  }, [clearSelection, editor, isResizing, isSelected, nodeKey, $onEnter, $onEscape, onClick, onRightClick, setSelected]);
  const setShowCaption = () => {
    editor.update(() => {
      const node = lexical.$getNodeByKey(nodeKey);
      if (TmoLexicalEditor.$isImageNode(node)) {
        node.setShowCaption(true);
      }
    });
  };
  const onResizeEnd = (nextWidth, nextHeight) => {
    // Delay hiding the resize bars for click case
    setTimeout(() => {
      setIsResizing(false);
    }, 200);
    editor.update(() => {
      const node = lexical.$getNodeByKey(nodeKey);
      if (TmoLexicalEditor.$isImageNode(node)) {
        node.setWidthAndHeight(nextWidth, nextHeight);
      }
    });
  };
  const onResizeStart = () => {
    setIsResizing(true);
  };
  const {
    historyState
  } = TmoLexicalEditor.useSharedHistoryContext();
  const {
    settings: {
      showNestedEditorTreeView
    }
  } = TmoLexicalEditor.useSettings();
  const draggable = isSelected && lexical.$isNodeSelection(selection) && !isResizing;
  const isFocused = (isSelected || isResizing) && isEditable;
  return /*#__PURE__*/jsxRuntime.jsx(React.Suspense, {
    fallback: null,
    children: /*#__PURE__*/jsxRuntime.jsxs(jsxRuntime.Fragment, {
      children: [/*#__PURE__*/jsxRuntime.jsx("div", {
        draggable: draggable,
        children: isLoadError ? /*#__PURE__*/jsxRuntime.jsx(BrokenImage, {}) : /*#__PURE__*/jsxRuntime.jsx(LazyImage, {
          className: isFocused ? `focused ${lexical.$isNodeSelection(selection) ? 'draggable' : ''}` : null,
          src: src,
          altText: altText,
          imageRef: imageRef,
          width: width,
          height: height,
          maxWidth: maxWidth,
          onError: () => setIsLoadError(true)
        })
      }), showCaption && /*#__PURE__*/jsxRuntime.jsx("div", {
        className: "image-caption-container",
        children: /*#__PURE__*/jsxRuntime.jsxs(LexicalNestedComposer.LexicalNestedComposer, {
          initialEditor: caption,
          children: [/*#__PURE__*/jsxRuntime.jsx(LexicalAutoFocusPlugin.AutoFocusPlugin, {}), /*#__PURE__*/jsxRuntime.jsx(TmoLexicalEditor.NewMentionsPlugin, {}), /*#__PURE__*/jsxRuntime.jsx(TmoLexicalEditor.LinkPlugin, {}), /*#__PURE__*/jsxRuntime.jsx(TmoLexicalEditor.EmojisPlugin, {}), /*#__PURE__*/jsxRuntime.jsx(LexicalHashtagPlugin.HashtagPlugin, {}), /*#__PURE__*/jsxRuntime.jsx(TmoLexicalEditor.KeywordsPlugin, {}), isCollabActive ? /*#__PURE__*/jsxRuntime.jsx(LexicalCollaborationPlugin.CollaborationPlugin, {
            id: caption.getKey(),
            providerFactory: TmoLexicalEditor.createWebsocketProvider,
            shouldBootstrap: true
          }) : /*#__PURE__*/jsxRuntime.jsx(LexicalHistoryPlugin.HistoryPlugin, {
            externalHistoryState: historyState
          }), /*#__PURE__*/jsxRuntime.jsx(LexicalRichTextPlugin.RichTextPlugin, {
            contentEditable: /*#__PURE__*/jsxRuntime.jsx(TmoLexicalEditor.LexicalContentEditable, {
              placeholder: "Enter a caption...",
              placeholderClassName: "ImageNode__placeholder",
              className: "ImageNode__contentEditable"
            }),
            ErrorBoundary: LexicalErrorBoundary.LexicalErrorBoundary
          }), showNestedEditorTreeView === true ? /*#__PURE__*/jsxRuntime.jsx(TmoLexicalEditor.TreeViewPlugin, {}) : null]
        })
      }), resizable && lexical.$isNodeSelection(selection) && isFocused && /*#__PURE__*/jsxRuntime.jsx(ImageResizer.ImageResizer, {
        showCaption: showCaption,
        setShowCaption: setShowCaption,
        editor: editor,
        buttonRef: buttonRef,
        imageRef: imageRef,
        maxWidth: maxWidth,
        onResizeStart: onResizeStart,
        onResizeEnd: onResizeEnd,
        captionsEnabled: !isLoadError && captionsEnabled
      })]
    })
  });
}

exports.RIGHT_CLICK_IMAGE_COMMAND = RIGHT_CLICK_IMAGE_COMMAND;
exports.default = ImageComponent;
