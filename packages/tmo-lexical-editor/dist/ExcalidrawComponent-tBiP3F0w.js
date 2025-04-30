/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import { CLICK_COMMAND, isDOMNode, COMMAND_PRIORITY_LOW, $getNodeByKey } from 'lexical';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { e as exportToSvg2, E as ExcalidrawModal, d as $isExcalidrawNode } from './percentages-YKFLWNK2-DsATT4Rj.js';
import { I as ImageResizer } from './ImageResizer-CU7z539r.js';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
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

// exportToSvg has fonts from excalidraw.com
// We don't want them to be used in open source
const removeStyleFromSvg_HACK = svg => {
  const styleTag = svg?.firstElementChild?.firstElementChild;

  // Generated SVG is getting double-sized by height and width attributes
  // We want to match the real size of the SVG element
  const viewBox = svg.getAttribute('viewBox');
  if (viewBox != null) {
    const viewBoxDimensions = viewBox.split(' ');
    svg.setAttribute('width', viewBoxDimensions[2]);
    svg.setAttribute('height', viewBoxDimensions[3]);
  }
  if (styleTag && styleTag.tagName === 'style') {
    styleTag.remove();
  }
};

/**
 * @explorer-desc
 * A component for rendering Excalidraw elements as a static image
 */
function ExcalidrawImage({
  elements,
  files,
  imageContainerRef,
  appState,
  rootClassName = null,
  width = 'inherit',
  height = 'inherit'
}) {
  const [Svg, setSvg] = useState(null);
  useEffect(() => {
    const setContent = async () => {
      const svg = await exportToSvg2({
        appState,
        elements,
        files
      });
      removeStyleFromSvg_HACK(svg);
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('display', 'block');
      setSvg(svg);
    };
    setContent();
  }, [elements, files, appState]);
  const containerStyle = {};
  if (width !== 'inherit') {
    containerStyle.width = `${width}px`;
  }
  if (height !== 'inherit') {
    containerStyle.height = `${height}px`;
  }
  return /*#__PURE__*/jsx("div", {
    ref: node => {
      if (node) {
        if (imageContainerRef) {
          imageContainerRef.current = node;
        }
      }
    },
    className: rootClassName ?? '',
    style: containerStyle,
    dangerouslySetInnerHTML: {
      __html: Svg?.outerHTML ?? ''
    }
  });
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function ExcalidrawComponent({
  nodeKey,
  data,
  width,
  height
}) {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const [isModalOpen, setModalOpen] = useState(data === '[]' && editor.isEditable());
  const imageContainerRef = useRef(null);
  const buttonRef = useRef(null);
  const captionButtonRef = useRef(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = useState(false);
  useEffect(() => {
    if (!isEditable) {
      if (isSelected) {
        clearSelection();
      }
      return;
    }
    return mergeRegister(editor.registerCommand(CLICK_COMMAND, event => {
      const buttonElem = buttonRef.current;
      const eventTarget = event.target;
      if (isResizing) {
        return true;
      }
      if (buttonElem !== null && isDOMNode(eventTarget) && buttonElem.contains(eventTarget)) {
        if (!event.shiftKey) {
          clearSelection();
        }
        setSelected(!isSelected);
        if (event.detail > 1) {
          setModalOpen(true);
        }
        return true;
      }
      return false;
    }, COMMAND_PRIORITY_LOW));
  }, [clearSelection, editor, isSelected, isResizing, setSelected, isEditable]);
  const deleteNode = useCallback(() => {
    setModalOpen(false);
    return editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node) {
        node.remove();
      }
    });
  }, [editor, nodeKey]);
  const setData = (els, aps, fls) => {
    return editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isExcalidrawNode(node)) {
        if (els && els.length > 0 || Object.keys(fls).length > 0) {
          node.setData(JSON.stringify({
            appState: aps,
            elements: els,
            files: fls
          }));
        } else {
          node.remove();
        }
      }
    });
  };
  const onResizeStart = () => {
    setIsResizing(true);
  };
  const onResizeEnd = (nextWidth, nextHeight) => {
    // Delay hiding the resize bars for click case
    setTimeout(() => {
      setIsResizing(false);
    }, 200);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isExcalidrawNode(node)) {
        node.setWidth(nextWidth);
        node.setHeight(nextHeight);
      }
    });
  };
  const openModal = useCallback(() => {
    setModalOpen(true);
  }, []);
  const {
    elements = [],
    files = {},
    appState = {}
  } = useMemo(() => JSON.parse(data), [data]);
  const closeModal = useCallback(() => {
    setModalOpen(false);
    if (elements.length === 0) {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if (node) {
          node.remove();
        }
      });
    }
  }, [editor, nodeKey, elements.length]);
  return /*#__PURE__*/jsxs(Fragment, {
    children: [isEditable && isModalOpen && /*#__PURE__*/jsx(ExcalidrawModal, {
      initialElements: elements,
      initialFiles: files,
      initialAppState: appState,
      isShown: isModalOpen,
      onDelete: deleteNode,
      onClose: closeModal,
      onSave: (els, aps, fls) => {
        setData(els, aps, fls);
        setModalOpen(false);
      },
      closeOnClickOutside: false
    }), elements.length > 0 && /*#__PURE__*/jsxs("button", {
      ref: buttonRef,
      className: `excalidraw-button ${isSelected ? 'selected' : ''}`,
      children: [/*#__PURE__*/jsx(ExcalidrawImage, {
        imageContainerRef: imageContainerRef,
        className: "image",
        elements: elements,
        files: files,
        appState: appState,
        width: width,
        height: height
      }), isSelected && isEditable && /*#__PURE__*/jsx("div", {
        className: "image-edit-button",
        role: "button",
        tabIndex: 0,
        onMouseDown: event => event.preventDefault(),
        onClick: openModal
      }), (isSelected || isResizing) && isEditable && /*#__PURE__*/jsx(ImageResizer, {
        buttonRef: captionButtonRef,
        showCaption: true,
        setShowCaption: () => null,
        imageRef: imageContainerRef,
        editor: editor,
        onResizeStart: onResizeStart,
        onResizeEnd: onResizeEnd,
        captionsEnabled: true
      })]
    })]
  });
}

export { ExcalidrawComponent as default };
