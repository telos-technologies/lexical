/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCollaborationContext } from '@lexical/react/LexicalCollaborationContext';
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { calculateZoomLevel } from '@lexical/utils';
import { $getNodeByKey } from 'lexical';
import { useRef, useEffect, useLayoutEffect } from 'react';
import { t as theme$1, f as useSharedHistoryContext, k as createWebsocketProvider, a as LexicalContentEditable, n as $isStickyNode } from './percentages-YKFLWNK2-BpgWzMVa.js';
import { jsx, jsxs } from 'react/jsx-runtime';
import '@lexical/link';
import '@lexical/list';
import '@lexical/react/LexicalComposer';
import '@lexical/rich-text';
import 'react-dom';
import '@lexical/react/LexicalAutoFocusPlugin';
import '@lexical/react/LexicalCharacterLimitPlugin';
import '@lexical/react/LexicalCheckListPlugin';
import '@lexical/react/LexicalClearEditorPlugin';
import '@lexical/react/LexicalClickableLinkPlugin';
import '@lexical/react/LexicalHashtagPlugin';
import '@lexical/react/LexicalHorizontalRulePlugin';
import '@lexical/react/LexicalListPlugin';
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

const theme = {
  ...theme$1,
  paragraph: 'StickyEditorTheme__paragraph'
};

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function positionSticky(stickyElem, positioning) {
  const style = stickyElem.style;
  const rootElementRect = positioning.rootElementRect;
  const rectLeft = rootElementRect !== null ? rootElementRect.left : 0;
  const rectTop = rootElementRect !== null ? rootElementRect.top : 0;
  style.top = rectTop + positioning.y + 'px';
  style.left = rectLeft + positioning.x + 'px';
}
function StickyComponent({
  x,
  y,
  nodeKey,
  color,
  caption
}) {
  const [editor] = useLexicalComposerContext();
  const stickyContainerRef = useRef(null);
  const positioningRef = useRef({
    isDragging: false,
    offsetX: 0,
    offsetY: 0,
    rootElementRect: null,
    x: 0,
    y: 0
  });
  const {
    isCollabActive
  } = useCollaborationContext();
  useEffect(() => {
    const position = positioningRef.current;
    position.x = x;
    position.y = y;
    const stickyContainer = stickyContainerRef.current;
    if (stickyContainer !== null) {
      positionSticky(stickyContainer, position);
    }
  }, [x, y]);
  useLayoutEffect(() => {
    const position = positioningRef.current;
    const resizeObserver = new ResizeObserver(entries => {
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const {
          target
        } = entry;
        position.rootElementRect = target.getBoundingClientRect();
        const stickyContainer = stickyContainerRef.current;
        if (stickyContainer !== null) {
          positionSticky(stickyContainer, position);
        }
      }
    });
    const removeRootListener = editor.registerRootListener((nextRootElem, prevRootElem) => {
      if (prevRootElem !== null) {
        resizeObserver.unobserve(prevRootElem);
      }
      if (nextRootElem !== null) {
        resizeObserver.observe(nextRootElem);
      }
    });
    const handleWindowResize = () => {
      const rootElement = editor.getRootElement();
      const stickyContainer = stickyContainerRef.current;
      if (rootElement !== null && stickyContainer !== null) {
        position.rootElementRect = rootElement.getBoundingClientRect();
        positionSticky(stickyContainer, position);
      }
    };
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      removeRootListener();
    };
  }, [editor]);
  useEffect(() => {
    const stickyContainer = stickyContainerRef.current;
    if (stickyContainer !== null) {
      // Delay adding transition so we don't trigger the
      // transition on load of the sticky.
      setTimeout(() => {
        stickyContainer.style.setProperty('transition', 'top 0.3s ease 0s, left 0.3s ease 0s');
      }, 500);
    }
  }, []);
  const handlePointerMove = event => {
    const stickyContainer = stickyContainerRef.current;
    const positioning = positioningRef.current;
    const rootElementRect = positioning.rootElementRect;
    const zoom = calculateZoomLevel(stickyContainer);
    if (stickyContainer !== null && positioning.isDragging && rootElementRect !== null) {
      positioning.x = event.pageX / zoom - positioning.offsetX - rootElementRect.left;
      positioning.y = event.pageY / zoom - positioning.offsetY - rootElementRect.top;
      positionSticky(stickyContainer, positioning);
    }
  };
  const handlePointerUp = event => {
    const stickyContainer = stickyContainerRef.current;
    const positioning = positioningRef.current;
    if (stickyContainer !== null) {
      positioning.isDragging = false;
      stickyContainer.classList.remove('dragging');
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isStickyNode(node)) {
          node.setPosition(positioning.x, positioning.y);
        }
      });
    }
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  };
  const handleDelete = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isStickyNode(node)) {
        node.remove();
      }
    });
  };
  const handleColorChange = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isStickyNode(node)) {
        node.toggleColor();
      }
    });
  };
  const {
    historyState
  } = useSharedHistoryContext();
  return /*#__PURE__*/jsx("div", {
    ref: stickyContainerRef,
    className: "sticky-note-container",
    children: /*#__PURE__*/jsxs("div", {
      className: `sticky-note ${color}`,
      onPointerDown: event => {
        const stickyContainer = stickyContainerRef.current;
        if (stickyContainer == null || event.button === 2 || event.target !== stickyContainer.firstChild) {
          // Right click or click on editor should not work
          return;
        }
        const stickContainer = stickyContainer;
        const positioning = positioningRef.current;
        if (stickContainer !== null) {
          const {
            top,
            left
          } = stickContainer.getBoundingClientRect();
          const zoom = calculateZoomLevel(stickContainer);
          positioning.offsetX = event.clientX / zoom - left;
          positioning.offsetY = event.clientY / zoom - top;
          positioning.isDragging = true;
          stickContainer.classList.add('dragging');
          document.addEventListener('pointermove', handlePointerMove);
          document.addEventListener('pointerup', handlePointerUp);
          event.preventDefault();
        }
      },
      children: [/*#__PURE__*/jsx("button", {
        onClick: handleDelete,
        className: "delete",
        "aria-label": "Delete sticky note",
        title: "Delete",
        children: "X"
      }), /*#__PURE__*/jsx("button", {
        onClick: handleColorChange,
        className: "color",
        "aria-label": "Change sticky note color",
        title: "Color",
        children: /*#__PURE__*/jsx("i", {
          className: "bucket"
        })
      }), /*#__PURE__*/jsxs(LexicalNestedComposer, {
        initialEditor: caption,
        initialTheme: theme,
        children: [isCollabActive ? /*#__PURE__*/jsx(CollaborationPlugin, {
          id: caption.getKey(),
          providerFactory: createWebsocketProvider,
          shouldBootstrap: true
        }) : /*#__PURE__*/jsx(HistoryPlugin, {
          externalHistoryState: historyState
        }), /*#__PURE__*/jsx(PlainTextPlugin, {
          contentEditable: /*#__PURE__*/jsx(LexicalContentEditable, {
            placeholder: "What's up?",
            placeholderClassName: "StickyNode__placeholder",
            className: "StickyNode__contentEditable"
          }),
          ErrorBoundary: LexicalErrorBoundary
        })]
      })]
    })
  });
}

export { StickyComponent as default };
