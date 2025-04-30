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
  const [Svg, setSvg] = React.useState(null);
  React.useEffect(() => {
    const setContent = async () => {
      const svg = await TmoLexicalEditor.exportToSvg2({
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
  return /*#__PURE__*/jsxRuntime.jsx("div", {
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
  const [editor] = LexicalComposerContext.useLexicalComposerContext();
  const isEditable = useLexicalEditable.useLexicalEditable();
  const [isModalOpen, setModalOpen] = React.useState(data === '[]' && editor.isEditable());
  const imageContainerRef = React.useRef(null);
  const buttonRef = React.useRef(null);
  const captionButtonRef = React.useRef(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection.useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = React.useState(false);
  React.useEffect(() => {
    if (!isEditable) {
      if (isSelected) {
        clearSelection();
      }
      return;
    }
    return utils.mergeRegister(editor.registerCommand(lexical.CLICK_COMMAND, event => {
      const buttonElem = buttonRef.current;
      const eventTarget = event.target;
      if (isResizing) {
        return true;
      }
      if (buttonElem !== null && lexical.isDOMNode(eventTarget) && buttonElem.contains(eventTarget)) {
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
    }, lexical.COMMAND_PRIORITY_LOW));
  }, [clearSelection, editor, isSelected, isResizing, setSelected, isEditable]);
  const deleteNode = React.useCallback(() => {
    setModalOpen(false);
    return editor.update(() => {
      const node = lexical.$getNodeByKey(nodeKey);
      if (node) {
        node.remove();
      }
    });
  }, [editor, nodeKey]);
  const setData = (els, aps, fls) => {
    return editor.update(() => {
      const node = lexical.$getNodeByKey(nodeKey);
      if (TmoLexicalEditor.$isExcalidrawNode(node)) {
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
      const node = lexical.$getNodeByKey(nodeKey);
      if (TmoLexicalEditor.$isExcalidrawNode(node)) {
        node.setWidth(nextWidth);
        node.setHeight(nextHeight);
      }
    });
  };
  const openModal = React.useCallback(() => {
    setModalOpen(true);
  }, []);
  const {
    elements = [],
    files = {},
    appState = {}
  } = React.useMemo(() => JSON.parse(data), [data]);
  const closeModal = React.useCallback(() => {
    setModalOpen(false);
    if (elements.length === 0) {
      editor.update(() => {
        const node = lexical.$getNodeByKey(nodeKey);
        if (node) {
          node.remove();
        }
      });
    }
  }, [editor, nodeKey, elements.length]);
  return /*#__PURE__*/jsxRuntime.jsxs(jsxRuntime.Fragment, {
    children: [isEditable && isModalOpen && /*#__PURE__*/jsxRuntime.jsx(TmoLexicalEditor.ExcalidrawModal, {
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
    }), elements.length > 0 && /*#__PURE__*/jsxRuntime.jsxs("button", {
      ref: buttonRef,
      className: `excalidraw-button ${isSelected ? 'selected' : ''}`,
      children: [/*#__PURE__*/jsxRuntime.jsx(ExcalidrawImage, {
        imageContainerRef: imageContainerRef,
        className: "image",
        elements: elements,
        files: files,
        appState: appState,
        width: width,
        height: height
      }), isSelected && isEditable && /*#__PURE__*/jsxRuntime.jsx("div", {
        className: "image-edit-button",
        role: "button",
        tabIndex: 0,
        onMouseDown: event => event.preventDefault(),
        onClick: openModal
      }), (isSelected || isResizing) && isEditable && /*#__PURE__*/jsxRuntime.jsx(ImageResizer.ImageResizer, {
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

exports.default = ExcalidrawComponent;
