/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { useCollaborationContext } from '@lexical/react/LexicalCollaborationContext';
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import { $getSelection, $isNodeSelection, $setSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_LOW, CLICK_COMMAND, DRAGSTART_COMMAND, KEY_ENTER_COMMAND, KEY_ESCAPE_COMMAND, createCommand, $getNodeByKey } from 'lexical';
import { useRef, useState, useCallback, useEffect, Suspense } from 'react';
import { f as useSharedHistoryContext, g as useSettings, N as NewMentionsPlugin, L as LinkPlugin, h as EmojisPlugin, i as KeywordsPlugin, k as createWebsocketProvider, a as LexicalContentEditable, l as TreeViewPlugin, m as $isImageNode } from './percentages-YKFLWNK2-Cd-ZN6k-.js';
import { I as ImageResizer } from './ImageResizer-DB1sM4RG.js';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import '@lexical/link';
import '@lexical/list';
import '@lexical/react/LexicalComposer';
import '@lexical/rich-text';
import 'react-dom';
import '@lexical/react/LexicalCharacterLimitPlugin';
import '@lexical/react/LexicalCheckListPlugin';
import '@lexical/react/LexicalClearEditorPlugin';
import '@lexical/react/LexicalClickableLinkPlugin';
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

var brokenImage = "data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%3Csvg%20width%3D%22800px%22%20height%3D%22800px%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%20%20%20%20%3Cpath%20d%3D%22M22%203H2v18h20v-2h-2v-2h2v-2h-2v-2h2v-2h-2V9h2V7h-2V5h2V3zm-2%204v2h-2v2h2v2h-2v2h2v2h-2v2H4V5h14v2h2zm-6%202h-2v2h-2v2H8v2H6v2h2v-2h2v-2h2v-2h2v2h2v-2h-2V9zM6%207h2v2H6V7z%22%20fill%3D%22%23000000%22%2F%3E%3C%2Fsvg%3E";

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const imageCache = new Map();
const RIGHT_CLICK_IMAGE_COMMAND = createCommand('RIGHT_CLICK_IMAGE_COMMAND');
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
  const [dimensions, setDimensions] = useState(null);
  const isSVGImage = isSVG(src);

  // Set initial dimensions for SVG images
  useEffect(() => {
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
  useEffect(() => {
    if (hasError) {
      onError();
    }
  }, [hasError, onError]);
  if (hasError) {
    return /*#__PURE__*/jsx(BrokenImage, {});
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
  return /*#__PURE__*/jsx("img", {
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
  return /*#__PURE__*/jsx("img", {
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
  const imageRef = useRef(null);
  const buttonRef = useRef(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = useState(false);
  const {
    isCollabActive
  } = useCollaborationContext();
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState(null);
  const activeEditorRef = useRef(null);
  const [isLoadError, setIsLoadError] = useState(false);
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
  const onClick = useCallback(payload => {
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
  const onRightClick = useCallback(event => {
    editor.getEditorState().read(() => {
      const latestSelection = $getSelection();
      const domElement = event.target;
      if (domElement.tagName === 'IMG' && $isRangeSelection(latestSelection) && latestSelection.getNodes().length === 1) {
        editor.dispatchCommand(RIGHT_CLICK_IMAGE_COMMAND, event);
      }
    });
  }, [editor]);
  useEffect(() => {
    const rootElement = editor.getRootElement();
    const unregister = mergeRegister(editor.registerUpdateListener(({
      editorState
    }) => {
      const updatedSelection = editorState.read(() => $getSelection());
      if ($isNodeSelection(updatedSelection)) {
        setSelection(updatedSelection);
      } else {
        setSelection(null);
      }
    }), editor.registerCommand(SELECTION_CHANGE_COMMAND, (_, activeEditor) => {
      activeEditorRef.current = activeEditor;
      return false;
    }, COMMAND_PRIORITY_LOW), editor.registerCommand(CLICK_COMMAND, onClick, COMMAND_PRIORITY_LOW), editor.registerCommand(RIGHT_CLICK_IMAGE_COMMAND, onClick, COMMAND_PRIORITY_LOW), editor.registerCommand(DRAGSTART_COMMAND, event => {
      if (event.target === imageRef.current) {
        // TODO This is just a temporary workaround for FF to behave like other browsers.
        // Ideally, this handles drag & drop too (and all browsers).
        event.preventDefault();
        return true;
      }
      return false;
    }, COMMAND_PRIORITY_LOW), editor.registerCommand(KEY_ENTER_COMMAND, $onEnter, COMMAND_PRIORITY_LOW), editor.registerCommand(KEY_ESCAPE_COMMAND, $onEscape, COMMAND_PRIORITY_LOW));
    rootElement?.addEventListener('contextmenu', onRightClick);
    return () => {
      unregister();
      rootElement?.removeEventListener('contextmenu', onRightClick);
    };
  }, [clearSelection, editor, isResizing, isSelected, nodeKey, $onEnter, $onEscape, onClick, onRightClick, setSelected]);
  const setShowCaption = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
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
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setWidthAndHeight(nextWidth, nextHeight);
      }
    });
  };
  const onResizeStart = () => {
    setIsResizing(true);
  };
  const {
    historyState
  } = useSharedHistoryContext();
  const {
    settings: {
      showNestedEditorTreeView
    }
  } = useSettings();
  const draggable = isSelected && $isNodeSelection(selection) && !isResizing;
  const isFocused = (isSelected || isResizing) && isEditable;
  return /*#__PURE__*/jsx(Suspense, {
    fallback: null,
    children: /*#__PURE__*/jsxs(Fragment, {
      children: [/*#__PURE__*/jsx("div", {
        draggable: draggable,
        children: isLoadError ? /*#__PURE__*/jsx(BrokenImage, {}) : /*#__PURE__*/jsx(LazyImage, {
          className: isFocused ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}` : null,
          src: src,
          altText: altText,
          imageRef: imageRef,
          width: width,
          height: height,
          maxWidth: maxWidth,
          onError: () => setIsLoadError(true)
        })
      }), showCaption && /*#__PURE__*/jsx("div", {
        className: "image-caption-container",
        children: /*#__PURE__*/jsxs(LexicalNestedComposer, {
          initialEditor: caption,
          children: [/*#__PURE__*/jsx(AutoFocusPlugin, {}), /*#__PURE__*/jsx(NewMentionsPlugin, {}), /*#__PURE__*/jsx(LinkPlugin, {}), /*#__PURE__*/jsx(EmojisPlugin, {}), /*#__PURE__*/jsx(HashtagPlugin, {}), /*#__PURE__*/jsx(KeywordsPlugin, {}), isCollabActive ? /*#__PURE__*/jsx(CollaborationPlugin, {
            id: caption.getKey(),
            providerFactory: createWebsocketProvider,
            shouldBootstrap: true
          }) : /*#__PURE__*/jsx(HistoryPlugin, {
            externalHistoryState: historyState
          }), /*#__PURE__*/jsx(RichTextPlugin, {
            contentEditable: /*#__PURE__*/jsx(LexicalContentEditable, {
              placeholder: "Enter a caption...",
              placeholderClassName: "ImageNode__placeholder",
              className: "ImageNode__contentEditable"
            }),
            ErrorBoundary: LexicalErrorBoundary
          }), showNestedEditorTreeView === true ? /*#__PURE__*/jsx(TreeViewPlugin, {}) : null]
        })
      }), resizable && $isNodeSelection(selection) && isFocused && /*#__PURE__*/jsx(ImageResizer, {
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

export { RIGHT_CLICK_IMAGE_COMMAND, ImageComponent as default };
