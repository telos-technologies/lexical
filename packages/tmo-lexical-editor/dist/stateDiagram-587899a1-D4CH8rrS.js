/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var styles6aaf32cf = require('./styles-6aaf32cf-DkggX2Zv.js');
var layout = require('./layout-BF09PWYU.js');
var index = require('./index-JCRl9uKO.js');
var graph = require('./graph-BUWHTs5-.js');
var line = require('./line-wd0yC7qM.js');
require('./percentages-YKFLWNK2-CsBndlsw.js');
require('@lexical/link');
require('@lexical/list');
require('@lexical/react/LexicalComposer');
require('@lexical/rich-text');
require('lexical');
require('react');
require('react-dom');
require('react/jsx-runtime');
require('@lexical/react/LexicalHistoryPlugin');
require('@lexical/react/LexicalAutoFocusPlugin');
require('@lexical/react/LexicalCharacterLimitPlugin');
require('@lexical/react/LexicalCheckListPlugin');
require('@lexical/react/LexicalClearEditorPlugin');
require('@lexical/react/LexicalClickableLinkPlugin');
require('@lexical/react/LexicalCollaborationPlugin');
require('@lexical/react/LexicalComposerContext');
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
require('@lexical/utils');
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
require('./array-otHaSZVC.js');
require('./path-COueR9Sh.js');

const drawStartState = (g) => g.append("circle").attr("class", "start-state").attr("r", index.getConfig().state.sizeUnit).attr("cx", index.getConfig().state.padding + index.getConfig().state.sizeUnit).attr("cy", index.getConfig().state.padding + index.getConfig().state.sizeUnit);
const drawDivider = (g) => g.append("line").style("stroke", "grey").style("stroke-dasharray", "3").attr("x1", index.getConfig().state.textHeight).attr("class", "divider").attr("x2", index.getConfig().state.textHeight * 2).attr("y1", 0).attr("y2", 0);
const drawSimpleState = (g, stateDef) => {
  const state = g.append("text").attr("x", 2 * index.getConfig().state.padding).attr("y", index.getConfig().state.textHeight + 2 * index.getConfig().state.padding).attr("font-size", index.getConfig().state.fontSize).attr("class", "state-title").text(stateDef.id);
  const classBox = state.node().getBBox();
  g.insert("rect", ":first-child").attr("x", index.getConfig().state.padding).attr("y", index.getConfig().state.padding).attr("width", classBox.width + 2 * index.getConfig().state.padding).attr("height", classBox.height + 2 * index.getConfig().state.padding).attr("rx", index.getConfig().state.radius);
  return state;
};
const drawDescrState = (g, stateDef) => {
  const addTspan = function(textEl, txt, isFirst2) {
    const tSpan = textEl.append("tspan").attr("x", 2 * index.getConfig().state.padding).text(txt);
    if (!isFirst2) {
      tSpan.attr("dy", index.getConfig().state.textHeight);
    }
  };
  const title = g.append("text").attr("x", 2 * index.getConfig().state.padding).attr("y", index.getConfig().state.textHeight + 1.3 * index.getConfig().state.padding).attr("font-size", index.getConfig().state.fontSize).attr("class", "state-title").text(stateDef.descriptions[0]);
  const titleBox = title.node().getBBox();
  const titleHeight = titleBox.height;
  const description = g.append("text").attr("x", index.getConfig().state.padding).attr(
    "y",
    titleHeight + index.getConfig().state.padding * 0.4 + index.getConfig().state.dividerMargin + index.getConfig().state.textHeight
  ).attr("class", "state-description");
  let isFirst = true;
  let isSecond = true;
  stateDef.descriptions.forEach(function(descr) {
    if (!isFirst) {
      addTspan(description, descr, isSecond);
      isSecond = false;
    }
    isFirst = false;
  });
  const descrLine = g.append("line").attr("x1", index.getConfig().state.padding).attr("y1", index.getConfig().state.padding + titleHeight + index.getConfig().state.dividerMargin / 2).attr("y2", index.getConfig().state.padding + titleHeight + index.getConfig().state.dividerMargin / 2).attr("class", "descr-divider");
  const descrBox = description.node().getBBox();
  const width = Math.max(descrBox.width, titleBox.width);
  descrLine.attr("x2", width + 3 * index.getConfig().state.padding);
  g.insert("rect", ":first-child").attr("x", index.getConfig().state.padding).attr("y", index.getConfig().state.padding).attr("width", width + 2 * index.getConfig().state.padding).attr("height", descrBox.height + titleHeight + 2 * index.getConfig().state.padding).attr("rx", index.getConfig().state.radius);
  return g;
};
const addTitleAndBox = (g, stateDef, altBkg) => {
  const pad = index.getConfig().state.padding;
  const dblPad = 2 * index.getConfig().state.padding;
  const orgBox = g.node().getBBox();
  const orgWidth = orgBox.width;
  const orgX = orgBox.x;
  const title = g.append("text").attr("x", 0).attr("y", index.getConfig().state.titleShift).attr("font-size", index.getConfig().state.fontSize).attr("class", "state-title").text(stateDef.id);
  const titleBox = title.node().getBBox();
  const titleWidth = titleBox.width + dblPad;
  let width = Math.max(titleWidth, orgWidth);
  if (width === orgWidth) {
    width = width + dblPad;
  }
  let startX;
  const graphBox = g.node().getBBox();
  startX = orgX - pad;
  if (titleWidth > orgWidth) {
    startX = (orgWidth - width) / 2 + pad;
  }
  if (Math.abs(orgX - graphBox.x) < pad && titleWidth > orgWidth) {
    startX = orgX - (titleWidth - orgWidth) / 2;
  }
  const lineY = 1 - index.getConfig().state.textHeight;
  g.insert("rect", ":first-child").attr("x", startX).attr("y", lineY).attr("class", altBkg ? "alt-composit" : "composit").attr("width", width).attr(
    "height",
    graphBox.height + index.getConfig().state.textHeight + index.getConfig().state.titleShift + 1
  ).attr("rx", "0");
  title.attr("x", startX + pad);
  if (titleWidth <= orgWidth) {
    title.attr("x", orgX + (width - dblPad) / 2 - titleWidth / 2 + pad);
  }
  g.insert("rect", ":first-child").attr("x", startX).attr(
    "y",
    index.getConfig().state.titleShift - index.getConfig().state.textHeight - index.getConfig().state.padding
  ).attr("width", width).attr("height", index.getConfig().state.textHeight * 3).attr("rx", index.getConfig().state.radius);
  g.insert("rect", ":first-child").attr("x", startX).attr(
    "y",
    index.getConfig().state.titleShift - index.getConfig().state.textHeight - index.getConfig().state.padding
  ).attr("width", width).attr("height", graphBox.height + 3 + 2 * index.getConfig().state.textHeight).attr("rx", index.getConfig().state.radius);
  return g;
};
const drawEndState = (g) => {
  g.append("circle").attr("class", "end-state-outer").attr("r", index.getConfig().state.sizeUnit + index.getConfig().state.miniPadding).attr(
    "cx",
    index.getConfig().state.padding + index.getConfig().state.sizeUnit + index.getConfig().state.miniPadding
  ).attr(
    "cy",
    index.getConfig().state.padding + index.getConfig().state.sizeUnit + index.getConfig().state.miniPadding
  );
  return g.append("circle").attr("class", "end-state-inner").attr("r", index.getConfig().state.sizeUnit).attr("cx", index.getConfig().state.padding + index.getConfig().state.sizeUnit + 2).attr("cy", index.getConfig().state.padding + index.getConfig().state.sizeUnit + 2);
};
const drawForkJoinState = (g, stateDef) => {
  let width = index.getConfig().state.forkWidth;
  let height = index.getConfig().state.forkHeight;
  if (stateDef.parentId) {
    let tmp = width;
    width = height;
    height = tmp;
  }
  return g.append("rect").style("stroke", "black").style("fill", "black").attr("width", width).attr("height", height).attr("x", index.getConfig().state.padding).attr("y", index.getConfig().state.padding);
};
const _drawLongText = (_text, x, y, g) => {
  let textHeight = 0;
  const textElem = g.append("text");
  textElem.style("text-anchor", "start");
  textElem.attr("class", "noteText");
  let text = _text.replace(/\r\n/g, "<br/>");
  text = text.replace(/\n/g, "<br/>");
  const lines = text.split(index.common$1.lineBreakRegex);
  let tHeight = 1.25 * index.getConfig().state.noteMargin;
  for (const line2 of lines) {
    const txt = line2.trim();
    if (txt.length > 0) {
      const span = textElem.append("tspan");
      span.text(txt);
      if (tHeight === 0) {
        const textBounds = span.node().getBBox();
        tHeight += textBounds.height;
      }
      textHeight += tHeight;
      span.attr("x", x + index.getConfig().state.noteMargin);
      span.attr("y", y + textHeight + 1.25 * index.getConfig().state.noteMargin);
    }
  }
  return { textWidth: textElem.node().getBBox().width, textHeight };
};
const drawNote = (text, g) => {
  g.attr("class", "state-note");
  const note = g.append("rect").attr("x", 0).attr("y", index.getConfig().state.padding);
  const rectElem = g.append("g");
  const { textWidth, textHeight } = _drawLongText(text, 0, 0, rectElem);
  note.attr("height", textHeight + 2 * index.getConfig().state.noteMargin);
  note.attr("width", textWidth + index.getConfig().state.noteMargin * 2);
  return note;
};
const drawState = function(elem, stateDef) {
  const id = stateDef.id;
  const stateInfo = {
    id,
    label: stateDef.id,
    width: 0,
    height: 0
  };
  const g = elem.append("g").attr("id", id).attr("class", "stateGroup");
  if (stateDef.type === "start") {
    drawStartState(g);
  }
  if (stateDef.type === "end") {
    drawEndState(g);
  }
  if (stateDef.type === "fork" || stateDef.type === "join") {
    drawForkJoinState(g, stateDef);
  }
  if (stateDef.type === "note") {
    drawNote(stateDef.note.text, g);
  }
  if (stateDef.type === "divider") {
    drawDivider(g);
  }
  if (stateDef.type === "default" && stateDef.descriptions.length === 0) {
    drawSimpleState(g, stateDef);
  }
  if (stateDef.type === "default" && stateDef.descriptions.length > 0) {
    drawDescrState(g, stateDef);
  }
  const stateBox = g.node().getBBox();
  stateInfo.width = stateBox.width + 2 * index.getConfig().state.padding;
  stateInfo.height = stateBox.height + 2 * index.getConfig().state.padding;
  return stateInfo;
};
let edgeCount = 0;
const drawEdge = function(elem, path, relation) {
  const getRelationType = function(type) {
    switch (type) {
      case styles6aaf32cf.db.relationType.AGGREGATION:
        return "aggregation";
      case styles6aaf32cf.db.relationType.EXTENSION:
        return "extension";
      case styles6aaf32cf.db.relationType.COMPOSITION:
        return "composition";
      case styles6aaf32cf.db.relationType.DEPENDENCY:
        return "dependency";
    }
  };
  path.points = path.points.filter((p) => !Number.isNaN(p.y));
  const lineData = path.points;
  const lineFunction = line.line().x(function(d) {
    return d.x;
  }).y(function(d) {
    return d.y;
  }).curve(index.curveBasis);
  const svgPath = elem.append("path").attr("d", lineFunction(lineData)).attr("id", "edge" + edgeCount).attr("class", "transition");
  let url = "";
  if (index.getConfig().state.arrowMarkerAbsolute) {
    url = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search;
    url = url.replace(/\(/g, "\\(");
    url = url.replace(/\)/g, "\\)");
  }
  svgPath.attr(
    "marker-end",
    "url(" + url + "#" + getRelationType(styles6aaf32cf.db.relationType.DEPENDENCY) + "End)"
  );
  if (relation.title !== void 0) {
    const label = elem.append("g").attr("class", "stateLabel");
    const { x, y } = index.utils.calcLabelPosition(path.points);
    const rows = index.common$1.getRows(relation.title);
    let titleHeight = 0;
    const titleRows = [];
    let maxWidth = 0;
    for (let i = 0; i <= rows.length; i++) {
      const title = label.append("text").attr("text-anchor", "middle").text(rows[i]).attr("x", x).attr("y", y + titleHeight);
      const boundsTmp = title.node().getBBox();
      maxWidth = Math.max(maxWidth, boundsTmp.width);
      index.log$1.info(boundsTmp.x, x, y + titleHeight);
      if (titleHeight === 0) {
        const titleBox = title.node().getBBox();
        titleHeight = titleBox.height;
        index.log$1.info("Title height", titleHeight, y);
      }
      titleRows.push(title);
    }
    let boxHeight = titleHeight * rows.length;
    if (rows.length > 1) {
      const heightAdj = (rows.length - 1) * titleHeight * 0.5;
      titleRows.forEach((title, i) => title.attr("y", y + i * titleHeight - heightAdj));
      boxHeight = titleHeight * rows.length;
    }
    const bounds = label.node().getBBox();
    label.insert("rect", ":first-child").attr("class", "box").attr("x", x - maxWidth / 2 - index.getConfig().state.padding / 2).attr("y", y - boxHeight / 2 - index.getConfig().state.padding / 2 - 3.5).attr("width", maxWidth + index.getConfig().state.padding).attr("height", boxHeight + index.getConfig().state.padding);
    index.log$1.info(bounds);
  }
  edgeCount++;
};
let conf;
const transformationLog = {};
const setConf = function() {
};
const insertMarkers = function(elem) {
  elem.append("defs").append("marker").attr("id", "dependencyEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 19,7 L9,13 L14,7 L9,1 Z");
};
const draw = function(text, id, _version, diagObj) {
  conf = index.getConfig().state;
  const securityLevel = index.getConfig().securityLevel;
  let sandboxElement;
  if (securityLevel === "sandbox") {
    sandboxElement = index.select("#i" + id);
  }
  const root = securityLevel === "sandbox" ? index.select(sandboxElement.nodes()[0].contentDocument.body) : index.select("body");
  const doc = securityLevel === "sandbox" ? sandboxElement.nodes()[0].contentDocument : document;
  index.log$1.debug("Rendering diagram " + text);
  const diagram2 = root.select(`[id='${id}']`);
  insertMarkers(diagram2);
  const rootDoc = diagObj.db.getRootDoc();
  renderDoc(rootDoc, diagram2, void 0, false, root, doc, diagObj);
  const padding = conf.padding;
  const bounds = diagram2.node().getBBox();
  const width = bounds.width + padding * 2;
  const height = bounds.height + padding * 2;
  const svgWidth = width * 1.75;
  index.configureSvgSize(diagram2, height, svgWidth, conf.useMaxWidth);
  diagram2.attr(
    "viewBox",
    `${bounds.x - conf.padding}  ${bounds.y - conf.padding} ` + width + " " + height
  );
};
const getLabelWidth = (text) => {
  return text ? text.length * conf.fontSizeFactor : 1;
};
const renderDoc = (doc, diagram2, parentId, altBkg, root, domDocument, diagObj) => {
  const graph$1 = new graph.Graph({
    compound: true,
    multigraph: true
  });
  let i;
  let edgeFreeDoc = true;
  for (i = 0; i < doc.length; i++) {
    if (doc[i].stmt === "relation") {
      edgeFreeDoc = false;
      break;
    }
  }
  if (parentId) {
    graph$1.setGraph({
      rankdir: "LR",
      multigraph: true,
      compound: true,
      // acyclicer: 'greedy',
      ranker: "tight-tree",
      ranksep: edgeFreeDoc ? 1 : conf.edgeLengthFactor,
      nodeSep: edgeFreeDoc ? 1 : 50,
      isMultiGraph: true
      // ranksep: 5,
      // nodesep: 1
    });
  } else {
    graph$1.setGraph({
      rankdir: "TB",
      multigraph: true,
      compound: true,
      // isCompound: true,
      // acyclicer: 'greedy',
      // ranker: 'longest-path'
      ranksep: edgeFreeDoc ? 1 : conf.edgeLengthFactor,
      nodeSep: edgeFreeDoc ? 1 : 50,
      ranker: "tight-tree",
      // ranker: 'network-simplex'
      isMultiGraph: true
    });
  }
  graph$1.setDefaultEdgeLabel(function() {
    return {};
  });
  diagObj.db.extract(doc);
  const states = diagObj.db.getStates();
  const relations = diagObj.db.getRelations();
  const keys2 = Object.keys(states);
  for (const key of keys2) {
    const stateDef = states[key];
    if (parentId) {
      stateDef.parentId = parentId;
    }
    let node;
    if (stateDef.doc) {
      let sub = diagram2.append("g").attr("id", stateDef.id).attr("class", "stateGroup");
      node = renderDoc(stateDef.doc, sub, stateDef.id, !altBkg, root, domDocument, diagObj);
      {
        sub = addTitleAndBox(sub, stateDef, altBkg);
        let boxBounds = sub.node().getBBox();
        node.width = boxBounds.width;
        node.height = boxBounds.height + conf.padding / 2;
        transformationLog[stateDef.id] = { y: conf.compositTitleSize };
      }
    } else {
      node = drawState(diagram2, stateDef);
    }
    if (stateDef.note) {
      const noteDef = {
        descriptions: [],
        id: stateDef.id + "-note",
        note: stateDef.note,
        type: "note"
      };
      const note = drawState(diagram2, noteDef);
      if (stateDef.note.position === "left of") {
        graph$1.setNode(node.id + "-note", note);
        graph$1.setNode(node.id, node);
      } else {
        graph$1.setNode(node.id, node);
        graph$1.setNode(node.id + "-note", note);
      }
      graph$1.setParent(node.id, node.id + "-group");
      graph$1.setParent(node.id + "-note", node.id + "-group");
    } else {
      graph$1.setNode(node.id, node);
    }
  }
  index.log$1.debug("Count=", graph$1.nodeCount(), graph$1);
  let cnt = 0;
  relations.forEach(function(relation) {
    cnt++;
    index.log$1.debug("Setting edge", relation);
    graph$1.setEdge(
      relation.id1,
      relation.id2,
      {
        relation,
        width: getLabelWidth(relation.title),
        height: conf.labelHeight * index.common$1.getRows(relation.title).length,
        labelpos: "c"
      },
      "id" + cnt
    );
  });
  layout.layout(graph$1);
  index.log$1.debug("Graph after layout", graph$1.nodes());
  const svgElem = diagram2.node();
  graph$1.nodes().forEach(function(v) {
    if (v !== void 0 && graph$1.node(v) !== void 0) {
      index.log$1.warn("Node " + v + ": " + JSON.stringify(graph$1.node(v)));
      root.select("#" + svgElem.id + " #" + v).attr(
        "transform",
        "translate(" + (graph$1.node(v).x - graph$1.node(v).width / 2) + "," + (graph$1.node(v).y + (transformationLog[v] ? transformationLog[v].y : 0) - graph$1.node(v).height / 2) + " )"
      );
      root.select("#" + svgElem.id + " #" + v).attr("data-x-shift", graph$1.node(v).x - graph$1.node(v).width / 2);
      const dividers = domDocument.querySelectorAll("#" + svgElem.id + " #" + v + " .divider");
      dividers.forEach((divider) => {
        const parent = divider.parentElement;
        let pWidth = 0;
        let pShift = 0;
        if (parent) {
          if (parent.parentElement) {
            pWidth = parent.parentElement.getBBox().width;
          }
          pShift = parseInt(parent.getAttribute("data-x-shift"), 10);
          if (Number.isNaN(pShift)) {
            pShift = 0;
          }
        }
        divider.setAttribute("x1", 0 - pShift + 8);
        divider.setAttribute("x2", pWidth - pShift - 8);
      });
    } else {
      index.log$1.debug("No Node " + v + ": " + JSON.stringify(graph$1.node(v)));
    }
  });
  let stateBox = svgElem.getBBox();
  graph$1.edges().forEach(function(e) {
    if (e !== void 0 && graph$1.edge(e) !== void 0) {
      index.log$1.debug("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(graph$1.edge(e)));
      drawEdge(diagram2, graph$1.edge(e), graph$1.edge(e).relation);
    }
  });
  stateBox = svgElem.getBBox();
  const stateInfo = {
    id: parentId ? parentId : "root",
    label: parentId ? parentId : "root",
    width: 0,
    height: 0
  };
  stateInfo.width = stateBox.width + 2 * conf.padding;
  stateInfo.height = stateBox.height + 2 * conf.padding;
  index.log$1.debug("Doc rendered", stateInfo, graph$1);
  return stateInfo;
};
const renderer = {
  setConf,
  draw
};
const diagram = {
  parser: styles6aaf32cf.parser$1,
  db: styles6aaf32cf.db,
  renderer,
  styles: styles6aaf32cf.styles,
  init: (cnf) => {
    if (!cnf.state) {
      cnf.state = {};
    }
    cnf.state.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
    styles6aaf32cf.db.clear();
  }
};

exports.diagram = diagram;
