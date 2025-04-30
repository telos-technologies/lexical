/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var index$1 = require('./index-mmnU_sIP.js');
var TmoLexicalEditor = require('./percentages-YKFLWNK2-B6-AE232.js');

var has = Object.prototype.hasOwnProperty;

function find(iter, tar, key) {
	for (key of iter.keys()) {
		if (dequal(key, tar)) return key;
	}
}

function dequal(foo, bar) {
	var ctor, len, tmp;
	if (foo === bar) return true;

	if (foo && bar && (ctor=foo.constructor) === bar.constructor) {
		if (ctor === Date) return foo.getTime() === bar.getTime();
		if (ctor === RegExp) return foo.toString() === bar.toString();

		if (ctor === Array) {
			if ((len=foo.length) === bar.length) {
				while (len-- && dequal(foo[len], bar[len]));
			}
			return len === -1;
		}

		if (ctor === Set) {
			if (foo.size !== bar.size) {
				return false;
			}
			for (len of foo) {
				tmp = len;
				if (tmp && typeof tmp === 'object') {
					tmp = find(bar, tmp);
					if (!tmp) return false;
				}
				if (!bar.has(tmp)) return false;
			}
			return true;
		}

		if (ctor === Map) {
			if (foo.size !== bar.size) {
				return false;
			}
			for (len of foo) {
				tmp = len[0];
				if (tmp && typeof tmp === 'object') {
					tmp = find(bar, tmp);
					if (!tmp) return false;
				}
				if (!dequal(len[1], bar.get(tmp))) {
					return false;
				}
			}
			return true;
		}

		if (ctor === ArrayBuffer) {
			foo = new Uint8Array(foo);
			bar = new Uint8Array(bar);
		} else if (ctor === DataView) {
			if ((len=foo.byteLength) === bar.byteLength) {
				while (len-- && foo.getInt8(len) === bar.getInt8(len));
			}
			return len === -1;
		}

		if (ArrayBuffer.isView(foo)) {
			if ((len=foo.byteLength) === bar.byteLength) {
				while (len-- && foo[len] === bar[len]);
			}
			return len === -1;
		}

		if (!ctor || typeof foo === 'object') {
			len = 0;
			for (ctor in foo) {
				if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
				if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
			}
			return Object.keys(bar).length === len;
		}
	}

	return foo !== foo && bar !== bar;
}

function dedent(str) {
	str = str.replace(/\r?\n/g, '\n');
  let arr = str.match(/^[ \t]*(?=\S)/gm);
  let i = 0, min = 1/0, len = (arr||[]).length;
  for (; i < len; i++) min = Math.min(min, arr[i].length);
  return len && min ? str.replace(new RegExp(`^[ \\t]{${min}}`, 'gm'), '') : str;
}

class Assertion extends Error {
	constructor(opts={}) {
		super(opts.message);
		this.name = 'Assertion';
		this.code = 'ERR_ASSERTION';
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
		this.details = opts.details || false;
		this.generated = !!opts.generated;
		this.operator = opts.operator;
		this.expects = opts.expects;
		this.actual = opts.actual;
	}
}

function assert(bool, actual, expects, operator, detailer, backup, msg) {
	if (bool) return;
	let message = msg || backup;
	if (msg instanceof Error) throw msg;
	let details = detailer;
	throw new Assertion({ actual, expects, operator, message, details, generated: !msg });
}

function ok(val, msg) {
	assert(!!val, false, true, 'ok', false, 'Expected value to be truthy', msg);
}

// ---

function not(val, msg) {
	assert(!val, true, false, 'not', false, 'Expected value to be falsey', msg);
}

not.ok = not;

not.equal = function (val, exp, msg) {
	assert(!dequal(val, exp), val, exp, 'not.equal', false, 'Expected values not to be deeply equal', msg);
};

not.type = function (val, exp, msg) {
	let tmp = typeof val;
	assert(tmp !== exp, tmp, exp, 'not.type', false, `Expected "${tmp}" not to be "${exp}"`, msg);
};

not.instance = function (val, exp, msg) {
	let name = '`' + (exp.name || exp.constructor.name) + '`';
	assert(!(val instanceof exp), val, exp, 'not.instance', false, `Expected value not to be an instance of ${name}`, msg);
};

not.snapshot = function (val, exp, msg) {
	val=dedent(val); exp=dedent(exp);
	assert(val !== exp, val, exp, 'not.snapshot', false, 'Expected value not to match snapshot', msg);
};

not.fixture = function (val, exp, msg) {
	val=dedent(val); exp=dedent(exp);
	assert(val !== exp, val, exp, 'not.fixture', false, 'Expected value not to match fixture', msg);
};

not.match = function (val, exp, msg) {
	if (typeof exp === 'string') {
		assert(!val.includes(exp), val, exp, 'not.match', false, `Expected value not to include "${exp}" substring`, msg);
	} else {
		assert(!exp.test(val), val, exp, 'not.match', false, `Expected value not to match \`${String(exp)}\` pattern`, msg);
	}
};

not.throws = function (blk, exp, msg) {
	if (!msg && typeof exp === 'string') {
		msg = exp; exp = null;
	}

	try {
		blk();
	} catch (err) {
		if (typeof exp === 'function') {
			assert(!exp(err), true, false, 'not.throws', false, 'Expected function not to throw matching exception', msg);
		} else if (exp instanceof RegExp) {
			assert(!exp.test(err.message), true, false, 'not.throws', false, `Expected function not to throw exception matching \`${String(exp)}\` pattern`, msg);
		} else if (!exp) {
			assert(false, true, false, 'not.throws', false, 'Expected function not to throw', msg);
		}
	}
};

/**
 * @typedef {import('mdast').Root|import('mdast').Content} Node
 *
 * @typedef Options
 *   Configuration (optional).
 * @property {boolean | null | undefined} [includeImageAlt=true]
 *   Whether to use `alt` for `image`s.
 * @property {boolean | null | undefined} [includeHtml=true]
 *   Whether to use `value` of HTML.
 */

/** @type {Options} */
const emptyOptions = {};

/**
 * Get the text content of a node or list of nodes.
 *
 * Prefers the node’s plain-text fields, otherwise serializes its children,
 * and if the given value is an array, serialize the nodes in it.
 *
 * @param {unknown} value
 *   Thing to serialize, typically `Node`.
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns {string}
 *   Serialized `value`.
 */
function toString(value, options) {
  const settings = emptyOptions;
  const includeImageAlt =
    typeof settings.includeImageAlt === 'boolean'
      ? settings.includeImageAlt
      : true;
  const includeHtml =
    typeof settings.includeHtml === 'boolean' ? settings.includeHtml : true;

  return one(value, includeImageAlt, includeHtml)
}

/**
 * One node or several nodes.
 *
 * @param {unknown} value
 *   Thing to serialize.
 * @param {boolean} includeImageAlt
 *   Include image `alt`s.
 * @param {boolean} includeHtml
 *   Include HTML.
 * @returns {string}
 *   Serialized node.
 */
function one(value, includeImageAlt, includeHtml) {
  if (node(value)) {
    if ('value' in value) {
      return value.type === 'html' && !includeHtml ? '' : value.value
    }

    if (includeImageAlt && 'alt' in value && value.alt) {
      return value.alt
    }

    if ('children' in value) {
      return all(value.children, includeImageAlt, includeHtml)
    }
  }

  if (Array.isArray(value)) {
    return all(value, includeImageAlt, includeHtml)
  }

  return ''
}

/**
 * Serialize a list of nodes.
 *
 * @param {Array<unknown>} values
 *   Thing to serialize.
 * @param {boolean} includeImageAlt
 *   Include image `alt`s.
 * @param {boolean} includeHtml
 *   Include HTML.
 * @returns {string}
 *   Serialized nodes.
 */
function all(values, includeImageAlt, includeHtml) {
  /** @type {Array<string>} */
  const result = [];
  let index = -1;

  while (++index < values.length) {
    result[index] = one(values[index], includeImageAlt, includeHtml);
  }

  return result.join('')
}

/**
 * Check if `value` looks like a node.
 *
 * @param {unknown} value
 *   Thing.
 * @returns {value is Node}
 *   Whether `value` is a node.
 */
function node(value) {
  return Boolean(value && typeof value === 'object')
}

/**
 * This module is compiled away!
 *
 * Parsing markdown comes with a couple of constants, such as minimum or maximum
 * sizes of certain sequences.
 * Additionally, there are a couple symbols used inside micromark.
 * These are all defined here, but compiled away by scripts.
 */
const constants = /** @type {const} */ ({
  attentionSideBefore: 1, // Symbol to mark an attention sequence as before content: `*a`
  attentionSideAfter: 2, // Symbol to mark an attention sequence as after content: `a*`
  atxHeadingOpeningFenceSizeMax: 6, // 6 number signs is fine, 7 isn’t.
  autolinkDomainSizeMax: 63, // 63 characters is fine, 64 is too many.
  autolinkSchemeSizeMax: 32, // 32 characters is fine, 33 is too many.
  cdataOpeningString: 'CDATA[', // And preceded by `<![`.
  characterGroupWhitespace: 1, // Symbol used to indicate a character is whitespace
  characterGroupPunctuation: 2, // Symbol used to indicate a character is punctuation
  characterReferenceDecimalSizeMax: 7, // `&#9999999;`.
  characterReferenceHexadecimalSizeMax: 6, // `&#xff9999;`.
  characterReferenceNamedSizeMax: 31, // `&CounterClockwiseContourIntegral;`.
  codeFencedSequenceSizeMin: 3, // At least 3 ticks or tildes are needed.
  contentTypeDocument: 'document',
  contentTypeFlow: 'flow',
  contentTypeContent: 'content',
  contentTypeString: 'string',
  contentTypeText: 'text',
  hardBreakPrefixSizeMin: 2, // At least 2 trailing spaces are needed.
  htmlRaw: 1, // Symbol for `<script>`
  htmlComment: 2, // Symbol for `<!---->`
  htmlInstruction: 3, // Symbol for `<?php?>`
  htmlDeclaration: 4, // Symbol for `<!doctype>`
  htmlCdata: 5, // Symbol for `<![CDATA[]]>`
  htmlBasic: 6, // Symbol for `<div`
  htmlComplete: 7, // Symbol for `<x>`
  htmlRawSizeMax: 8, // Length of `textarea`.
  linkResourceDestinationBalanceMax: 32, // See: <https://spec.commonmark.org/0.30/#link-destination>, <https://github.com/remarkjs/react-markdown/issues/658#issuecomment-984345577>
  linkReferenceSizeMax: 999, // See: <https://spec.commonmark.org/0.30/#link-label>
  listItemValueSizeMax: 10, // See: <https://spec.commonmark.org/0.30/#ordered-list-marker>
  numericBaseDecimal: 10,
  numericBaseHexadecimal: 0x10,
  tabSize: 4, // Tabs have a hard-coded size of 4, per CommonMark.
  thematicBreakMarkerCountMin: 3, // At least 3 asterisks, dashes, or underscores are needed.
  v8MaxSafeChunkSize: 10000 // V8 (and potentially others) have problems injecting giant arrays into other arrays, hence we operate in chunks.
});

/**
 * Like `Array#splice`, but smarter for giant arrays.
 *
 * `Array#splice` takes all items to be inserted as individual argument which
 * causes a stack overflow in V8 when trying to insert 100k items for instance.
 *
 * Otherwise, this does not return the removed items, and takes `items` as an
 * array instead of rest parameters.
 *
 * @template {unknown} T
 *   Item type.
 * @param {Array<T>} list
 *   List to operate on.
 * @param {number} start
 *   Index to remove/insert at (can be negative).
 * @param {number} remove
 *   Number of items to remove.
 * @param {Array<T>} items
 *   Items to inject into `list`.
 * @returns {void}
 *   Nothing.
 */
function splice(list, start, remove, items) {
  const end = list.length;
  let chunkStart = 0;
  /** @type {Array<unknown>} */
  let parameters;

  // Make start between zero and `end` (included).
  if (start < 0) {
    start = -start > end ? 0 : end + start;
  } else {
    start = start > end ? end : start;
  }

  remove = remove > 0 ? remove : 0;

  // No need to chunk the items if there’s only a couple (10k) items.
  if (items.length < constants.v8MaxSafeChunkSize) {
    parameters = Array.from(items);
    parameters.unshift(start, remove);
    // @ts-expect-error Hush, it’s fine.
    list.splice(...parameters);
  } else {
    // Delete `remove` items starting from `start`
    if (remove) list.splice(start, remove);

    // Insert the items in chunks to not cause stack overflows.
    while (chunkStart < items.length) {
      parameters = items.slice(
        chunkStart,
        chunkStart + constants.v8MaxSafeChunkSize
      );
      parameters.unshift(start, 0);
      // @ts-expect-error Hush, it’s fine.
      list.splice(...parameters);

      chunkStart += constants.v8MaxSafeChunkSize;
      start += constants.v8MaxSafeChunkSize;
    }
  }
}

/**
 * Append `items` (an array) at the end of `list` (another array).
 * When `list` was empty, returns `items` instead.
 *
 * This prevents a potentially expensive operation when `list` is empty,
 * and adds items in batches to prevent V8 from hanging.
 *
 * @template {unknown} T
 *   Item type.
 * @param {Array<T>} list
 *   List to operate on.
 * @param {Array<T>} items
 *   Items to add to `list`.
 * @returns {Array<T>}
 *   Either `list` or `items`.
 */
function push(list, items) {
  if (list.length > 0) {
    splice(list, list.length, 0, items);
    return list
  }

  return items
}

/**
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('micromark-util-types').Handles} Handles
 * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
 * @typedef {import('micromark-util-types').NormalizedExtension} NormalizedExtension
 */


const hasOwnProperty = {}.hasOwnProperty;

/**
 * Combine multiple syntax extensions into one.
 *
 * @param {Array<Extension>} extensions
 *   List of syntax extensions.
 * @returns {NormalizedExtension}
 *   A single combined extension.
 */
function combineExtensions(extensions) {
  /** @type {NormalizedExtension} */
  const all = {};
  let index = -1;

  while (++index < extensions.length) {
    syntaxExtension(all, extensions[index]);
  }

  return all
}

/**
 * Merge `extension` into `all`.
 *
 * @param {NormalizedExtension} all
 *   Extension to merge into.
 * @param {Extension} extension
 *   Extension to merge.
 * @returns {void}
 */
function syntaxExtension(all, extension) {
  /** @type {keyof Extension} */
  let hook;

  for (hook in extension) {
    const maybe = hasOwnProperty.call(all, hook) ? all[hook] : undefined;
    /** @type {Record<string, unknown>} */
    const left = maybe || (all[hook] = {});
    /** @type {Record<string, unknown> | undefined} */
    const right = extension[hook];
    /** @type {string} */
    let code;

    if (right) {
      for (code in right) {
        if (!hasOwnProperty.call(left, code)) left[code] = [];
        const value = right[code];
        constructs(
          // @ts-expect-error Looks like a list.
          left[code],
          Array.isArray(value) ? value : value ? [value] : []
        );
      }
    }
  }
}

/**
 * Merge `list` into `existing` (both lists of constructs).
 * Mutates `existing`.
 *
 * @param {Array<unknown>} existing
 * @param {Array<unknown>} list
 * @returns {void}
 */
function constructs(existing, list) {
  let index = -1;
  /** @type {Array<unknown>} */
  const before = [];

  while (++index < list.length) {
(list[index].add === 'after' ? existing : before).push(list[index]);
  }

  splice(existing, 0, 0, before);
}

/**
 * Character codes.
 *
 * This module is compiled away!
 *
 * micromark works based on character codes.
 * This module contains constants for the ASCII block and the replacement
 * character.
 * A couple of them are handled in a special way, such as the line endings
 * (CR, LF, and CR+LF, commonly known as end-of-line: EOLs), the tab (horizontal
 * tab) and its expansion based on what column it’s at (virtual space),
 * and the end-of-file (eof) character.
 * As values are preprocessed before handling them, the actual characters LF,
 * CR, HT, and NUL (which is present as the replacement character), are
 * guaranteed to not exist.
 *
 * Unicode basic latin block.
 */
const codes = /** @type {const} */ ({
  carriageReturn: -5,
  lineFeed: -4,
  carriageReturnLineFeed: -3,
  horizontalTab: -2,
  virtualSpace: -1,
  eof: null,
  nul: 0,
  soh: 1,
  stx: 2,
  etx: 3,
  eot: 4,
  enq: 5,
  ack: 6,
  bel: 7,
  bs: 8,
  ht: 9, // `\t`
  lf: 10, // `\n`
  vt: 11, // `\v`
  ff: 12, // `\f`
  cr: 13, // `\r`
  so: 14,
  si: 15,
  dle: 16,
  dc1: 17,
  dc2: 18,
  dc3: 19,
  dc4: 20,
  nak: 21,
  syn: 22,
  etb: 23,
  can: 24,
  em: 25,
  sub: 26,
  esc: 27,
  fs: 28,
  gs: 29,
  rs: 30,
  us: 31,
  space: 32,
  exclamationMark: 33, // `!`
  quotationMark: 34, // `"`
  numberSign: 35, // `#`
  dollarSign: 36, // `$`
  percentSign: 37, // `%`
  ampersand: 38, // `&`
  apostrophe: 39, // `'`
  leftParenthesis: 40, // `(`
  rightParenthesis: 41, // `)`
  asterisk: 42, // `*`
  plusSign: 43, // `+`
  comma: 44, // `,`
  dash: 45, // `-`
  dot: 46, // `.`
  slash: 47, // `/`
  digit0: 48, // `0`
  digit1: 49, // `1`
  digit2: 50, // `2`
  digit3: 51, // `3`
  digit4: 52, // `4`
  digit5: 53, // `5`
  digit6: 54, // `6`
  digit7: 55, // `7`
  digit8: 56, // `8`
  digit9: 57, // `9`
  colon: 58, // `:`
  semicolon: 59, // `;`
  lessThan: 60, // `<`
  equalsTo: 61, // `=`
  greaterThan: 62, // `>`
  questionMark: 63, // `?`
  atSign: 64, // `@`
  uppercaseA: 65, // `A`
  uppercaseB: 66, // `B`
  uppercaseC: 67, // `C`
  uppercaseD: 68, // `D`
  uppercaseE: 69, // `E`
  uppercaseF: 70, // `F`
  uppercaseG: 71, // `G`
  uppercaseH: 72, // `H`
  uppercaseI: 73, // `I`
  uppercaseJ: 74, // `J`
  uppercaseK: 75, // `K`
  uppercaseL: 76, // `L`
  uppercaseM: 77, // `M`
  uppercaseN: 78, // `N`
  uppercaseO: 79, // `O`
  uppercaseP: 80, // `P`
  uppercaseQ: 81, // `Q`
  uppercaseR: 82, // `R`
  uppercaseS: 83, // `S`
  uppercaseT: 84, // `T`
  uppercaseU: 85, // `U`
  uppercaseV: 86, // `V`
  uppercaseW: 87, // `W`
  uppercaseX: 88, // `X`
  uppercaseY: 89, // `Y`
  uppercaseZ: 90, // `Z`
  leftSquareBracket: 91, // `[`
  backslash: 92, // `\`
  rightSquareBracket: 93, // `]`
  caret: 94, // `^`
  underscore: 95, // `_`
  graveAccent: 96, // `` ` ``
  lowercaseA: 97, // `a`
  lowercaseB: 98, // `b`
  lowercaseC: 99, // `c`
  lowercaseD: 100, // `d`
  lowercaseE: 101, // `e`
  lowercaseF: 102, // `f`
  lowercaseG: 103, // `g`
  lowercaseH: 104, // `h`
  lowercaseI: 105, // `i`
  lowercaseJ: 106, // `j`
  lowercaseK: 107, // `k`
  lowercaseL: 108, // `l`
  lowercaseM: 109, // `m`
  lowercaseN: 110, // `n`
  lowercaseO: 111, // `o`
  lowercaseP: 112, // `p`
  lowercaseQ: 113, // `q`
  lowercaseR: 114, // `r`
  lowercaseS: 115, // `s`
  lowercaseT: 116, // `t`
  lowercaseU: 117, // `u`
  lowercaseV: 118, // `v`
  lowercaseW: 119, // `w`
  lowercaseX: 120, // `x`
  lowercaseY: 121, // `y`
  lowercaseZ: 122, // `z`
  leftCurlyBrace: 123, // `{`
  verticalBar: 124, // `|`
  rightCurlyBrace: 125, // `}`
  tilde: 126, // `~`
  del: 127,
  // Unicode Specials block.
  byteOrderMarker: 65279,
  // Unicode Specials block.
  replacementCharacter: 65533 // `�`
});

// This module is generated by `script/`.
//
// CommonMark handles attention (emphasis, strong) markers based on what comes
// before or after them.
// One such difference is if those characters are Unicode punctuation.
// This script is generated from the Unicode data.

/**
 * Regular expression that matches a unicode punctuation character.
 */
const unicodePunctuationRegex =
  /[!-/:-@[-`{-~\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/;

/**
 * @typedef {import('micromark-util-types').Code} Code
 */


/**
 * Check whether the character code represents an ASCII alpha (`a` through `z`,
 * case insensitive).
 *
 * An **ASCII alpha** is an ASCII upper alpha or ASCII lower alpha.
 *
 * An **ASCII upper alpha** is a character in the inclusive range U+0041 (`A`)
 * to U+005A (`Z`).
 *
 * An **ASCII lower alpha** is a character in the inclusive range U+0061 (`a`)
 * to U+007A (`z`).
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const asciiAlpha = regexCheck(/[A-Za-z]/);

/**
 * Check whether the character code represents an ASCII alphanumeric (`a`
 * through `z`, case insensitive, or `0` through `9`).
 *
 * An **ASCII alphanumeric** is an ASCII digit (see `asciiDigit`) or ASCII alpha
 * (see `asciiAlpha`).
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);

/**
 * Check whether the character code represents an ASCII atext.
 *
 * atext is an ASCII alphanumeric (see `asciiAlphanumeric`), or a character in
 * the inclusive ranges U+0023 NUMBER SIGN (`#`) to U+0027 APOSTROPHE (`'`),
 * U+002A ASTERISK (`*`), U+002B PLUS SIGN (`+`), U+002D DASH (`-`), U+002F
 * SLASH (`/`), U+003D EQUALS TO (`=`), U+003F QUESTION MARK (`?`), U+005E
 * CARET (`^`) to U+0060 GRAVE ACCENT (`` ` ``), or U+007B LEFT CURLY BRACE
 * (`{`) to U+007E TILDE (`~`).
 *
 * See:
 * **\[RFC5322]**:
 * [Internet Message Format](https://tools.ietf.org/html/rfc5322).
 * P. Resnick.
 * IETF.
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);

/**
 * Check whether a character code is an ASCII control character.
 *
 * An **ASCII control** is a character in the inclusive range U+0000 NULL (NUL)
 * to U+001F (US), or U+007F (DEL).
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function asciiControl(code) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    code !== null && (code < codes.space || code === codes.del)
  )
}

/**
 * Check whether the character code represents an ASCII digit (`0` through `9`).
 *
 * An **ASCII digit** is a character in the inclusive range U+0030 (`0`) to
 * U+0039 (`9`).
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const asciiDigit = regexCheck(/\d/);

/**
 * Check whether the character code represents an ASCII hex digit (`a` through
 * `f`, case insensitive, or `0` through `9`).
 *
 * An **ASCII hex digit** is an ASCII digit (see `asciiDigit`), ASCII upper hex
 * digit, or an ASCII lower hex digit.
 *
 * An **ASCII upper hex digit** is a character in the inclusive range U+0041
 * (`A`) to U+0046 (`F`).
 *
 * An **ASCII lower hex digit** is a character in the inclusive range U+0061
 * (`a`) to U+0066 (`f`).
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const asciiHexDigit = regexCheck(/[\dA-Fa-f]/);

/**
 * Check whether the character code represents ASCII punctuation.
 *
 * An **ASCII punctuation** is a character in the inclusive ranges U+0021
 * EXCLAMATION MARK (`!`) to U+002F SLASH (`/`), U+003A COLON (`:`) to U+0040 AT
 * SIGN (`@`), U+005B LEFT SQUARE BRACKET (`[`) to U+0060 GRAVE ACCENT
 * (`` ` ``), or U+007B LEFT CURLY BRACE (`{`) to U+007E TILDE (`~`).
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);

/**
 * Check whether a character code is a markdown line ending.
 *
 * A **markdown line ending** is the virtual characters M-0003 CARRIAGE RETURN
 * LINE FEED (CRLF), M-0004 LINE FEED (LF) and M-0005 CARRIAGE RETURN (CR).
 *
 * In micromark, the actual character U+000A LINE FEED (LF) and U+000D CARRIAGE
 * RETURN (CR) are replaced by these virtual characters depending on whether
 * they occurred together.
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function markdownLineEnding(code) {
  return code !== null && code < codes.horizontalTab
}

/**
 * Check whether a character code is a markdown line ending (see
 * `markdownLineEnding`) or markdown space (see `markdownSpace`).
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function markdownLineEndingOrSpace(code) {
  return code !== null && (code < codes.nul || code === codes.space)
}

/**
 * Check whether a character code is a markdown space.
 *
 * A **markdown space** is the concrete character U+0020 SPACE (SP) and the
 * virtual characters M-0001 VIRTUAL SPACE (VS) and M-0002 HORIZONTAL TAB (HT).
 *
 * In micromark, the actual character U+0009 CHARACTER TABULATION (HT) is
 * replaced by one M-0002 HORIZONTAL TAB (HT) and between 0 and 3 M-0001 VIRTUAL
 * SPACE (VS) characters, depending on the column at which the tab occurred.
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function markdownSpace(code) {
  return (
    code === codes.horizontalTab ||
    code === codes.virtualSpace ||
    code === codes.space
  )
}

// Size note: removing ASCII from the regex and using `asciiPunctuation` here
// In fact adds to the bundle size.
/**
 * Check whether the character code represents Unicode punctuation.
 *
 * A **Unicode punctuation** is a character in the Unicode `Pc` (Punctuation,
 * Connector), `Pd` (Punctuation, Dash), `Pe` (Punctuation, Close), `Pf`
 * (Punctuation, Final quote), `Pi` (Punctuation, Initial quote), `Po`
 * (Punctuation, Other), or `Ps` (Punctuation, Open) categories, or an ASCII
 * punctuation (see `asciiPunctuation`).
 *
 * See:
 * **\[UNICODE]**:
 * [The Unicode Standard](https://www.unicode.org/versions/).
 * Unicode Consortium.
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const unicodePunctuation = regexCheck(unicodePunctuationRegex);

/**
 * Check whether the character code represents Unicode whitespace.
 *
 * Note that this does handle micromark specific markdown whitespace characters.
 * See `markdownLineEndingOrSpace` to check that.
 *
 * A **Unicode whitespace** is a character in the Unicode `Zs` (Separator,
 * Space) category, or U+0009 CHARACTER TABULATION (HT), U+000A LINE FEED (LF),
 * U+000C (FF), or U+000D CARRIAGE RETURN (CR) (**\[UNICODE]**).
 *
 * See:
 * **\[UNICODE]**:
 * [The Unicode Standard](https://www.unicode.org/versions/).
 * Unicode Consortium.
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const unicodeWhitespace = regexCheck(/\s/);

/**
 * Create a code check from a regex.
 *
 * @param {RegExp} regex
 * @returns {(code: Code) => boolean}
 */
function regexCheck(regex) {
  return check

  /**
   * Check whether a code matches the bound regex.
   *
   * @param {Code} code
   *   Character code.
   * @returns {boolean}
   *   Whether the character code matches the bound regex.
   */
  function check(code) {
    return code !== null && regex.test(String.fromCharCode(code))
  }
}

/**
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenType} TokenType
 */


// To do: implement `spaceOrTab`, `spaceOrTabMinMax`, `spaceOrTabWithOptions`.

/**
 * Parse spaces and tabs.
 *
 * There is no `nok` parameter:
 *
 * *   spaces in markdown are often optional, in which case this factory can be
 *     used and `ok` will be switched to whether spaces were found or not
 * *   one line ending or space can be detected with `markdownSpace(code)` right
 *     before using `factorySpace`
 *
 * ###### Examples
 *
 * Where `␉` represents a tab (plus how much it expands) and `␠` represents a
 * single space.
 *
 * ```markdown
 * ␉
 * ␠␠␠␠
 * ␉␠
 * ```
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {TokenType} type
 *   Type (`' \t'`).
 * @param {number | undefined} [max=Infinity]
 *   Max (exclusive).
 * @returns
 *   Start state.
 */
function factorySpace(effects, ok, type, max) {
  const limit = max ? max - 1 : Number.POSITIVE_INFINITY;
  let size = 0;

  return start

  /** @type {State} */
  function start(code) {
    if (markdownSpace(code)) {
      effects.enter(type);
      return prefix(code)
    }

    return ok(code)
  }

  /** @type {State} */
  function prefix(code) {
    if (markdownSpace(code) && size++ < limit) {
      effects.consume(code);
      return prefix
    }

    effects.exit(type);
    return ok(code)
  }
}

/**
 * This module is compiled away!
 *
 * Here is the list of all types of tokens exposed by micromark, with a short
 * explanation of what they include and where they are found.
 * In picking names, generally, the rule is to be as explicit as possible
 * instead of reusing names.
 * For example, there is a `definitionDestination` and a `resourceDestination`,
 * instead of one shared name.
 */

// Note: when changing the next record, you must also change `TokenTypeMap`
// in `micromark-util-types/index.d.ts`.
const types = /** @type {const} */ ({
  // Generic type for data, such as in a title, a destination, etc.
  data: 'data',

  // Generic type for syntactic whitespace (tabs, virtual spaces, spaces).
  // Such as, between a fenced code fence and an info string.
  whitespace: 'whitespace',

  // Generic type for line endings (line feed, carriage return, carriage return +
  // line feed).
  lineEnding: 'lineEnding',

  // A line ending, but ending a blank line.
  lineEndingBlank: 'lineEndingBlank',

  // Generic type for whitespace (tabs, virtual spaces, spaces) at the start of a
  // line.
  linePrefix: 'linePrefix',

  // Generic type for whitespace (tabs, virtual spaces, spaces) at the end of a
  // line.
  lineSuffix: 'lineSuffix',

  // Whole ATX heading:
  //
  // ```markdown
  // #
  // ## Alpha
  // ### Bravo ###
  // ```
  //
  // Includes `atxHeadingSequence`, `whitespace`, `atxHeadingText`.
  atxHeading: 'atxHeading',

  // Sequence of number signs in an ATX heading (`###`).
  atxHeadingSequence: 'atxHeadingSequence',

  // Content in an ATX heading (`alpha`).
  // Includes text.
  atxHeadingText: 'atxHeadingText',

  // Whole autolink (`<https://example.com>` or `<admin@example.com>`)
  // Includes `autolinkMarker` and `autolinkProtocol` or `autolinkEmail`.
  autolink: 'autolink',

  // Email autolink w/o markers (`admin@example.com`)
  autolinkEmail: 'autolinkEmail',

  // Marker around an `autolinkProtocol` or `autolinkEmail` (`<` or `>`).
  autolinkMarker: 'autolinkMarker',

  // Protocol autolink w/o markers (`https://example.com`)
  autolinkProtocol: 'autolinkProtocol',

  // A whole character escape (`\-`).
  // Includes `escapeMarker` and `characterEscapeValue`.
  characterEscape: 'characterEscape',

  // The escaped character (`-`).
  characterEscapeValue: 'characterEscapeValue',

  // A whole character reference (`&amp;`, `&#8800;`, or `&#x1D306;`).
  // Includes `characterReferenceMarker`, an optional
  // `characterReferenceMarkerNumeric`, in which case an optional
  // `characterReferenceMarkerHexadecimal`, and a `characterReferenceValue`.
  characterReference: 'characterReference',

  // The start or end marker (`&` or `;`).
  characterReferenceMarker: 'characterReferenceMarker',

  // Mark reference as numeric (`#`).
  characterReferenceMarkerNumeric: 'characterReferenceMarkerNumeric',

  // Mark reference as numeric (`x` or `X`).
  characterReferenceMarkerHexadecimal: 'characterReferenceMarkerHexadecimal',

  // Value of character reference w/o markers (`amp`, `8800`, or `1D306`).
  characterReferenceValue: 'characterReferenceValue',

  // Whole fenced code:
  //
  // ````markdown
  // ```js
  // alert(1)
  // ```
  // ````
  codeFenced: 'codeFenced',

  // A fenced code fence, including whitespace, sequence, info, and meta
  // (` ```js `).
  codeFencedFence: 'codeFencedFence',

  // Sequence of grave accent or tilde characters (` ``` `) in a fence.
  codeFencedFenceSequence: 'codeFencedFenceSequence',

  // Info word (`js`) in a fence.
  // Includes string.
  codeFencedFenceInfo: 'codeFencedFenceInfo',

  // Meta words (`highlight="1"`) in a fence.
  // Includes string.
  codeFencedFenceMeta: 'codeFencedFenceMeta',

  // A line of code.
  codeFlowValue: 'codeFlowValue',

  // Whole indented code:
  //
  // ```markdown
  //     alert(1)
  // ```
  //
  // Includes `lineEnding`, `linePrefix`, and `codeFlowValue`.
  codeIndented: 'codeIndented',

  // A text code (``` `alpha` ```).
  // Includes `codeTextSequence`, `codeTextData`, `lineEnding`, and can include
  // `codeTextPadding`.
  codeText: 'codeText',

  codeTextData: 'codeTextData',

  // A space or line ending right after or before a tick.
  codeTextPadding: 'codeTextPadding',

  // A text code fence (` `` `).
  codeTextSequence: 'codeTextSequence',

  // Whole content:
  //
  // ```markdown
  // [a]: b
  // c
  // =
  // d
  // ```
  //
  // Includes `paragraph` and `definition`.
  content: 'content',
  // Whole definition:
  //
  // ```markdown
  // [micromark]: https://github.com/micromark/micromark
  // ```
  //
  // Includes `definitionLabel`, `definitionMarker`, `whitespace`,
  // `definitionDestination`, and optionally `lineEnding` and `definitionTitle`.
  definition: 'definition',

  // Destination of a definition (`https://github.com/micromark/micromark` or
  // `<https://github.com/micromark/micromark>`).
  // Includes `definitionDestinationLiteral` or `definitionDestinationRaw`.
  definitionDestination: 'definitionDestination',

  // Enclosed destination of a definition
  // (`<https://github.com/micromark/micromark>`).
  // Includes `definitionDestinationLiteralMarker` and optionally
  // `definitionDestinationString`.
  definitionDestinationLiteral: 'definitionDestinationLiteral',

  // Markers of an enclosed definition destination (`<` or `>`).
  definitionDestinationLiteralMarker: 'definitionDestinationLiteralMarker',

  // Unenclosed destination of a definition
  // (`https://github.com/micromark/micromark`).
  // Includes `definitionDestinationString`.
  definitionDestinationRaw: 'definitionDestinationRaw',

  // Text in an destination (`https://github.com/micromark/micromark`).
  // Includes string.
  definitionDestinationString: 'definitionDestinationString',

  // Label of a definition (`[micromark]`).
  // Includes `definitionLabelMarker` and `definitionLabelString`.
  definitionLabel: 'definitionLabel',

  // Markers of a definition label (`[` or `]`).
  definitionLabelMarker: 'definitionLabelMarker',

  // Value of a definition label (`micromark`).
  // Includes string.
  definitionLabelString: 'definitionLabelString',

  // Marker between a label and a destination (`:`).
  definitionMarker: 'definitionMarker',

  // Title of a definition (`"x"`, `'y'`, or `(z)`).
  // Includes `definitionTitleMarker` and optionally `definitionTitleString`.
  definitionTitle: 'definitionTitle',

  // Marker around a title of a definition (`"`, `'`, `(`, or `)`).
  definitionTitleMarker: 'definitionTitleMarker',

  // Data without markers in a title (`z`).
  // Includes string.
  definitionTitleString: 'definitionTitleString',

  // Emphasis (`*alpha*`).
  // Includes `emphasisSequence` and `emphasisText`.
  emphasis: 'emphasis',

  // Sequence of emphasis markers (`*` or `_`).
  emphasisSequence: 'emphasisSequence',

  // Emphasis text (`alpha`).
  // Includes text.
  emphasisText: 'emphasisText',

  // The character escape marker (`\`).
  escapeMarker: 'escapeMarker',

  // A hard break created with a backslash (`\\n`).
  // Note: does not include the line ending.
  hardBreakEscape: 'hardBreakEscape',

  // A hard break created with trailing spaces (`  \n`).
  // Does not include the line ending.
  hardBreakTrailing: 'hardBreakTrailing',

  // Flow HTML:
  //
  // ```markdown
  // <div
  // ```
  //
  // Inlcudes `lineEnding`, `htmlFlowData`.
  htmlFlow: 'htmlFlow',

  htmlFlowData: 'htmlFlowData',

  // HTML in text (the tag in `a <i> b`).
  // Includes `lineEnding`, `htmlTextData`.
  htmlText: 'htmlText',

  htmlTextData: 'htmlTextData',

  // Whole image (`![alpha](bravo)`, `![alpha][bravo]`, `![alpha][]`, or
  // `![alpha]`).
  // Includes `label` and an optional `resource` or `reference`.
  image: 'image',

  // Whole link label (`[*alpha*]`).
  // Includes `labelLink` or `labelImage`, `labelText`, and `labelEnd`.
  label: 'label',

  // Text in an label (`*alpha*`).
  // Includes text.
  labelText: 'labelText',

  // Start a link label (`[`).
  // Includes a `labelMarker`.
  labelLink: 'labelLink',

  // Start an image label (`![`).
  // Includes `labelImageMarker` and `labelMarker`.
  labelImage: 'labelImage',

  // Marker of a label (`[` or `]`).
  labelMarker: 'labelMarker',

  // Marker to start an image (`!`).
  labelImageMarker: 'labelImageMarker',

  // End a label (`]`).
  // Includes `labelMarker`.
  labelEnd: 'labelEnd',

  // Whole link (`[alpha](bravo)`, `[alpha][bravo]`, `[alpha][]`, or `[alpha]`).
  // Includes `label` and an optional `resource` or `reference`.
  link: 'link',

  // Whole paragraph:
  //
  // ```markdown
  // alpha
  // bravo.
  // ```
  //
  // Includes text.
  paragraph: 'paragraph',

  // A reference (`[alpha]` or `[]`).
  // Includes `referenceMarker` and an optional `referenceString`.
  reference: 'reference',

  // A reference marker (`[` or `]`).
  referenceMarker: 'referenceMarker',

  // Reference text (`alpha`).
  // Includes string.
  referenceString: 'referenceString',

  // A resource (`(https://example.com "alpha")`).
  // Includes `resourceMarker`, an optional `resourceDestination` with an optional
  // `whitespace` and `resourceTitle`.
  resource: 'resource',

  // A resource destination (`https://example.com`).
  // Includes `resourceDestinationLiteral` or `resourceDestinationRaw`.
  resourceDestination: 'resourceDestination',

  // A literal resource destination (`<https://example.com>`).
  // Includes `resourceDestinationLiteralMarker` and optionally
  // `resourceDestinationString`.
  resourceDestinationLiteral: 'resourceDestinationLiteral',

  // A resource destination marker (`<` or `>`).
  resourceDestinationLiteralMarker: 'resourceDestinationLiteralMarker',

  // A raw resource destination (`https://example.com`).
  // Includes `resourceDestinationString`.
  resourceDestinationRaw: 'resourceDestinationRaw',

  // Resource destination text (`https://example.com`).
  // Includes string.
  resourceDestinationString: 'resourceDestinationString',

  // A resource marker (`(` or `)`).
  resourceMarker: 'resourceMarker',

  // A resource title (`"alpha"`, `'alpha'`, or `(alpha)`).
  // Includes `resourceTitleMarker` and optionally `resourceTitleString`.
  resourceTitle: 'resourceTitle',

  // A resource title marker (`"`, `'`, `(`, or `)`).
  resourceTitleMarker: 'resourceTitleMarker',

  // Resource destination title (`alpha`).
  // Includes string.
  resourceTitleString: 'resourceTitleString',

  // Whole setext heading:
  //
  // ```markdown
  // alpha
  // bravo
  // =====
  // ```
  //
  // Includes `setextHeadingText`, `lineEnding`, `linePrefix`, and
  // `setextHeadingLine`.
  setextHeading: 'setextHeading',

  // Content in a setext heading (`alpha\nbravo`).
  // Includes text.
  setextHeadingText: 'setextHeadingText',

  // Underline in a setext heading, including whitespace suffix (`==`).
  // Includes `setextHeadingLineSequence`.
  setextHeadingLine: 'setextHeadingLine',

  // Sequence of equals or dash characters in underline in a setext heading (`-`).
  setextHeadingLineSequence: 'setextHeadingLineSequence',

  // Strong (`**alpha**`).
  // Includes `strongSequence` and `strongText`.
  strong: 'strong',

  // Sequence of strong markers (`**` or `__`).
  strongSequence: 'strongSequence',

  // Strong text (`alpha`).
  // Includes text.
  strongText: 'strongText',

  // Whole thematic break:
  //
  // ```markdown
  // * * *
  // ```
  //
  // Includes `thematicBreakSequence` and `whitespace`.
  thematicBreak: 'thematicBreak',

  // A sequence of one or more thematic break markers (`***`).
  thematicBreakSequence: 'thematicBreakSequence',

  // Whole block quote:
  //
  // ```markdown
  // > a
  // >
  // > b
  // ```
  //
  // Includes `blockQuotePrefix` and flow.
  blockQuote: 'blockQuote',
  // The `>` or `> ` of a block quote.
  blockQuotePrefix: 'blockQuotePrefix',
  // The `>` of a block quote prefix.
  blockQuoteMarker: 'blockQuoteMarker',
  // The optional ` ` of a block quote prefix.
  blockQuotePrefixWhitespace: 'blockQuotePrefixWhitespace',

  // Whole unordered list:
  //
  // ```markdown
  // - a
  //   b
  // ```
  //
  // Includes `listItemPrefix`, flow, and optionally  `listItemIndent` on further
  // lines.
  listOrdered: 'listOrdered',

  // Whole ordered list:
  //
  // ```markdown
  // 1. a
  //    b
  // ```
  //
  // Includes `listItemPrefix`, flow, and optionally  `listItemIndent` on further
  // lines.
  listUnordered: 'listUnordered',

  // The indent of further list item lines.
  listItemIndent: 'listItemIndent',

  // A marker, as in, `*`, `+`, `-`, `.`, or `)`.
  listItemMarker: 'listItemMarker',

  // The thing that starts a list item, such as `1. `.
  // Includes `listItemValue` if ordered, `listItemMarker`, and
  // `listItemPrefixWhitespace` (unless followed by a line ending).
  listItemPrefix: 'listItemPrefix',

  // The whitespace after a marker.
  listItemPrefixWhitespace: 'listItemPrefixWhitespace',

  // The numerical value of an ordered item.
  listItemValue: 'listItemValue',

  // Internal types used for subtokenizers, compiled away
  chunkDocument: 'chunkDocument',
  chunkContent: 'chunkContent',
  chunkFlow: 'chunkFlow',
  chunkText: 'chunkText',
  chunkString: 'chunkString'
});

/**
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').Initializer} Initializer
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 */


/** @type {InitialConstruct} */
const content$1 = {tokenize: initializeContent};

/**
 * @this {TokenizeContext}
 * @type {Initializer}
 */
function initializeContent(effects) {
  const contentStart = effects.attempt(
    this.parser.constructs.contentInitial,
    afterContentStartConstruct,
    paragraphInitial
  );
  /** @type {Token} */
  let previous;

  return contentStart

  /** @type {State} */
  function afterContentStartConstruct(code) {
    ok(
      code === codes.eof || markdownLineEnding(code),
      'expected eol or eof'
    );

    if (code === codes.eof) {
      effects.consume(code);
      return
    }

    effects.enter(types.lineEnding);
    effects.consume(code);
    effects.exit(types.lineEnding);
    return factorySpace(effects, contentStart, types.linePrefix)
  }

  /** @type {State} */
  function paragraphInitial(code) {
    ok(
      code !== codes.eof && !markdownLineEnding(code),
      'expected anything other than a line ending or EOF'
    );
    effects.enter(types.paragraph);
    return lineStart(code)
  }

  /** @type {State} */
  function lineStart(code) {
    const token = effects.enter(types.chunkText, {
      contentType: constants.contentTypeText,
      previous
    });

    if (previous) {
      previous.next = token;
    }

    previous = token;

    return data(code)
  }

  /** @type {State} */
  function data(code) {
    if (code === codes.eof) {
      effects.exit(types.chunkText);
      effects.exit(types.paragraph);
      effects.consume(code);
      return
    }

    if (markdownLineEnding(code)) {
      effects.consume(code);
      effects.exit(types.chunkText);
      return lineStart
    }

    // Data.
    effects.consume(code);
    return data
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').ContainerState} ContainerState
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').Initializer} Initializer
 * @typedef {import('micromark-util-types').Point} Point
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {InitialConstruct} */
const document$2 = {tokenize: initializeDocument};

/** @type {Construct} */
const containerConstruct = {tokenize: tokenizeContainer};

/**
 * @this {TokenizeContext}
 * @type {Initializer}
 */
function initializeDocument(effects) {
  const self = this;
  /** @type {Array<StackItem>} */
  const stack = [];
  let continued = 0;
  /** @type {TokenizeContext | undefined} */
  let childFlow;
  /** @type {Token | undefined} */
  let childToken;
  /** @type {number} */
  let lineStartOffset;

  return start

  /** @type {State} */
  function start(code) {
    // First we iterate through the open blocks, starting with the root
    // document, and descending through last children down to the last open
    // block.
    // Each block imposes a condition that the line must satisfy if the block is
    // to remain open.
    // For example, a block quote requires a `>` character.
    // A paragraph requires a non-blank line.
    // In this phase we may match all or just some of the open blocks.
    // But we cannot close unmatched blocks yet, because we may have a lazy
    // continuation line.
    if (continued < stack.length) {
      const item = stack[continued];
      self.containerState = item[1];
      ok(
        item[0].continuation,
        'expected `continuation` to be defined on container construct'
      );
      return effects.attempt(
        item[0].continuation,
        documentContinue,
        checkNewContainers
      )(code)
    }

    // Done.
    return checkNewContainers(code)
  }

  /** @type {State} */
  function documentContinue(code) {
    ok(
      self.containerState,
      'expected `containerState` to be defined after continuation'
    );

    continued++;

    // Note: this field is called `_closeFlow` but it also closes containers.
    // Perhaps a good idea to rename it but it’s already used in the wild by
    // extensions.
    if (self.containerState._closeFlow) {
      self.containerState._closeFlow = undefined;

      if (childFlow) {
        closeFlow();
      }

      // Note: this algorithm for moving events around is similar to the
      // algorithm when dealing with lazy lines in `writeToChild`.
      const indexBeforeExits = self.events.length;
      let indexBeforeFlow = indexBeforeExits;
      /** @type {Point | undefined} */
      let point;

      // Find the flow chunk.
      while (indexBeforeFlow--) {
        if (
          self.events[indexBeforeFlow][0] === 'exit' &&
          self.events[indexBeforeFlow][1].type === types.chunkFlow
        ) {
          point = self.events[indexBeforeFlow][1].end;
          break
        }
      }

      ok(point, 'could not find previous flow chunk');

      exitContainers(continued);

      // Fix positions.
      let index = indexBeforeExits;

      while (index < self.events.length) {
        self.events[index][1].end = Object.assign({}, point);
        index++;
      }

      // Inject the exits earlier (they’re still also at the end).
      splice(
        self.events,
        indexBeforeFlow + 1,
        0,
        self.events.slice(indexBeforeExits)
      );

      // Discard the duplicate exits.
      self.events.length = index;

      return checkNewContainers(code)
    }

    return start(code)
  }

  /** @type {State} */
  function checkNewContainers(code) {
    // Next, after consuming the continuation markers for existing blocks, we
    // look for new block starts (e.g. `>` for a block quote).
    // If we encounter a new block start, we close any blocks unmatched in
    // step 1 before creating the new block as a child of the last matched
    // block.
    if (continued === stack.length) {
      // No need to `check` whether there’s a container, of `exitContainers`
      // would be moot.
      // We can instead immediately `attempt` to parse one.
      if (!childFlow) {
        return documentContinued(code)
      }

      // If we have concrete content, such as block HTML or fenced code,
      // we can’t have containers “pierce” into them, so we can immediately
      // start.
      if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) {
        return flowStart(code)
      }

      // If we do have flow, it could still be a blank line,
      // but we’d be interrupting it w/ a new container if there’s a current
      // construct.
      // To do: next major: remove `_gfmTableDynamicInterruptHack` (no longer
      // needed in micromark-extension-gfm-table@1.0.6).
      self.interrupt = Boolean(
        childFlow.currentConstruct && !childFlow._gfmTableDynamicInterruptHack
      );
    }

    // Check if there is a new container.
    self.containerState = {};
    return effects.check(
      containerConstruct,
      thereIsANewContainer,
      thereIsNoNewContainer
    )(code)
  }

  /** @type {State} */
  function thereIsANewContainer(code) {
    if (childFlow) closeFlow();
    exitContainers(continued);
    return documentContinued(code)
  }

  /** @type {State} */
  function thereIsNoNewContainer(code) {
    self.parser.lazy[self.now().line] = continued !== stack.length;
    lineStartOffset = self.now().offset;
    return flowStart(code)
  }

  /** @type {State} */
  function documentContinued(code) {
    // Try new containers.
    self.containerState = {};
    return effects.attempt(
      containerConstruct,
      containerContinue,
      flowStart
    )(code)
  }

  /** @type {State} */
  function containerContinue(code) {
    ok(
      self.currentConstruct,
      'expected `currentConstruct` to be defined on tokenizer'
    );
    ok(
      self.containerState,
      'expected `containerState` to be defined on tokenizer'
    );
    continued++;
    stack.push([self.currentConstruct, self.containerState]);
    // Try another.
    return documentContinued(code)
  }

  /** @type {State} */
  function flowStart(code) {
    if (code === codes.eof) {
      if (childFlow) closeFlow();
      exitContainers(0);
      effects.consume(code);
      return
    }

    childFlow = childFlow || self.parser.flow(self.now());
    effects.enter(types.chunkFlow, {
      contentType: constants.contentTypeFlow,
      previous: childToken,
      _tokenizer: childFlow
    });

    return flowContinue(code)
  }

  /** @type {State} */
  function flowContinue(code) {
    if (code === codes.eof) {
      writeToChild(effects.exit(types.chunkFlow), true);
      exitContainers(0);
      effects.consume(code);
      return
    }

    if (markdownLineEnding(code)) {
      effects.consume(code);
      writeToChild(effects.exit(types.chunkFlow));
      // Get ready for the next line.
      continued = 0;
      self.interrupt = undefined;
      return start
    }

    effects.consume(code);
    return flowContinue
  }

  /**
   * @param {Token} token
   * @param {boolean | undefined} [eof]
   * @returns {void}
   */
  function writeToChild(token, eof) {
    ok(childFlow, 'expected `childFlow` to be defined when continuing');
    const stream = self.sliceStream(token);
    if (eof) stream.push(null);
    token.previous = childToken;
    if (childToken) childToken.next = token;
    childToken = token;
    childFlow.defineSkip(token.start);
    childFlow.write(stream);

    // Alright, so we just added a lazy line:
    //
    // ```markdown
    // > a
    // b.
    //
    // Or:
    //
    // > ~~~c
    // d
    //
    // Or:
    //
    // > | e |
    // f
    // ```
    //
    // The construct in the second example (fenced code) does not accept lazy
    // lines, so it marked itself as done at the end of its first line, and
    // then the content construct parses `d`.
    // Most constructs in markdown match on the first line: if the first line
    // forms a construct, a non-lazy line can’t “unmake” it.
    //
    // The construct in the third example is potentially a GFM table, and
    // those are *weird*.
    // It *could* be a table, from the first line, if the following line
    // matches a condition.
    // In this case, that second line is lazy, which “unmakes” the first line
    // and turns the whole into one content block.
    //
    // We’ve now parsed the non-lazy and the lazy line, and can figure out
    // whether the lazy line started a new flow block.
    // If it did, we exit the current containers between the two flow blocks.
    if (self.parser.lazy[token.start.line]) {
      let index = childFlow.events.length;

      while (index--) {
        if (
          // The token starts before the line ending…
          childFlow.events[index][1].start.offset < lineStartOffset &&
          // …and either is not ended yet…
          (!childFlow.events[index][1].end ||
            // …or ends after it.
            childFlow.events[index][1].end.offset > lineStartOffset)
        ) {
          // Exit: there’s still something open, which means it’s a lazy line
          // part of something.
          return
        }
      }

      // Note: this algorithm for moving events around is similar to the
      // algorithm when closing flow in `documentContinue`.
      const indexBeforeExits = self.events.length;
      let indexBeforeFlow = indexBeforeExits;
      /** @type {boolean | undefined} */
      let seen;
      /** @type {Point | undefined} */
      let point;

      // Find the previous chunk (the one before the lazy line).
      while (indexBeforeFlow--) {
        if (
          self.events[indexBeforeFlow][0] === 'exit' &&
          self.events[indexBeforeFlow][1].type === types.chunkFlow
        ) {
          if (seen) {
            point = self.events[indexBeforeFlow][1].end;
            break
          }

          seen = true;
        }
      }

      ok(point, 'could not find previous flow chunk');

      exitContainers(continued);

      // Fix positions.
      index = indexBeforeExits;

      while (index < self.events.length) {
        self.events[index][1].end = Object.assign({}, point);
        index++;
      }

      // Inject the exits earlier (they’re still also at the end).
      splice(
        self.events,
        indexBeforeFlow + 1,
        0,
        self.events.slice(indexBeforeExits)
      );

      // Discard the duplicate exits.
      self.events.length = index;
    }
  }

  /**
   * @param {number} size
   * @returns {void}
   */
  function exitContainers(size) {
    let index = stack.length;

    // Exit open containers.
    while (index-- > size) {
      const entry = stack[index];
      self.containerState = entry[1];
      ok(
        entry[0].exit,
        'expected `exit` to be defined on container construct'
      );
      entry[0].exit.call(self, effects);
    }

    stack.length = size;
  }

  function closeFlow() {
    ok(
      self.containerState,
      'expected `containerState` to be defined when closing flow'
    );
    ok(childFlow, 'expected `childFlow` to be defined when closing it');
    childFlow.write([codes.eof]);
    childToken = undefined;
    childFlow = undefined;
    self.containerState._closeFlow = undefined;
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeContainer(effects, ok$1, nok) {
  // Always populated by defaults.
  ok(
    this.parser.constructs.disable.null,
    'expected `disable.null` to be populated'
  );
  return factorySpace(
    effects,
    effects.attempt(this.parser.constructs.document, ok$1, nok),
    types.linePrefix,
    this.parser.constructs.disable.null.includes('codeIndented')
      ? undefined
      : constants.tabSize
  )
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 */


/**
 * Classify whether a code represents whitespace, punctuation, or something
 * else.
 *
 * Used for attention (emphasis, strong), whose sequences can open or close
 * based on the class of surrounding characters.
 *
 * > 👉 **Note**: eof (`null`) is seen as whitespace.
 *
 * @param {Code} code
 *   Code.
 * @returns {typeof constants.characterGroupWhitespace | typeof constants.characterGroupPunctuation | undefined}
 *   Group.
 */
function classifyCharacter(code) {
  if (
    code === codes.eof ||
    markdownLineEndingOrSpace(code) ||
    unicodeWhitespace(code)
  ) {
    return constants.characterGroupWhitespace
  }

  if (unicodePunctuation(code)) {
    return constants.characterGroupPunctuation
  }
}

/**
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 */

/**
 * Call all `resolveAll`s.
 *
 * @param {Array<{resolveAll?: Resolver | undefined}>} constructs
 *   List of constructs, optionally with `resolveAll`s.
 * @param {Array<Event>} events
 *   List of events.
 * @param {TokenizeContext} context
 *   Context used by `tokenize`.
 * @returns {Array<Event>}
 *   Changed events.
 */
function resolveAll(constructs, events, context) {
  /** @type {Array<Resolver>} */
  const called = [];
  let index = -1;

  while (++index < constructs.length) {
    const resolve = constructs[index].resolveAll;

    if (resolve && !called.includes(resolve)) {
      events = resolve(events, context);
      called.push(resolve);
    }
  }

  return events
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Point} Point
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const attention = {
  name: 'attention',
  tokenize: tokenizeAttention,
  resolveAll: resolveAllAttention
};

/**
 * Take all events and resolve attention to emphasis or strong.
 *
 * @type {Resolver}
 */
function resolveAllAttention(events, context) {
  let index = -1;
  /** @type {number} */
  let open;
  /** @type {Token} */
  let group;
  /** @type {Token} */
  let text;
  /** @type {Token} */
  let openingSequence;
  /** @type {Token} */
  let closingSequence;
  /** @type {number} */
  let use;
  /** @type {Array<Event>} */
  let nextEvents;
  /** @type {number} */
  let offset;

  // Walk through all events.
  //
  // Note: performance of this is fine on an mb of normal markdown, but it’s
  // a bottleneck for malicious stuff.
  while (++index < events.length) {
    // Find a token that can close.
    if (
      events[index][0] === 'enter' &&
      events[index][1].type === 'attentionSequence' &&
      events[index][1]._close
    ) {
      open = index;

      // Now walk back to find an opener.
      while (open--) {
        // Find a token that can open the closer.
        if (
          events[open][0] === 'exit' &&
          events[open][1].type === 'attentionSequence' &&
          events[open][1]._open &&
          // If the markers are the same:
          context.sliceSerialize(events[open][1]).charCodeAt(0) ===
            context.sliceSerialize(events[index][1]).charCodeAt(0)
        ) {
          // If the opening can close or the closing can open,
          // and the close size *is not* a multiple of three,
          // but the sum of the opening and closing size *is* multiple of three,
          // then don’t match.
          if (
            (events[open][1]._close || events[index][1]._open) &&
            (events[index][1].end.offset - events[index][1].start.offset) % 3 &&
            !(
              (events[open][1].end.offset -
                events[open][1].start.offset +
                events[index][1].end.offset -
                events[index][1].start.offset) %
              3
            )
          ) {
            continue
          }

          // Number of markers to use from the sequence.
          use =
            events[open][1].end.offset - events[open][1].start.offset > 1 &&
            events[index][1].end.offset - events[index][1].start.offset > 1
              ? 2
              : 1;

          const start = Object.assign({}, events[open][1].end);
          const end = Object.assign({}, events[index][1].start);
          movePoint(start, -use);
          movePoint(end, use);

          openingSequence = {
            type: use > 1 ? types.strongSequence : types.emphasisSequence,
            start,
            end: Object.assign({}, events[open][1].end)
          };
          closingSequence = {
            type: use > 1 ? types.strongSequence : types.emphasisSequence,
            start: Object.assign({}, events[index][1].start),
            end
          };
          text = {
            type: use > 1 ? types.strongText : types.emphasisText,
            start: Object.assign({}, events[open][1].end),
            end: Object.assign({}, events[index][1].start)
          };
          group = {
            type: use > 1 ? types.strong : types.emphasis,
            start: Object.assign({}, openingSequence.start),
            end: Object.assign({}, closingSequence.end)
          };

          events[open][1].end = Object.assign({}, openingSequence.start);
          events[index][1].start = Object.assign({}, closingSequence.end);

          nextEvents = [];

          // If there are more markers in the opening, add them before.
          if (events[open][1].end.offset - events[open][1].start.offset) {
            nextEvents = push(nextEvents, [
              ['enter', events[open][1], context],
              ['exit', events[open][1], context]
            ]);
          }

          // Opening.
          nextEvents = push(nextEvents, [
            ['enter', group, context],
            ['enter', openingSequence, context],
            ['exit', openingSequence, context],
            ['enter', text, context]
          ]);

          // Always populated by defaults.
          ok(
            context.parser.constructs.insideSpan.null,
            'expected `insideSpan` to be populated'
          );

          // Between.
          nextEvents = push(
            nextEvents,
            resolveAll(
              context.parser.constructs.insideSpan.null,
              events.slice(open + 1, index),
              context
            )
          );

          // Closing.
          nextEvents = push(nextEvents, [
            ['exit', text, context],
            ['enter', closingSequence, context],
            ['exit', closingSequence, context],
            ['exit', group, context]
          ]);

          // If there are more markers in the closing, add them after.
          if (events[index][1].end.offset - events[index][1].start.offset) {
            offset = 2;
            nextEvents = push(nextEvents, [
              ['enter', events[index][1], context],
              ['exit', events[index][1], context]
            ]);
          } else {
            offset = 0;
          }

          splice(events, open - 1, index - open + 3, nextEvents);

          index = open + nextEvents.length - offset - 2;
          break
        }
      }
    }
  }

  // Remove remaining sequences.
  index = -1;

  while (++index < events.length) {
    if (events[index][1].type === 'attentionSequence') {
      events[index][1].type = 'data';
    }
  }

  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeAttention(effects, ok$1) {
  const attentionMarkers = this.parser.constructs.attentionMarkers.null;
  const previous = this.previous;
  const before = classifyCharacter(previous);

  /** @type {NonNullable<Code>} */
  let marker;

  return start

  /**
   * Before a sequence.
   *
   * ```markdown
   * > | **
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ok(
      code === codes.asterisk || code === codes.underscore,
      'expected asterisk or underscore'
    );
    marker = code;
    effects.enter('attentionSequence');
    return inside(code)
  }

  /**
   * In a sequence.
   *
   * ```markdown
   * > | **
   *     ^^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    if (code === marker) {
      effects.consume(code);
      return inside
    }

    const token = effects.exit('attentionSequence');

    // To do: next major: move this to resolver, just like `markdown-rs`.
    const after = classifyCharacter(code);

    // Always populated by defaults.
    ok(attentionMarkers, 'expected `attentionMarkers` to be populated');

    const open =
      !after ||
      (after === constants.characterGroupPunctuation && before) ||
      attentionMarkers.includes(code);
    const close =
      !before ||
      (before === constants.characterGroupPunctuation && after) ||
      attentionMarkers.includes(previous);

    token._open = Boolean(
      marker === codes.asterisk ? open : open && (before || !close)
    );
    token._close = Boolean(
      marker === codes.asterisk ? close : close && (after || !open)
    );
    return ok$1(code)
  }
}

/**
 * Move a point a bit.
 *
 * Note: `move` only works inside lines! It’s not possible to move past other
 * chunks (replacement characters, tabs, or line endings).
 *
 * @param {Point} point
 * @param {number} offset
 * @returns {void}
 */
function movePoint(point, offset) {
  point.column += offset;
  point.offset += offset;
  point._bufferIndex += offset;
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const autolink = {name: 'autolink', tokenize: tokenizeAutolink};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeAutolink(effects, ok$1, nok) {
  let size = 0;

  return start

  /**
   * Start of an autolink.
   *
   * ```markdown
   * > | a<https://example.com>b
   *      ^
   * > | a<user@example.com>b
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ok(code === codes.lessThan, 'expected `<`');
    effects.enter(types.autolink);
    effects.enter(types.autolinkMarker);
    effects.consume(code);
    effects.exit(types.autolinkMarker);
    effects.enter(types.autolinkProtocol);
    return open
  }

  /**
   * After `<`, at protocol or atext.
   *
   * ```markdown
   * > | a<https://example.com>b
   *       ^
   * > | a<user@example.com>b
   *       ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (asciiAlpha(code)) {
      effects.consume(code);
      return schemeOrEmailAtext
    }

    return emailAtext(code)
  }

  /**
   * At second byte of protocol or atext.
   *
   * ```markdown
   * > | a<https://example.com>b
   *        ^
   * > | a<user@example.com>b
   *        ^
   * ```
   *
   * @type {State}
   */
  function schemeOrEmailAtext(code) {
    // ASCII alphanumeric and `+`, `-`, and `.`.
    if (
      code === codes.plusSign ||
      code === codes.dash ||
      code === codes.dot ||
      asciiAlphanumeric(code)
    ) {
      // Count the previous alphabetical from `open` too.
      size = 1;
      return schemeInsideOrEmailAtext(code)
    }

    return emailAtext(code)
  }

  /**
   * In ambiguous protocol or atext.
   *
   * ```markdown
   * > | a<https://example.com>b
   *        ^
   * > | a<user@example.com>b
   *        ^
   * ```
   *
   * @type {State}
   */
  function schemeInsideOrEmailAtext(code) {
    if (code === codes.colon) {
      effects.consume(code);
      size = 0;
      return urlInside
    }

    // ASCII alphanumeric and `+`, `-`, and `.`.
    if (
      (code === codes.plusSign ||
        code === codes.dash ||
        code === codes.dot ||
        asciiAlphanumeric(code)) &&
      size++ < constants.autolinkSchemeSizeMax
    ) {
      effects.consume(code);
      return schemeInsideOrEmailAtext
    }

    size = 0;
    return emailAtext(code)
  }

  /**
   * After protocol, in URL.
   *
   * ```markdown
   * > | a<https://example.com>b
   *             ^
   * ```
   *
   * @type {State}
   */
  function urlInside(code) {
    if (code === codes.greaterThan) {
      effects.exit(types.autolinkProtocol);
      effects.enter(types.autolinkMarker);
      effects.consume(code);
      effects.exit(types.autolinkMarker);
      effects.exit(types.autolink);
      return ok$1
    }

    // ASCII control, space, or `<`.
    if (
      code === codes.eof ||
      code === codes.space ||
      code === codes.lessThan ||
      asciiControl(code)
    ) {
      return nok(code)
    }

    effects.consume(code);
    return urlInside
  }

  /**
   * In email atext.
   *
   * ```markdown
   * > | a<user.name@example.com>b
   *              ^
   * ```
   *
   * @type {State}
   */
  function emailAtext(code) {
    if (code === codes.atSign) {
      effects.consume(code);
      return emailAtSignOrDot
    }

    if (asciiAtext(code)) {
      effects.consume(code);
      return emailAtext
    }

    return nok(code)
  }

  /**
   * In label, after at-sign or dot.
   *
   * ```markdown
   * > | a<user.name@example.com>b
   *                 ^       ^
   * ```
   *
   * @type {State}
   */
  function emailAtSignOrDot(code) {
    return asciiAlphanumeric(code) ? emailLabel(code) : nok(code)
  }

  /**
   * In label, where `.` and `>` are allowed.
   *
   * ```markdown
   * > | a<user.name@example.com>b
   *                   ^
   * ```
   *
   * @type {State}
   */
  function emailLabel(code) {
    if (code === codes.dot) {
      effects.consume(code);
      size = 0;
      return emailAtSignOrDot
    }

    if (code === codes.greaterThan) {
      // Exit, then change the token type.
      effects.exit(types.autolinkProtocol).type = types.autolinkEmail;
      effects.enter(types.autolinkMarker);
      effects.consume(code);
      effects.exit(types.autolinkMarker);
      effects.exit(types.autolink);
      return ok$1
    }

    return emailValue(code)
  }

  /**
   * In label, where `.` and `>` are *not* allowed.
   *
   * Though, this is also used in `emailLabel` to parse other values.
   *
   * ```markdown
   * > | a<user.name@ex-ample.com>b
   *                    ^
   * ```
   *
   * @type {State}
   */
  function emailValue(code) {
    // ASCII alphanumeric or `-`.
    if (
      (code === codes.dash || asciiAlphanumeric(code)) &&
      size++ < constants.autolinkDomainSizeMax
    ) {
      const next = code === codes.dash ? emailValue : emailLabel;
      effects.consume(code);
      return next
    }

    return nok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const blankLine = {tokenize: tokenizeBlankLine, partial: true};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeBlankLine(effects, ok, nok) {
  return start

  /**
   * Start of blank line.
   *
   * > 👉 **Note**: `␠` represents a space character.
   *
   * ```markdown
   * > | ␠␠␊
   *     ^
   * > | ␊
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    return markdownSpace(code)
      ? factorySpace(effects, after, types.linePrefix)(code)
      : after(code)
  }

  /**
   * At eof/eol, after optional whitespace.
   *
   * > 👉 **Note**: `␠` represents a space character.
   *
   * ```markdown
   * > | ␠␠␊
   *       ^
   * > | ␊
   *     ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    return code === codes.eof || markdownLineEnding(code) ? ok(code) : nok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Exiter} Exiter
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const blockQuote = {
  name: 'blockQuote',
  tokenize: tokenizeBlockQuoteStart,
  continuation: {tokenize: tokenizeBlockQuoteContinuation},
  exit
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeBlockQuoteStart(effects, ok$1, nok) {
  const self = this;

  return start

  /**
   * Start of block quote.
   *
   * ```markdown
   * > | > a
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (code === codes.greaterThan) {
      const state = self.containerState;

      ok(state, 'expected `containerState` to be defined in container');

      if (!state.open) {
        effects.enter(types.blockQuote, {_container: true});
        state.open = true;
      }

      effects.enter(types.blockQuotePrefix);
      effects.enter(types.blockQuoteMarker);
      effects.consume(code);
      effects.exit(types.blockQuoteMarker);
      return after
    }

    return nok(code)
  }

  /**
   * After `>`, before optional whitespace.
   *
   * ```markdown
   * > | > a
   *      ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    if (markdownSpace(code)) {
      effects.enter(types.blockQuotePrefixWhitespace);
      effects.consume(code);
      effects.exit(types.blockQuotePrefixWhitespace);
      effects.exit(types.blockQuotePrefix);
      return ok$1
    }

    effects.exit(types.blockQuotePrefix);
    return ok$1(code)
  }
}

/**
 * Start of block quote continuation.
 *
 * ```markdown
 *   | > a
 * > | > b
 *     ^
 * ```
 *
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeBlockQuoteContinuation(effects, ok$1, nok) {
  const self = this;

  return contStart

  /**
   * Start of block quote continuation.
   *
   * Also used to parse the first block quote opening.
   *
   * ```markdown
   *   | > a
   * > | > b
   *     ^
   * ```
   *
   * @type {State}
   */
  function contStart(code) {
    if (markdownSpace(code)) {
      // Always populated by defaults.
      ok(
        self.parser.constructs.disable.null,
        'expected `disable.null` to be populated'
      );

      return factorySpace(
        effects,
        contBefore,
        types.linePrefix,
        self.parser.constructs.disable.null.includes('codeIndented')
          ? undefined
          : constants.tabSize
      )(code)
    }

    return contBefore(code)
  }

  /**
   * At `>`, after optional whitespace.
   *
   * Also used to parse the first block quote opening.
   *
   * ```markdown
   *   | > a
   * > | > b
   *     ^
   * ```
   *
   * @type {State}
   */
  function contBefore(code) {
    return effects.attempt(blockQuote, ok$1, nok)(code)
  }
}

/** @type {Exiter} */
function exit(effects) {
  effects.exit(types.blockQuote);
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const characterEscape = {
  name: 'characterEscape',
  tokenize: tokenizeCharacterEscape
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCharacterEscape(effects, ok$1, nok) {
  return start

  /**
   * Start of character escape.
   *
   * ```markdown
   * > | a\*b
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ok(code === codes.backslash, 'expected `\\`');
    effects.enter(types.characterEscape);
    effects.enter(types.escapeMarker);
    effects.consume(code);
    effects.exit(types.escapeMarker);
    return inside
  }

  /**
   * After `\`, at punctuation.
   *
   * ```markdown
   * > | a\*b
   *       ^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    // ASCII punctuation.
    if (asciiPunctuation(code)) {
      effects.enter(types.characterEscapeValue);
      effects.consume(code);
      effects.exit(types.characterEscapeValue);
      effects.exit(types.characterEscape);
      return ok$1
    }

    return nok(code)
  }
}

/// <reference lib="dom" />

/* eslint-env browser */

const element = document.createElement('i');

/**
 * @param {string} value
 * @returns {string|false}
 */
function decodeNamedCharacterReference(value) {
  const characterReference = '&' + value + ';';
  element.innerHTML = characterReference;
  const char = element.textContent;

  // Some named character references do not require the closing semicolon
  // (`&not`, for instance), which leads to situations where parsing the assumed
  // named reference of `&notit;` will result in the string `¬it;`.
  // When we encounter a trailing semicolon after parsing, and the character
  // reference to decode was not a semicolon (`&semi;`), we can assume that the
  // matching was not complete.
  // @ts-expect-error: TypeScript is wrong that `textContent` on elements can
  // yield `null`.
  if (char.charCodeAt(char.length - 1) === 59 /* `;` */ && value !== 'semi') {
    return false
  }

  // If the decoded string is equal to the input, the character reference was
  // not valid.
  // @ts-expect-error: TypeScript is wrong that `textContent` on elements can
  // yield `null`.
  return char === characterReference ? false : char
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const characterReference = {
  name: 'characterReference',
  tokenize: tokenizeCharacterReference
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCharacterReference(effects, ok$1, nok) {
  const self = this;
  let size = 0;
  /** @type {number} */
  let max;
  /** @type {(code: Code) => boolean} */
  let test;

  return start

  /**
   * Start of character reference.
   *
   * ```markdown
   * > | a&amp;b
   *      ^
   * > | a&#123;b
   *      ^
   * > | a&#x9;b
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ok(code === codes.ampersand, 'expected `&`');
    effects.enter(types.characterReference);
    effects.enter(types.characterReferenceMarker);
    effects.consume(code);
    effects.exit(types.characterReferenceMarker);
    return open
  }

  /**
   * After `&`, at `#` for numeric references or alphanumeric for named
   * references.
   *
   * ```markdown
   * > | a&amp;b
   *       ^
   * > | a&#123;b
   *       ^
   * > | a&#x9;b
   *       ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === codes.numberSign) {
      effects.enter(types.characterReferenceMarkerNumeric);
      effects.consume(code);
      effects.exit(types.characterReferenceMarkerNumeric);
      return numeric
    }

    effects.enter(types.characterReferenceValue);
    max = constants.characterReferenceNamedSizeMax;
    test = asciiAlphanumeric;
    return value(code)
  }

  /**
   * After `#`, at `x` for hexadecimals or digit for decimals.
   *
   * ```markdown
   * > | a&#123;b
   *        ^
   * > | a&#x9;b
   *        ^
   * ```
   *
   * @type {State}
   */
  function numeric(code) {
    if (code === codes.uppercaseX || code === codes.lowercaseX) {
      effects.enter(types.characterReferenceMarkerHexadecimal);
      effects.consume(code);
      effects.exit(types.characterReferenceMarkerHexadecimal);
      effects.enter(types.characterReferenceValue);
      max = constants.characterReferenceHexadecimalSizeMax;
      test = asciiHexDigit;
      return value
    }

    effects.enter(types.characterReferenceValue);
    max = constants.characterReferenceDecimalSizeMax;
    test = asciiDigit;
    return value(code)
  }

  /**
   * After markers (`&#x`, `&#`, or `&`), in value, before `;`.
   *
   * The character reference kind defines what and how many characters are
   * allowed.
   *
   * ```markdown
   * > | a&amp;b
   *       ^^^
   * > | a&#123;b
   *        ^^^
   * > | a&#x9;b
   *         ^
   * ```
   *
   * @type {State}
   */
  function value(code) {
    if (code === codes.semicolon && size) {
      const token = effects.exit(types.characterReferenceValue);

      if (
        test === asciiAlphanumeric &&
        !decodeNamedCharacterReference(self.sliceSerialize(token))
      ) {
        return nok(code)
      }

      // To do: `markdown-rs` uses a different name:
      // `CharacterReferenceMarkerSemi`.
      effects.enter(types.characterReferenceMarker);
      effects.consume(code);
      effects.exit(types.characterReferenceMarker);
      effects.exit(types.characterReference);
      return ok$1
    }

    if (test(code) && size++ < max) {
      effects.consume(code);
      return value
    }

    return nok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const nonLazyContinuation = {
  tokenize: tokenizeNonLazyContinuation,
  partial: true
};

/** @type {Construct} */
const codeFenced = {
  name: 'codeFenced',
  tokenize: tokenizeCodeFenced,
  concrete: true
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCodeFenced(effects, ok$1, nok) {
  const self = this;
  /** @type {Construct} */
  const closeStart = {tokenize: tokenizeCloseStart, partial: true};
  let initialPrefix = 0;
  let sizeOpen = 0;
  /** @type {NonNullable<Code>} */
  let marker;

  return start

  /**
   * Start of code.
   *
   * ```markdown
   * > | ~~~js
   *     ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // To do: parse whitespace like `markdown-rs`.
    return beforeSequenceOpen(code)
  }

  /**
   * In opening fence, after prefix, at sequence.
   *
   * ```markdown
   * > | ~~~js
   *     ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function beforeSequenceOpen(code) {
    ok(
      code === codes.graveAccent || code === codes.tilde,
      'expected `` ` `` or `~`'
    );

    const tail = self.events[self.events.length - 1];
    initialPrefix =
      tail && tail[1].type === types.linePrefix
        ? tail[2].sliceSerialize(tail[1], true).length
        : 0;

    marker = code;
    effects.enter(types.codeFenced);
    effects.enter(types.codeFencedFence);
    effects.enter(types.codeFencedFenceSequence);
    return sequenceOpen(code)
  }

  /**
   * In opening fence sequence.
   *
   * ```markdown
   * > | ~~~js
   *      ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function sequenceOpen(code) {
    if (code === marker) {
      sizeOpen++;
      effects.consume(code);
      return sequenceOpen
    }

    if (sizeOpen < constants.codeFencedSequenceSizeMin) {
      return nok(code)
    }

    effects.exit(types.codeFencedFenceSequence);
    return markdownSpace(code)
      ? factorySpace(effects, infoBefore, types.whitespace)(code)
      : infoBefore(code)
  }

  /**
   * In opening fence, after the sequence (and optional whitespace), before info.
   *
   * ```markdown
   * > | ~~~js
   *        ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function infoBefore(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types.codeFencedFence);
      return self.interrupt
        ? ok$1(code)
        : effects.check(nonLazyContinuation, atNonLazyBreak, after)(code)
    }

    effects.enter(types.codeFencedFenceInfo);
    effects.enter(types.chunkString, {contentType: constants.contentTypeString});
    return info(code)
  }

  /**
   * In info.
   *
   * ```markdown
   * > | ~~~js
   *        ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function info(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types.chunkString);
      effects.exit(types.codeFencedFenceInfo);
      return infoBefore(code)
    }

    if (markdownSpace(code)) {
      effects.exit(types.chunkString);
      effects.exit(types.codeFencedFenceInfo);
      return factorySpace(effects, metaBefore, types.whitespace)(code)
    }

    if (code === codes.graveAccent && code === marker) {
      return nok(code)
    }

    effects.consume(code);
    return info
  }

  /**
   * In opening fence, after info and whitespace, before meta.
   *
   * ```markdown
   * > | ~~~js eval
   *           ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function metaBefore(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      return infoBefore(code)
    }

    effects.enter(types.codeFencedFenceMeta);
    effects.enter(types.chunkString, {contentType: constants.contentTypeString});
    return meta(code)
  }

  /**
   * In meta.
   *
   * ```markdown
   * > | ~~~js eval
   *           ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function meta(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types.chunkString);
      effects.exit(types.codeFencedFenceMeta);
      return infoBefore(code)
    }

    if (code === codes.graveAccent && code === marker) {
      return nok(code)
    }

    effects.consume(code);
    return meta
  }

  /**
   * At eol/eof in code, before a non-lazy closing fence or content.
   *
   * ```markdown
   * > | ~~~js
   *          ^
   * > | alert(1)
   *             ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function atNonLazyBreak(code) {
    ok(markdownLineEnding(code), 'expected eol');
    return effects.attempt(closeStart, after, contentBefore)(code)
  }

  /**
   * Before code content, not a closing fence, at eol.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *             ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function contentBefore(code) {
    ok(markdownLineEnding(code), 'expected eol');
    effects.enter(types.lineEnding);
    effects.consume(code);
    effects.exit(types.lineEnding);
    return contentStart
  }

  /**
   * Before code content, not a closing fence.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *     ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function contentStart(code) {
    return initialPrefix > 0 && markdownSpace(code)
      ? factorySpace(
          effects,
          beforeContentChunk,
          types.linePrefix,
          initialPrefix + 1
        )(code)
      : beforeContentChunk(code)
  }

  /**
   * Before code content, after optional prefix.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *     ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function beforeContentChunk(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      return effects.check(nonLazyContinuation, atNonLazyBreak, after)(code)
    }

    effects.enter(types.codeFlowValue);
    return contentChunk(code)
  }

  /**
   * In code content.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *     ^^^^^^^^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function contentChunk(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types.codeFlowValue);
      return beforeContentChunk(code)
    }

    effects.consume(code);
    return contentChunk
  }

  /**
   * After code.
   *
   * ```markdown
   *   | ~~~js
   *   | alert(1)
   * > | ~~~
   *        ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    effects.exit(types.codeFenced);
    return ok$1(code)
  }

  /**
   * @this {TokenizeContext}
   * @type {Tokenizer}
   */
  function tokenizeCloseStart(effects, ok$1, nok) {
    let size = 0;

    return startBefore

    /**
     *
     *
     * @type {State}
     */
    function startBefore(code) {
      ok(markdownLineEnding(code), 'expected eol');
      effects.enter(types.lineEnding);
      effects.consume(code);
      effects.exit(types.lineEnding);
      return start
    }

    /**
     * Before closing fence, at optional whitespace.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *     ^
     * ```
     *
     * @type {State}
     */
    function start(code) {
      // Always populated by defaults.
      ok(
        self.parser.constructs.disable.null,
        'expected `disable.null` to be populated'
      );

      // To do: `enter` here or in next state?
      effects.enter(types.codeFencedFence);
      return markdownSpace(code)
        ? factorySpace(
            effects,
            beforeSequenceClose,
            types.linePrefix,
            self.parser.constructs.disable.null.includes('codeIndented')
              ? undefined
              : constants.tabSize
          )(code)
        : beforeSequenceClose(code)
    }

    /**
     * In closing fence, after optional whitespace, at sequence.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *     ^
     * ```
     *
     * @type {State}
     */
    function beforeSequenceClose(code) {
      if (code === marker) {
        effects.enter(types.codeFencedFenceSequence);
        return sequenceClose(code)
      }

      return nok(code)
    }

    /**
     * In closing fence sequence.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *     ^
     * ```
     *
     * @type {State}
     */
    function sequenceClose(code) {
      if (code === marker) {
        size++;
        effects.consume(code);
        return sequenceClose
      }

      if (size >= sizeOpen) {
        effects.exit(types.codeFencedFenceSequence);
        return markdownSpace(code)
          ? factorySpace(effects, sequenceCloseAfter, types.whitespace)(code)
          : sequenceCloseAfter(code)
      }

      return nok(code)
    }

    /**
     * After closing fence sequence, after optional whitespace.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *        ^
     * ```
     *
     * @type {State}
     */
    function sequenceCloseAfter(code) {
      if (code === codes.eof || markdownLineEnding(code)) {
        effects.exit(types.codeFencedFence);
        return ok$1(code)
      }

      return nok(code)
    }
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeNonLazyContinuation(effects, ok$1, nok) {
  const self = this;

  return start

  /**
   *
   *
   * @type {State}
   */
  function start(code) {
    if (code === codes.eof) {
      return nok(code)
    }

    ok(markdownLineEnding(code), 'expected eol');
    effects.enter(types.lineEnding);
    effects.consume(code);
    effects.exit(types.lineEnding);
    return lineStart
  }

  /**
   *
   *
   * @type {State}
   */
  function lineStart(code) {
    return self.parser.lazy[self.now().line] ? nok(code) : ok$1(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const codeIndented = {
  name: 'codeIndented',
  tokenize: tokenizeCodeIndented
};

/** @type {Construct} */
const furtherStart = {tokenize: tokenizeFurtherStart, partial: true};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCodeIndented(effects, ok$1, nok) {
  const self = this;
  return start

  /**
   * Start of code (indented).
   *
   * > **Parsing note**: it is not needed to check if this first line is a
   * > filled line (that it has a non-whitespace character), because blank lines
   * > are parsed already, so we never run into that.
   *
   * ```markdown
   * > |     aaa
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // To do: manually check if interrupting like `markdown-rs`.
    ok(markdownSpace(code));
    effects.enter(types.codeIndented);
    // To do: use an improved `space_or_tab` function like `markdown-rs`,
    // so that we can drop the next state.
    return factorySpace(
      effects,
      afterPrefix,
      types.linePrefix,
      constants.tabSize + 1
    )(code)
  }

  /**
   * At start, after 1 or 4 spaces.
   *
   * ```markdown
   * > |     aaa
   *         ^
   * ```
   *
   * @type {State}
   */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1];
    return tail &&
      tail[1].type === types.linePrefix &&
      tail[2].sliceSerialize(tail[1], true).length >= constants.tabSize
      ? atBreak(code)
      : nok(code)
  }

  /**
   * At a break.
   *
   * ```markdown
   * > |     aaa
   *         ^  ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === codes.eof) {
      return after(code)
    }

    if (markdownLineEnding(code)) {
      return effects.attempt(furtherStart, atBreak, after)(code)
    }

    effects.enter(types.codeFlowValue);
    return inside(code)
  }

  /**
   * In code content.
   *
   * ```markdown
   * > |     aaa
   *         ^^^^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types.codeFlowValue);
      return atBreak(code)
    }

    effects.consume(code);
    return inside
  }

  /** @type {State} */
  function after(code) {
    effects.exit(types.codeIndented);
    // To do: allow interrupting like `markdown-rs`.
    // Feel free to interrupt.
    // tokenizer.interrupt = false
    return ok$1(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeFurtherStart(effects, ok, nok) {
  const self = this;

  return furtherStart

  /**
   * At eol, trying to parse another indent.
   *
   * ```markdown
   * > |     aaa
   *            ^
   *   |     bbb
   * ```
   *
   * @type {State}
   */
  function furtherStart(code) {
    // To do: improve `lazy` / `pierce` handling.
    // If this is a lazy line, it can’t be code.
    if (self.parser.lazy[self.now().line]) {
      return nok(code)
    }

    if (markdownLineEnding(code)) {
      effects.enter(types.lineEnding);
      effects.consume(code);
      effects.exit(types.lineEnding);
      return furtherStart
    }

    // To do: the code here in `micromark-js` is a bit different from
    // `markdown-rs` because there it can attempt spaces.
    // We can’t yet.
    //
    // To do: use an improved `space_or_tab` function like `markdown-rs`,
    // so that we can drop the next state.
    return factorySpace(
      effects,
      afterPrefix,
      types.linePrefix,
      constants.tabSize + 1
    )(code)
  }

  /**
   * At start, after 1 or 4 spaces.
   *
   * ```markdown
   * > |     aaa
   *         ^
   * ```
   *
   * @type {State}
   */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1];
    return tail &&
      tail[1].type === types.linePrefix &&
      tail[2].sliceSerialize(tail[1], true).length >= constants.tabSize
      ? ok(code)
      : markdownLineEnding(code)
      ? furtherStart(code)
      : nok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Previous} Previous
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const codeText = {
  name: 'codeText',
  tokenize: tokenizeCodeText,
  resolve: resolveCodeText,
  previous
};

// To do: next major: don’t resolve, like `markdown-rs`.
/** @type {Resolver} */
function resolveCodeText(events) {
  let tailExitIndex = events.length - 4;
  let headEnterIndex = 3;
  /** @type {number} */
  let index;
  /** @type {number | undefined} */
  let enter;

  // If we start and end with an EOL or a space.
  if (
    (events[headEnterIndex][1].type === types.lineEnding ||
      events[headEnterIndex][1].type === 'space') &&
    (events[tailExitIndex][1].type === types.lineEnding ||
      events[tailExitIndex][1].type === 'space')
  ) {
    index = headEnterIndex;

    // And we have data.
    while (++index < tailExitIndex) {
      if (events[index][1].type === types.codeTextData) {
        // Then we have padding.
        events[headEnterIndex][1].type = types.codeTextPadding;
        events[tailExitIndex][1].type = types.codeTextPadding;
        headEnterIndex += 2;
        tailExitIndex -= 2;
        break
      }
    }
  }

  // Merge adjacent spaces and data.
  index = headEnterIndex - 1;
  tailExitIndex++;

  while (++index <= tailExitIndex) {
    if (enter === undefined) {
      if (
        index !== tailExitIndex &&
        events[index][1].type !== types.lineEnding
      ) {
        enter = index;
      }
    } else if (
      index === tailExitIndex ||
      events[index][1].type === types.lineEnding
    ) {
      events[enter][1].type = types.codeTextData;

      if (index !== enter + 2) {
        events[enter][1].end = events[index - 1][1].end;
        events.splice(enter + 2, index - enter - 2);
        tailExitIndex -= index - enter - 2;
        index = enter + 2;
      }

      enter = undefined;
    }
  }

  return events
}

/**
 * @this {TokenizeContext}
 * @type {Previous}
 */
function previous(code) {
  // If there is a previous code, there will always be a tail.
  return (
    code !== codes.graveAccent ||
    this.events[this.events.length - 1][1].type === types.characterEscape
  )
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCodeText(effects, ok$1, nok) {
  const self = this;
  let sizeOpen = 0;
  /** @type {number} */
  let size;
  /** @type {Token} */
  let token;

  return start

  /**
   * Start of code (text).
   *
   * ```markdown
   * > | `a`
   *     ^
   * > | \`a`
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ok(code === codes.graveAccent, 'expected `` ` ``');
    ok(previous.call(self, self.previous), 'expected correct previous');
    effects.enter(types.codeText);
    effects.enter(types.codeTextSequence);
    return sequenceOpen(code)
  }

  /**
   * In opening sequence.
   *
   * ```markdown
   * > | `a`
   *     ^
   * ```
   *
   * @type {State}
   */
  function sequenceOpen(code) {
    if (code === codes.graveAccent) {
      effects.consume(code);
      sizeOpen++;
      return sequenceOpen
    }

    effects.exit(types.codeTextSequence);
    return between(code)
  }

  /**
   * Between something and something else.
   *
   * ```markdown
   * > | `a`
   *      ^^
   * ```
   *
   * @type {State}
   */
  function between(code) {
    // EOF.
    if (code === codes.eof) {
      return nok(code)
    }

    // To do: next major: don’t do spaces in resolve, but when compiling,
    // like `markdown-rs`.
    // Tabs don’t work, and virtual spaces don’t make sense.
    if (code === codes.space) {
      effects.enter('space');
      effects.consume(code);
      effects.exit('space');
      return between
    }

    // Closing fence? Could also be data.
    if (code === codes.graveAccent) {
      token = effects.enter(types.codeTextSequence);
      size = 0;
      return sequenceClose(code)
    }

    if (markdownLineEnding(code)) {
      effects.enter(types.lineEnding);
      effects.consume(code);
      effects.exit(types.lineEnding);
      return between
    }

    // Data.
    effects.enter(types.codeTextData);
    return data(code)
  }

  /**
   * In data.
   *
   * ```markdown
   * > | `a`
   *      ^
   * ```
   *
   * @type {State}
   */
  function data(code) {
    if (
      code === codes.eof ||
      code === codes.space ||
      code === codes.graveAccent ||
      markdownLineEnding(code)
    ) {
      effects.exit(types.codeTextData);
      return between(code)
    }

    effects.consume(code);
    return data
  }

  /**
   * In closing sequence.
   *
   * ```markdown
   * > | `a`
   *       ^
   * ```
   *
   * @type {State}
   */
  function sequenceClose(code) {
    // More.
    if (code === codes.graveAccent) {
      effects.consume(code);
      size++;
      return sequenceClose
    }

    // Done!
    if (size === sizeOpen) {
      effects.exit(types.codeTextSequence);
      effects.exit(types.codeText);
      return ok$1(code)
    }

    // More or less accents: mark as data.
    token.type = types.codeTextData;
    return data(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Chunk} Chunk
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Token} Token
 */


/**
 * Tokenize subcontent.
 *
 * @param {Array<Event>} events
 *   List of events.
 * @returns {boolean}
 *   Whether subtokens were found.
 */
function subtokenize(events) {
  /** @type {Record<string, number>} */
  const jumps = {};
  let index = -1;
  /** @type {Event} */
  let event;
  /** @type {number | undefined} */
  let lineIndex;
  /** @type {number} */
  let otherIndex;
  /** @type {Event} */
  let otherEvent;
  /** @type {Array<Event>} */
  let parameters;
  /** @type {Array<Event>} */
  let subevents;
  /** @type {boolean | undefined} */
  let more;

  while (++index < events.length) {
    while (index in jumps) {
      index = jumps[index];
    }

    event = events[index];

    // Add a hook for the GFM tasklist extension, which needs to know if text
    // is in the first content of a list item.
    if (
      index &&
      event[1].type === types.chunkFlow &&
      events[index - 1][1].type === types.listItemPrefix
    ) {
      ok(event[1]._tokenizer, 'expected `_tokenizer` on subtokens');
      subevents = event[1]._tokenizer.events;
      otherIndex = 0;

      if (
        otherIndex < subevents.length &&
        subevents[otherIndex][1].type === types.lineEndingBlank
      ) {
        otherIndex += 2;
      }

      if (
        otherIndex < subevents.length &&
        subevents[otherIndex][1].type === types.content
      ) {
        while (++otherIndex < subevents.length) {
          if (subevents[otherIndex][1].type === types.content) {
            break
          }

          if (subevents[otherIndex][1].type === types.chunkText) {
            subevents[otherIndex][1]._isInFirstContentOfListItem = true;
            otherIndex++;
          }
        }
      }
    }

    // Enter.
    if (event[0] === 'enter') {
      if (event[1].contentType) {
        Object.assign(jumps, subcontent(events, index));
        index = jumps[index];
        more = true;
      }
    }
    // Exit.
    else if (event[1]._container) {
      otherIndex = index;
      lineIndex = undefined;

      while (otherIndex--) {
        otherEvent = events[otherIndex];

        if (
          otherEvent[1].type === types.lineEnding ||
          otherEvent[1].type === types.lineEndingBlank
        ) {
          if (otherEvent[0] === 'enter') {
            if (lineIndex) {
              events[lineIndex][1].type = types.lineEndingBlank;
            }

            otherEvent[1].type = types.lineEnding;
            lineIndex = otherIndex;
          }
        } else {
          break
        }
      }

      if (lineIndex) {
        // Fix position.
        event[1].end = Object.assign({}, events[lineIndex][1].start);

        // Switch container exit w/ line endings.
        parameters = events.slice(lineIndex, index);
        parameters.unshift(event);
        splice(events, lineIndex, index - lineIndex + 1, parameters);
      }
    }
  }

  return !more
}

/**
 * Tokenize embedded tokens.
 *
 * @param {Array<Event>} events
 * @param {number} eventIndex
 * @returns {Record<string, number>}
 */
function subcontent(events, eventIndex) {
  const token = events[eventIndex][1];
  const context = events[eventIndex][2];
  let startPosition = eventIndex - 1;
  /** @type {Array<number>} */
  const startPositions = [];
  ok(token.contentType, 'expected `contentType` on subtokens');
  const tokenizer =
    token._tokenizer || context.parser[token.contentType](token.start);
  const childEvents = tokenizer.events;
  /** @type {Array<[number, number]>} */
  const jumps = [];
  /** @type {Record<string, number>} */
  const gaps = {};
  /** @type {Array<Chunk>} */
  let stream;
  /** @type {Token | undefined} */
  let previous;
  let index = -1;
  /** @type {Token | undefined} */
  let current = token;
  let adjust = 0;
  let start = 0;
  const breaks = [start];

  // Loop forward through the linked tokens to pass them in order to the
  // subtokenizer.
  while (current) {
    // Find the position of the event for this token.
    while (events[++startPosition][1] !== current) {
      // Empty.
    }

    ok(
      !previous || current.previous === previous,
      'expected previous to match'
    );
    ok(!previous || previous.next === current, 'expected next to match');

    startPositions.push(startPosition);

    if (!current._tokenizer) {
      stream = context.sliceStream(current);

      if (!current.next) {
        stream.push(codes.eof);
      }

      if (previous) {
        tokenizer.defineSkip(current.start);
      }

      if (current._isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = true;
      }

      tokenizer.write(stream);

      if (current._isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = undefined;
      }
    }

    // Unravel the next token.
    previous = current;
    current = current.next;
  }

  // Now, loop back through all events (and linked tokens), to figure out which
  // parts belong where.
  current = token;

  while (++index < childEvents.length) {
    if (
      // Find a void token that includes a break.
      childEvents[index][0] === 'exit' &&
      childEvents[index - 1][0] === 'enter' &&
      childEvents[index][1].type === childEvents[index - 1][1].type &&
      childEvents[index][1].start.line !== childEvents[index][1].end.line
    ) {
      ok(current, 'expected a current token');
      start = index + 1;
      breaks.push(start);
      // Help GC.
      current._tokenizer = undefined;
      current.previous = undefined;
      current = current.next;
    }
  }

  // Help GC.
  tokenizer.events = [];

  // If there’s one more token (which is the cases for lines that end in an
  // EOF), that’s perfect: the last point we found starts it.
  // If there isn’t then make sure any remaining content is added to it.
  if (current) {
    // Help GC.
    current._tokenizer = undefined;
    current.previous = undefined;
    ok(!current.next, 'expected no next token');
  } else {
    breaks.pop();
  }

  // Now splice the events from the subtokenizer into the current events,
  // moving back to front so that splice indices aren’t affected.
  index = breaks.length;

  while (index--) {
    const slice = childEvents.slice(breaks[index], breaks[index + 1]);
    const start = startPositions.pop();
    ok(start !== undefined, 'expected a start position when splicing');
    jumps.unshift([start, start + slice.length - 1]);
    splice(events, start, 2, slice);
  }

  index = -1;

  while (++index < jumps.length) {
    gaps[adjust + jumps[index][0]] = adjust + jumps[index][1];
    adjust += jumps[index][1] - jumps[index][0] - 1;
  }

  return gaps
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/**
 * No name because it must not be turned off.
 * @type {Construct}
 */
const content = {tokenize: tokenizeContent, resolve: resolveContent};

/** @type {Construct} */
const continuationConstruct = {tokenize: tokenizeContinuation, partial: true};

/**
 * Content is transparent: it’s parsed right now. That way, definitions are also
 * parsed right now: before text in paragraphs (specifically, media) are parsed.
 *
 * @type {Resolver}
 */
function resolveContent(events) {
  subtokenize(events);
  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeContent(effects, ok$1) {
  /** @type {Token | undefined} */
  let previous;

  return chunkStart

  /**
   * Before a content chunk.
   *
   * ```markdown
   * > | abc
   *     ^
   * ```
   *
   * @type {State}
   */
  function chunkStart(code) {
    ok(
      code !== codes.eof && !markdownLineEnding(code),
      'expected no eof or eol'
    );

    effects.enter(types.content);
    previous = effects.enter(types.chunkContent, {
      contentType: constants.contentTypeContent
    });
    return chunkInside(code)
  }

  /**
   * In a content chunk.
   *
   * ```markdown
   * > | abc
   *     ^^^
   * ```
   *
   * @type {State}
   */
  function chunkInside(code) {
    if (code === codes.eof) {
      return contentEnd(code)
    }

    // To do: in `markdown-rs`, each line is parsed on its own, and everything
    // is stitched together resolving.
    if (markdownLineEnding(code)) {
      return effects.check(
        continuationConstruct,
        contentContinue,
        contentEnd
      )(code)
    }

    // Data.
    effects.consume(code);
    return chunkInside
  }

  /**
   *
   *
   * @type {State}
   */
  function contentEnd(code) {
    effects.exit(types.chunkContent);
    effects.exit(types.content);
    return ok$1(code)
  }

  /**
   *
   *
   * @type {State}
   */
  function contentContinue(code) {
    ok(markdownLineEnding(code), 'expected eol');
    effects.consume(code);
    effects.exit(types.chunkContent);
    ok(previous, 'expected previous token');
    previous.next = effects.enter(types.chunkContent, {
      contentType: constants.contentTypeContent,
      previous
    });
    previous = previous.next;
    return chunkInside
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeContinuation(effects, ok$1, nok) {
  const self = this;

  return startLookahead

  /**
   *
   *
   * @type {State}
   */
  function startLookahead(code) {
    ok(markdownLineEnding(code), 'expected a line ending');
    effects.exit(types.chunkContent);
    effects.enter(types.lineEnding);
    effects.consume(code);
    effects.exit(types.lineEnding);
    return factorySpace(effects, prefixed, types.linePrefix)
  }

  /**
   *
   *
   * @type {State}
   */
  function prefixed(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      return nok(code)
    }

    // Always populated by defaults.
    ok(
      self.parser.constructs.disable.null,
      'expected `disable.null` to be populated'
    );

    const tail = self.events[self.events.length - 1];

    if (
      !self.parser.constructs.disable.null.includes('codeIndented') &&
      tail &&
      tail[1].type === types.linePrefix &&
      tail[2].sliceSerialize(tail[1], true).length >= constants.tabSize
    ) {
      return ok$1(code)
    }

    return effects.interrupt(self.parser.constructs.flow, nok, ok$1)(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenType} TokenType
 */


/**
 * Parse destinations.
 *
 * ###### Examples
 *
 * ```markdown
 * <a>
 * <a\>b>
 * <a b>
 * <a)>
 * a
 * a\)b
 * a(b)c
 * a(b)
 * ```
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {State} nok
 *   State switched to when unsuccessful.
 * @param {TokenType} type
 *   Type for whole (`<a>` or `b`).
 * @param {TokenType} literalType
 *   Type when enclosed (`<a>`).
 * @param {TokenType} literalMarkerType
 *   Type for enclosing (`<` and `>`).
 * @param {TokenType} rawType
 *   Type when not enclosed (`b`).
 * @param {TokenType} stringType
 *   Type for the value (`a` or `b`).
 * @param {number | undefined} [max=Infinity]
 *   Depth of nested parens (inclusive).
 * @returns {State}
 *   Start state.
 */
// eslint-disable-next-line max-params
function factoryDestination(
  effects,
  ok,
  nok,
  type,
  literalType,
  literalMarkerType,
  rawType,
  stringType,
  max
) {
  const limit = max || Number.POSITIVE_INFINITY;
  let balance = 0;

  return start

  /**
   * Start of destination.
   *
   * ```markdown
   * > | <aa>
   *     ^
   * > | aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (code === codes.lessThan) {
      effects.enter(type);
      effects.enter(literalType);
      effects.enter(literalMarkerType);
      effects.consume(code);
      effects.exit(literalMarkerType);
      return enclosedBefore
    }

    // ASCII control, space, closing paren.
    if (
      code === codes.eof ||
      code === codes.space ||
      code === codes.rightParenthesis ||
      asciiControl(code)
    ) {
      return nok(code)
    }

    effects.enter(type);
    effects.enter(rawType);
    effects.enter(stringType);
    effects.enter(types.chunkString, {contentType: constants.contentTypeString});
    return raw(code)
  }

  /**
   * After `<`, at an enclosed destination.
   *
   * ```markdown
   * > | <aa>
   *      ^
   * ```
   *
   * @type {State}
   */
  function enclosedBefore(code) {
    if (code === codes.greaterThan) {
      effects.enter(literalMarkerType);
      effects.consume(code);
      effects.exit(literalMarkerType);
      effects.exit(literalType);
      effects.exit(type);
      return ok
    }

    effects.enter(stringType);
    effects.enter(types.chunkString, {contentType: constants.contentTypeString});
    return enclosed(code)
  }

  /**
   * In enclosed destination.
   *
   * ```markdown
   * > | <aa>
   *      ^
   * ```
   *
   * @type {State}
   */
  function enclosed(code) {
    if (code === codes.greaterThan) {
      effects.exit(types.chunkString);
      effects.exit(stringType);
      return enclosedBefore(code)
    }

    if (
      code === codes.eof ||
      code === codes.lessThan ||
      markdownLineEnding(code)
    ) {
      return nok(code)
    }

    effects.consume(code);
    return code === codes.backslash ? enclosedEscape : enclosed
  }

  /**
   * After `\`, at a special character.
   *
   * ```markdown
   * > | <a\*a>
   *        ^
   * ```
   *
   * @type {State}
   */
  function enclosedEscape(code) {
    if (
      code === codes.lessThan ||
      code === codes.greaterThan ||
      code === codes.backslash
    ) {
      effects.consume(code);
      return enclosed
    }

    return enclosed(code)
  }

  /**
   * In raw destination.
   *
   * ```markdown
   * > | aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function raw(code) {
    if (
      !balance &&
      (code === codes.eof ||
        code === codes.rightParenthesis ||
        markdownLineEndingOrSpace(code))
    ) {
      effects.exit(types.chunkString);
      effects.exit(stringType);
      effects.exit(rawType);
      effects.exit(type);
      return ok(code)
    }

    if (balance < limit && code === codes.leftParenthesis) {
      effects.consume(code);
      balance++;
      return raw
    }

    if (code === codes.rightParenthesis) {
      effects.consume(code);
      balance--;
      return raw
    }

    // ASCII control (but *not* `\0`) and space and `(`.
    // Note: in `markdown-rs`, `\0` exists in codes, in `micromark-js` it
    // doesn’t.
    if (
      code === codes.eof ||
      code === codes.space ||
      code === codes.leftParenthesis ||
      asciiControl(code)
    ) {
      return nok(code)
    }

    effects.consume(code);
    return code === codes.backslash ? rawEscape : raw
  }

  /**
   * After `\`, at special character.
   *
   * ```markdown
   * > | a\*a
   *       ^
   * ```
   *
   * @type {State}
   */
  function rawEscape(code) {
    if (
      code === codes.leftParenthesis ||
      code === codes.rightParenthesis ||
      code === codes.backslash
    ) {
      effects.consume(code);
      return raw
    }

    return raw(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').TokenType} TokenType
 */


/**
 * Parse labels.
 *
 * > 👉 **Note**: labels in markdown are capped at 999 characters in the string.
 *
 * ###### Examples
 *
 * ```markdown
 * [a]
 * [a
 * b]
 * [a\]b]
 * ```
 *
 * @this {TokenizeContext}
 *   Tokenize context.
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {State} nok
 *   State switched to when unsuccessful.
 * @param {TokenType} type
 *   Type of the whole label (`[a]`).
 * @param {TokenType} markerType
 *   Type for the markers (`[` and `]`).
 * @param {TokenType} stringType
 *   Type for the identifier (`a`).
 * @returns {State}
 *   Start state.
 */
// eslint-disable-next-line max-params
function factoryLabel(effects, ok$1, nok, type, markerType, stringType) {
  const self = this;
  let size = 0;
  /** @type {boolean} */
  let seen;

  return start

  /**
   * Start of label.
   *
   * ```markdown
   * > | [a]
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ok(code === codes.leftSquareBracket, 'expected `[`');
    effects.enter(type);
    effects.enter(markerType);
    effects.consume(code);
    effects.exit(markerType);
    effects.enter(stringType);
    return atBreak
  }

  /**
   * In label, at something, before something else.
   *
   * ```markdown
   * > | [a]
   *      ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (
      size > constants.linkReferenceSizeMax ||
      code === codes.eof ||
      code === codes.leftSquareBracket ||
      (code === codes.rightSquareBracket && !seen) ||
      // To do: remove in the future once we’ve switched from
      // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
      // which doesn’t need this.
      // Hidden footnotes hook.
      /* c8 ignore next 3 */
      (code === codes.caret &&
        !size &&
        '_hiddenFootnoteSupport' in self.parser.constructs)
    ) {
      return nok(code)
    }

    if (code === codes.rightSquareBracket) {
      effects.exit(stringType);
      effects.enter(markerType);
      effects.consume(code);
      effects.exit(markerType);
      effects.exit(type);
      return ok$1
    }

    // To do: indent? Link chunks and EOLs together?
    if (markdownLineEnding(code)) {
      effects.enter(types.lineEnding);
      effects.consume(code);
      effects.exit(types.lineEnding);
      return atBreak
    }

    effects.enter(types.chunkString, {contentType: constants.contentTypeString});
    return labelInside(code)
  }

  /**
   * In label, in text.
   *
   * ```markdown
   * > | [a]
   *      ^
   * ```
   *
   * @type {State}
   */
  function labelInside(code) {
    if (
      code === codes.eof ||
      code === codes.leftSquareBracket ||
      code === codes.rightSquareBracket ||
      markdownLineEnding(code) ||
      size++ > constants.linkReferenceSizeMax
    ) {
      effects.exit(types.chunkString);
      return atBreak(code)
    }

    effects.consume(code);
    if (!seen) seen = !markdownSpace(code);
    return code === codes.backslash ? labelEscape : labelInside
  }

  /**
   * After `\`, at a special character.
   *
   * ```markdown
   * > | [a\*a]
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelEscape(code) {
    if (
      code === codes.leftSquareBracket ||
      code === codes.backslash ||
      code === codes.rightSquareBracket
    ) {
      effects.consume(code);
      size++;
      return labelInside
    }

    return labelInside(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenType} TokenType
 */


/**
 * Parse titles.
 *
 * ###### Examples
 *
 * ```markdown
 * "a"
 * 'b'
 * (c)
 * "a
 * b"
 * 'a
 *     b'
 * (a\)b)
 * ```
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {State} nok
 *   State switched to when unsuccessful.
 * @param {TokenType} type
 *   Type of the whole title (`"a"`, `'b'`, `(c)`).
 * @param {TokenType} markerType
 *   Type for the markers (`"`, `'`, `(`, and `)`).
 * @param {TokenType} stringType
 *   Type for the value (`a`).
 * @returns {State}
 *   Start state.
 */
// eslint-disable-next-line max-params
function factoryTitle(effects, ok, nok, type, markerType, stringType) {
  /** @type {NonNullable<Code>} */
  let marker;

  return start

  /**
   * Start of title.
   *
   * ```markdown
   * > | "a"
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (
      code === codes.quotationMark ||
      code === codes.apostrophe ||
      code === codes.leftParenthesis
    ) {
      effects.enter(type);
      effects.enter(markerType);
      effects.consume(code);
      effects.exit(markerType);
      marker = code === codes.leftParenthesis ? codes.rightParenthesis : code;
      return begin
    }

    return nok(code)
  }

  /**
   * After opening marker.
   *
   * This is also used at the closing marker.
   *
   * ```markdown
   * > | "a"
   *      ^
   * ```
   *
   * @type {State}
   */
  function begin(code) {
    if (code === marker) {
      effects.enter(markerType);
      effects.consume(code);
      effects.exit(markerType);
      effects.exit(type);
      return ok
    }

    effects.enter(stringType);
    return atBreak(code)
  }

  /**
   * At something, before something else.
   *
   * ```markdown
   * > | "a"
   *      ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === marker) {
      effects.exit(stringType);
      return begin(marker)
    }

    if (code === codes.eof) {
      return nok(code)
    }

    // Note: blank lines can’t exist in content.
    if (markdownLineEnding(code)) {
      // To do: use `space_or_tab_eol_with_options`, connect.
      effects.enter(types.lineEnding);
      effects.consume(code);
      effects.exit(types.lineEnding);
      return factorySpace(effects, atBreak, types.linePrefix)
    }

    effects.enter(types.chunkString, {contentType: constants.contentTypeString});
    return inside(code)
  }

  /**
   *
   *
   * @type {State}
   */
  function inside(code) {
    if (code === marker || code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types.chunkString);
      return atBreak(code)
    }

    effects.consume(code);
    return code === codes.backslash ? escape : inside
  }

  /**
   * After `\`, at a special character.
   *
   * ```markdown
   * > | "a\*b"
   *      ^
   * ```
   *
   * @type {State}
   */
  function escape(code) {
    if (code === marker || code === codes.backslash) {
      effects.consume(code);
      return inside
    }

    return inside(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 */


/**
 * Parse spaces and tabs.
 *
 * There is no `nok` parameter:
 *
 * *   line endings or spaces in markdown are often optional, in which case this
 *     factory can be used and `ok` will be switched to whether spaces were found
 *     or not
 * *   one line ending or space can be detected with
 *     `markdownLineEndingOrSpace(code)` right before using `factoryWhitespace`
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @returns
 *   Start state.
 */
function factoryWhitespace(effects, ok) {
  /** @type {boolean} */
  let seen;

  return start

  /** @type {State} */
  function start(code) {
    if (markdownLineEnding(code)) {
      effects.enter(types.lineEnding);
      effects.consume(code);
      effects.exit(types.lineEnding);
      seen = true;
      return start
    }

    if (markdownSpace(code)) {
      return factorySpace(
        effects,
        start,
        seen ? types.linePrefix : types.lineSuffix
      )(code)
    }

    return ok(code)
  }
}

/**
 * This module is compiled away!
 *
 * While micromark works based on character codes, this module includes the
 * string versions of ’em.
 * The C0 block, except for LF, CR, HT, and w/ the replacement character added,
 * are available here.
 */
const values = /** @type {const} */ ({
  ht: '\t',
  lf: '\n',
  cr: '\r',
  space: ' ',
  exclamationMark: '!',
  quotationMark: '"',
  numberSign: '#',
  dollarSign: '$',
  percentSign: '%',
  ampersand: '&',
  apostrophe: "'",
  leftParenthesis: '(',
  rightParenthesis: ')',
  asterisk: '*',
  plusSign: '+',
  comma: ',',
  dash: '-',
  dot: '.',
  slash: '/',
  digit0: '0',
  digit1: '1',
  digit2: '2',
  digit3: '3',
  digit4: '4',
  digit5: '5',
  digit6: '6',
  digit7: '7',
  digit8: '8',
  digit9: '9',
  colon: ':',
  semicolon: ';',
  lessThan: '<',
  equalsTo: '=',
  greaterThan: '>',
  questionMark: '?',
  atSign: '@',
  uppercaseA: 'A',
  uppercaseB: 'B',
  uppercaseC: 'C',
  uppercaseD: 'D',
  uppercaseE: 'E',
  uppercaseF: 'F',
  uppercaseG: 'G',
  uppercaseH: 'H',
  uppercaseI: 'I',
  uppercaseJ: 'J',
  uppercaseK: 'K',
  uppercaseL: 'L',
  uppercaseM: 'M',
  uppercaseN: 'N',
  uppercaseO: 'O',
  uppercaseP: 'P',
  uppercaseQ: 'Q',
  uppercaseR: 'R',
  uppercaseS: 'S',
  uppercaseT: 'T',
  uppercaseU: 'U',
  uppercaseV: 'V',
  uppercaseW: 'W',
  uppercaseX: 'X',
  uppercaseY: 'Y',
  uppercaseZ: 'Z',
  leftSquareBracket: '[',
  backslash: '\\',
  rightSquareBracket: ']',
  caret: '^',
  underscore: '_',
  graveAccent: '`',
  lowercaseA: 'a',
  lowercaseB: 'b',
  lowercaseC: 'c',
  lowercaseD: 'd',
  lowercaseE: 'e',
  lowercaseF: 'f',
  lowercaseG: 'g',
  lowercaseH: 'h',
  lowercaseI: 'i',
  lowercaseJ: 'j',
  lowercaseK: 'k',
  lowercaseL: 'l',
  lowercaseM: 'm',
  lowercaseN: 'n',
  lowercaseO: 'o',
  lowercaseP: 'p',
  lowercaseQ: 'q',
  lowercaseR: 'r',
  lowercaseS: 's',
  lowercaseT: 't',
  lowercaseU: 'u',
  lowercaseV: 'v',
  lowercaseW: 'w',
  lowercaseX: 'x',
  lowercaseY: 'y',
  lowercaseZ: 'z',
  leftCurlyBrace: '{',
  verticalBar: '|',
  rightCurlyBrace: '}',
  tilde: '~',
  replacementCharacter: '�'
});

/**
 * Normalize an identifier (as found in references, definitions).
 *
 * Collapses markdown whitespace, trim, and then lower- and uppercase.
 *
 * Some characters are considered “uppercase”, such as U+03F4 (`ϴ`), but if their
 * lowercase counterpart (U+03B8 (`θ`)) is uppercased will result in a different
 * uppercase character (U+0398 (`Θ`)).
 * So, to get a canonical form, we perform both lower- and uppercase.
 *
 * Using uppercase last makes sure keys will never interact with default
 * prototypal values (such as `constructor`): nothing in the prototype of
 * `Object` is uppercase.
 *
 * @param {string} value
 *   Identifier to normalize.
 * @returns {string}
 *   Normalized identifier.
 */
function normalizeIdentifier(value) {
  return (
    value
      // Collapse markdown whitespace.
      .replace(/[\t\n\r ]+/g, values.space)
      // Trim.
      .replace(/^ | $/g, '')
      // Some characters are considered “uppercase”, but if their lowercase
      // counterpart is uppercased will result in a different uppercase
      // character.
      // Hence, to get that form, we perform both lower- and uppercase.
      // Upper case makes sure keys will not interact with default prototypal
      // methods: no method is uppercase.
      .toLowerCase()
      .toUpperCase()
  )
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const definition = {name: 'definition', tokenize: tokenizeDefinition};

/** @type {Construct} */
const titleBefore = {tokenize: tokenizeTitleBefore, partial: true};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeDefinition(effects, ok$1, nok) {
  const self = this;
  /** @type {string} */
  let identifier;

  return start

  /**
   * At start of a definition.
   *
   * ```markdown
   * > | [a]: b "c"
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // Do not interrupt paragraphs (but do follow definitions).
    // To do: do `interrupt` the way `markdown-rs` does.
    // To do: parse whitespace the way `markdown-rs` does.
    effects.enter(types.definition);
    return before(code)
  }

  /**
   * After optional whitespace, at `[`.
   *
   * ```markdown
   * > | [a]: b "c"
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    // To do: parse whitespace the way `markdown-rs` does.
    ok(code === codes.leftSquareBracket, 'expected `[`');
    return factoryLabel.call(
      self,
      effects,
      labelAfter,
      // Note: we don’t need to reset the way `markdown-rs` does.
      nok,
      types.definitionLabel,
      types.definitionLabelMarker,
      types.definitionLabelString
    )(code)
  }

  /**
   * After label.
   *
   * ```markdown
   * > | [a]: b "c"
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelAfter(code) {
    identifier = normalizeIdentifier(
      self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1)
    );

    if (code === codes.colon) {
      effects.enter(types.definitionMarker);
      effects.consume(code);
      effects.exit(types.definitionMarker);
      return markerAfter
    }

    return nok(code)
  }

  /**
   * After marker.
   *
   * ```markdown
   * > | [a]: b "c"
   *         ^
   * ```
   *
   * @type {State}
   */
  function markerAfter(code) {
    // Note: whitespace is optional.
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, destinationBefore)(code)
      : destinationBefore(code)
  }

  /**
   * Before destination.
   *
   * ```markdown
   * > | [a]: b "c"
   *          ^
   * ```
   *
   * @type {State}
   */
  function destinationBefore(code) {
    return factoryDestination(
      effects,
      destinationAfter,
      // Note: we don’t need to reset the way `markdown-rs` does.
      nok,
      types.definitionDestination,
      types.definitionDestinationLiteral,
      types.definitionDestinationLiteralMarker,
      types.definitionDestinationRaw,
      types.definitionDestinationString
    )(code)
  }

  /**
   * After destination.
   *
   * ```markdown
   * > | [a]: b "c"
   *           ^
   * ```
   *
   * @type {State}
   */
  function destinationAfter(code) {
    return effects.attempt(titleBefore, after, after)(code)
  }

  /**
   * After definition.
   *
   * ```markdown
   * > | [a]: b
   *           ^
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    return markdownSpace(code)
      ? factorySpace(effects, afterWhitespace, types.whitespace)(code)
      : afterWhitespace(code)
  }

  /**
   * After definition, after optional whitespace.
   *
   * ```markdown
   * > | [a]: b
   *           ^
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function afterWhitespace(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types.definition);

      // Note: we don’t care about uniqueness.
      // It’s likely that that doesn’t happen very frequently.
      // It is more likely that it wastes precious time.
      self.parser.defined.push(identifier);

      // To do: `markdown-rs` interrupt.
      // // You’d be interrupting.
      // tokenizer.interrupt = true
      return ok$1(code)
    }

    return nok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeTitleBefore(effects, ok, nok) {
  return titleBefore

  /**
   * After destination, at whitespace.
   *
   * ```markdown
   * > | [a]: b
   *           ^
   * > | [a]: b "c"
   *           ^
   * ```
   *
   * @type {State}
   */
  function titleBefore(code) {
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, beforeMarker)(code)
      : nok(code)
  }

  /**
   * At title.
   *
   * ```markdown
   *   | [a]: b
   * > | "c"
   *     ^
   * ```
   *
   * @type {State}
   */
  function beforeMarker(code) {
    return factoryTitle(
      effects,
      titleAfter,
      nok,
      types.definitionTitle,
      types.definitionTitleMarker,
      types.definitionTitleString
    )(code)
  }

  /**
   * After title.
   *
   * ```markdown
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function titleAfter(code) {
    return markdownSpace(code)
      ? factorySpace(
          effects,
          titleAfterOptionalWhitespace,
          types.whitespace
        )(code)
      : titleAfterOptionalWhitespace(code)
  }

  /**
   * After title, after optional whitespace.
   *
   * ```markdown
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function titleAfterOptionalWhitespace(code) {
    return code === codes.eof || markdownLineEnding(code) ? ok(code) : nok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const hardBreakEscape = {
  name: 'hardBreakEscape',
  tokenize: tokenizeHardBreakEscape
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeHardBreakEscape(effects, ok$1, nok) {
  return start

  /**
   * Start of a hard break (escape).
   *
   * ```markdown
   * > | a\
   *      ^
   *   | b
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ok(code === codes.backslash, 'expected `\\`');
    effects.enter(types.hardBreakEscape);
    effects.consume(code);
    return after
  }

  /**
   * After `\`, at eol.
   *
   * ```markdown
   * > | a\
   *       ^
   *   | b
   * ```
   *
   *  @type {State}
   */
  function after(code) {
    if (markdownLineEnding(code)) {
      effects.exit(types.hardBreakEscape);
      return ok$1(code)
    }

    return nok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const headingAtx = {
  name: 'headingAtx',
  tokenize: tokenizeHeadingAtx,
  resolve: resolveHeadingAtx
};

/** @type {Resolver} */
function resolveHeadingAtx(events, context) {
  let contentEnd = events.length - 2;
  let contentStart = 3;
  /** @type {Token} */
  let content;
  /** @type {Token} */
  let text;

  // Prefix whitespace, part of the opening.
  if (events[contentStart][1].type === types.whitespace) {
    contentStart += 2;
  }

  // Suffix whitespace, part of the closing.
  if (
    contentEnd - 2 > contentStart &&
    events[contentEnd][1].type === types.whitespace
  ) {
    contentEnd -= 2;
  }

  if (
    events[contentEnd][1].type === types.atxHeadingSequence &&
    (contentStart === contentEnd - 1 ||
      (contentEnd - 4 > contentStart &&
        events[contentEnd - 2][1].type === types.whitespace))
  ) {
    contentEnd -= contentStart + 1 === contentEnd ? 2 : 4;
  }

  if (contentEnd > contentStart) {
    content = {
      type: types.atxHeadingText,
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end
    };
    text = {
      type: types.chunkText,
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end,
      contentType: constants.contentTypeText
    };

    splice(events, contentStart, contentEnd - contentStart + 1, [
      ['enter', content, context],
      ['enter', text, context],
      ['exit', text, context],
      ['exit', content, context]
    ]);
  }

  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeHeadingAtx(effects, ok$1, nok) {
  let size = 0;

  return start

  /**
   * Start of a heading (atx).
   *
   * ```markdown
   * > | ## aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // To do: parse indent like `markdown-rs`.
    effects.enter(types.atxHeading);
    return before(code)
  }

  /**
   * After optional whitespace, at `#`.
   *
   * ```markdown
   * > | ## aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    ok(code === codes.numberSign, 'expected `#`');
    effects.enter(types.atxHeadingSequence);
    return sequenceOpen(code)
  }

  /**
   * In opening sequence.
   *
   * ```markdown
   * > | ## aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function sequenceOpen(code) {
    if (
      code === codes.numberSign &&
      size++ < constants.atxHeadingOpeningFenceSizeMax
    ) {
      effects.consume(code);
      return sequenceOpen
    }

    // Always at least one `#`.
    if (code === codes.eof || markdownLineEndingOrSpace(code)) {
      effects.exit(types.atxHeadingSequence);
      return atBreak(code)
    }

    return nok(code)
  }

  /**
   * After something, before something else.
   *
   * ```markdown
   * > | ## aa
   *       ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === codes.numberSign) {
      effects.enter(types.atxHeadingSequence);
      return sequenceFurther(code)
    }

    if (code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types.atxHeading);
      // To do: interrupt like `markdown-rs`.
      // // Feel free to interrupt.
      // tokenizer.interrupt = false
      return ok$1(code)
    }

    if (markdownSpace(code)) {
      return factorySpace(effects, atBreak, types.whitespace)(code)
    }

    // To do: generate `data` tokens, add the `text` token later.
    // Needs edit map, see: `markdown.rs`.
    effects.enter(types.atxHeadingText);
    return data(code)
  }

  /**
   * In further sequence (after whitespace).
   *
   * Could be normal “visible” hashes in the heading or a final sequence.
   *
   * ```markdown
   * > | ## aa ##
   *           ^
   * ```
   *
   * @type {State}
   */
  function sequenceFurther(code) {
    if (code === codes.numberSign) {
      effects.consume(code);
      return sequenceFurther
    }

    effects.exit(types.atxHeadingSequence);
    return atBreak(code)
  }

  /**
   * In text.
   *
   * ```markdown
   * > | ## aa
   *        ^
   * ```
   *
   * @type {State}
   */
  function data(code) {
    if (
      code === codes.eof ||
      code === codes.numberSign ||
      markdownLineEndingOrSpace(code)
    ) {
      effects.exit(types.atxHeadingText);
      return atBreak(code)
    }

    effects.consume(code);
    return data
  }
}

/**
 * List of lowercase HTML “block” tag names.
 *
 * The list, when parsing HTML (flow), results in more relaxed rules (condition
 * 6).
 * Because they are known blocks, the HTML-like syntax doesn’t have to be
 * strictly parsed.
 * For tag names not in this list, a more strict algorithm (condition 7) is used
 * to detect whether the HTML-like syntax is seen as HTML (flow) or not.
 *
 * This is copied from:
 * <https://spec.commonmark.org/0.30/#html-blocks>.
 *
 * > 👉 **Note**: `search` was added in `CommonMark@0.31`.
 */
const htmlBlockNames = [
  'address',
  'article',
  'aside',
  'base',
  'basefont',
  'blockquote',
  'body',
  'caption',
  'center',
  'col',
  'colgroup',
  'dd',
  'details',
  'dialog',
  'dir',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'frame',
  'frameset',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hr',
  'html',
  'iframe',
  'legend',
  'li',
  'link',
  'main',
  'menu',
  'menuitem',
  'nav',
  'noframes',
  'ol',
  'optgroup',
  'option',
  'p',
  'param',
  'search',
  'section',
  'summary',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'title',
  'tr',
  'track',
  'ul'
];

/**
 * List of lowercase HTML “raw” tag names.
 *
 * The list, when parsing HTML (flow), results in HTML that can include lines
 * without exiting, until a closing tag also in this list is found (condition
 * 1).
 *
 * This module is copied from:
 * <https://spec.commonmark.org/0.30/#html-blocks>.
 *
 * > 👉 **Note**: `textarea` was added in `CommonMark@0.30`.
 */
const htmlRawNames = ['pre', 'script', 'style', 'textarea'];

/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const htmlFlow = {
  name: 'htmlFlow',
  tokenize: tokenizeHtmlFlow,
  resolveTo: resolveToHtmlFlow,
  concrete: true
};

/** @type {Construct} */
const blankLineBefore = {tokenize: tokenizeBlankLineBefore, partial: true};
const nonLazyContinuationStart = {
  tokenize: tokenizeNonLazyContinuationStart,
  partial: true
};

/** @type {Resolver} */
function resolveToHtmlFlow(events) {
  let index = events.length;

  while (index--) {
    if (
      events[index][0] === 'enter' &&
      events[index][1].type === types.htmlFlow
    ) {
      break
    }
  }

  if (index > 1 && events[index - 2][1].type === types.linePrefix) {
    // Add the prefix start to the HTML token.
    events[index][1].start = events[index - 2][1].start;
    // Add the prefix start to the HTML line token.
    events[index + 1][1].start = events[index - 2][1].start;
    // Remove the line prefix.
    events.splice(index - 2, 2);
  }

  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeHtmlFlow(effects, ok$1, nok) {
  const self = this;
  /** @type {number} */
  let marker;
  /** @type {boolean} */
  let closingTag;
  /** @type {string} */
  let buffer;
  /** @type {number} */
  let index;
  /** @type {Code} */
  let markerB;

  return start

  /**
   * Start of HTML (flow).
   *
   * ```markdown
   * > | <x />
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // To do: parse indent like `markdown-rs`.
    return before(code)
  }

  /**
   * At `<`, after optional whitespace.
   *
   * ```markdown
   * > | <x />
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    ok(code === codes.lessThan, 'expected `<`');
    effects.enter(types.htmlFlow);
    effects.enter(types.htmlFlowData);
    effects.consume(code);
    return open
  }

  /**
   * After `<`, at tag name or other stuff.
   *
   * ```markdown
   * > | <x />
   *      ^
   * > | <!doctype>
   *      ^
   * > | <!--xxx-->
   *      ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === codes.exclamationMark) {
      effects.consume(code);
      return declarationOpen
    }

    if (code === codes.slash) {
      effects.consume(code);
      closingTag = true;
      return tagCloseStart
    }

    if (code === codes.questionMark) {
      effects.consume(code);
      marker = constants.htmlInstruction;
      // To do:
      // tokenizer.concrete = true
      // To do: use `markdown-rs` style interrupt.
      // While we’re in an instruction instead of a declaration, we’re on a `?`
      // right now, so we do need to search for `>`, similar to declarations.
      return self.interrupt ? ok$1 : continuationDeclarationInside
    }

    // ASCII alphabetical.
    if (asciiAlpha(code)) {
      effects.consume(code);
      // @ts-expect-error: not null.
      buffer = String.fromCharCode(code);
      return tagName
    }

    return nok(code)
  }

  /**
   * After `<!`, at declaration, comment, or CDATA.
   *
   * ```markdown
   * > | <!doctype>
   *       ^
   * > | <!--xxx-->
   *       ^
   * > | <![CDATA[>&<]]>
   *       ^
   * ```
   *
   * @type {State}
   */
  function declarationOpen(code) {
    if (code === codes.dash) {
      effects.consume(code);
      marker = constants.htmlComment;
      return commentOpenInside
    }

    if (code === codes.leftSquareBracket) {
      effects.consume(code);
      marker = constants.htmlCdata;
      index = 0;
      return cdataOpenInside
    }

    // ASCII alphabetical.
    if (asciiAlpha(code)) {
      effects.consume(code);
      marker = constants.htmlDeclaration;
      // // Do not form containers.
      // tokenizer.concrete = true
      return self.interrupt ? ok$1 : continuationDeclarationInside
    }

    return nok(code)
  }

  /**
   * After `<!-`, inside a comment, at another `-`.
   *
   * ```markdown
   * > | <!--xxx-->
   *        ^
   * ```
   *
   * @type {State}
   */
  function commentOpenInside(code) {
    if (code === codes.dash) {
      effects.consume(code);
      // // Do not form containers.
      // tokenizer.concrete = true
      return self.interrupt ? ok$1 : continuationDeclarationInside
    }

    return nok(code)
  }

  /**
   * After `<![`, inside CDATA, expecting `CDATA[`.
   *
   * ```markdown
   * > | <![CDATA[>&<]]>
   *        ^^^^^^
   * ```
   *
   * @type {State}
   */
  function cdataOpenInside(code) {
    const value = constants.cdataOpeningString;

    if (code === value.charCodeAt(index++)) {
      effects.consume(code);

      if (index === value.length) {
        // // Do not form containers.
        // tokenizer.concrete = true
        return self.interrupt ? ok$1 : continuation
      }

      return cdataOpenInside
    }

    return nok(code)
  }

  /**
   * After `</`, in closing tag, at tag name.
   *
   * ```markdown
   * > | </x>
   *       ^
   * ```
   *
   * @type {State}
   */
  function tagCloseStart(code) {
    if (asciiAlpha(code)) {
      effects.consume(code);
      // @ts-expect-error: not null.
      buffer = String.fromCharCode(code);
      return tagName
    }

    return nok(code)
  }

  /**
   * In tag name.
   *
   * ```markdown
   * > | <ab>
   *      ^^
   * > | </ab>
   *       ^^
   * ```
   *
   * @type {State}
   */
  function tagName(code) {
    if (
      code === codes.eof ||
      code === codes.slash ||
      code === codes.greaterThan ||
      markdownLineEndingOrSpace(code)
    ) {
      const slash = code === codes.slash;
      const name = buffer.toLowerCase();

      if (!slash && !closingTag && htmlRawNames.includes(name)) {
        marker = constants.htmlRaw;
        // // Do not form containers.
        // tokenizer.concrete = true
        return self.interrupt ? ok$1(code) : continuation(code)
      }

      if (htmlBlockNames.includes(buffer.toLowerCase())) {
        marker = constants.htmlBasic;

        if (slash) {
          effects.consume(code);
          return basicSelfClosing
        }

        // // Do not form containers.
        // tokenizer.concrete = true
        return self.interrupt ? ok$1(code) : continuation(code)
      }

      marker = constants.htmlComplete;
      // Do not support complete HTML when interrupting.
      return self.interrupt && !self.parser.lazy[self.now().line]
        ? nok(code)
        : closingTag
        ? completeClosingTagAfter(code)
        : completeAttributeNameBefore(code)
    }

    // ASCII alphanumerical and `-`.
    if (code === codes.dash || asciiAlphanumeric(code)) {
      effects.consume(code);
      buffer += String.fromCharCode(code);
      return tagName
    }

    return nok(code)
  }

  /**
   * After closing slash of a basic tag name.
   *
   * ```markdown
   * > | <div/>
   *          ^
   * ```
   *
   * @type {State}
   */
  function basicSelfClosing(code) {
    if (code === codes.greaterThan) {
      effects.consume(code);
      // // Do not form containers.
      // tokenizer.concrete = true
      return self.interrupt ? ok$1 : continuation
    }

    return nok(code)
  }

  /**
   * After closing slash of a complete tag name.
   *
   * ```markdown
   * > | <x/>
   *        ^
   * ```
   *
   * @type {State}
   */
  function completeClosingTagAfter(code) {
    if (markdownSpace(code)) {
      effects.consume(code);
      return completeClosingTagAfter
    }

    return completeEnd(code)
  }

  /**
   * At an attribute name.
   *
   * At first, this state is used after a complete tag name, after whitespace,
   * where it expects optional attributes or the end of the tag.
   * It is also reused after attributes, when expecting more optional
   * attributes.
   *
   * ```markdown
   * > | <a />
   *        ^
   * > | <a :b>
   *        ^
   * > | <a _b>
   *        ^
   * > | <a b>
   *        ^
   * > | <a >
   *        ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeNameBefore(code) {
    if (code === codes.slash) {
      effects.consume(code);
      return completeEnd
    }

    // ASCII alphanumerical and `:` and `_`.
    if (code === codes.colon || code === codes.underscore || asciiAlpha(code)) {
      effects.consume(code);
      return completeAttributeName
    }

    if (markdownSpace(code)) {
      effects.consume(code);
      return completeAttributeNameBefore
    }

    return completeEnd(code)
  }

  /**
   * In attribute name.
   *
   * ```markdown
   * > | <a :b>
   *         ^
   * > | <a _b>
   *         ^
   * > | <a b>
   *         ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeName(code) {
    // ASCII alphanumerical and `-`, `.`, `:`, and `_`.
    if (
      code === codes.dash ||
      code === codes.dot ||
      code === codes.colon ||
      code === codes.underscore ||
      asciiAlphanumeric(code)
    ) {
      effects.consume(code);
      return completeAttributeName
    }

    return completeAttributeNameAfter(code)
  }

  /**
   * After attribute name, at an optional initializer, the end of the tag, or
   * whitespace.
   *
   * ```markdown
   * > | <a b>
   *         ^
   * > | <a b=c>
   *         ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeNameAfter(code) {
    if (code === codes.equalsTo) {
      effects.consume(code);
      return completeAttributeValueBefore
    }

    if (markdownSpace(code)) {
      effects.consume(code);
      return completeAttributeNameAfter
    }

    return completeAttributeNameBefore(code)
  }

  /**
   * Before unquoted, double quoted, or single quoted attribute value, allowing
   * whitespace.
   *
   * ```markdown
   * > | <a b=c>
   *          ^
   * > | <a b="c">
   *          ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueBefore(code) {
    if (
      code === codes.eof ||
      code === codes.lessThan ||
      code === codes.equalsTo ||
      code === codes.greaterThan ||
      code === codes.graveAccent
    ) {
      return nok(code)
    }

    if (code === codes.quotationMark || code === codes.apostrophe) {
      effects.consume(code);
      markerB = code;
      return completeAttributeValueQuoted
    }

    if (markdownSpace(code)) {
      effects.consume(code);
      return completeAttributeValueBefore
    }

    return completeAttributeValueUnquoted(code)
  }

  /**
   * In double or single quoted attribute value.
   *
   * ```markdown
   * > | <a b="c">
   *           ^
   * > | <a b='c'>
   *           ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueQuoted(code) {
    if (code === markerB) {
      effects.consume(code);
      markerB = null;
      return completeAttributeValueQuotedAfter
    }

    if (code === codes.eof || markdownLineEnding(code)) {
      return nok(code)
    }

    effects.consume(code);
    return completeAttributeValueQuoted
  }

  /**
   * In unquoted attribute value.
   *
   * ```markdown
   * > | <a b=c>
   *          ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueUnquoted(code) {
    if (
      code === codes.eof ||
      code === codes.quotationMark ||
      code === codes.apostrophe ||
      code === codes.slash ||
      code === codes.lessThan ||
      code === codes.equalsTo ||
      code === codes.greaterThan ||
      code === codes.graveAccent ||
      markdownLineEndingOrSpace(code)
    ) {
      return completeAttributeNameAfter(code)
    }

    effects.consume(code);
    return completeAttributeValueUnquoted
  }

  /**
   * After double or single quoted attribute value, before whitespace or the
   * end of the tag.
   *
   * ```markdown
   * > | <a b="c">
   *            ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueQuotedAfter(code) {
    if (
      code === codes.slash ||
      code === codes.greaterThan ||
      markdownSpace(code)
    ) {
      return completeAttributeNameBefore(code)
    }

    return nok(code)
  }

  /**
   * In certain circumstances of a complete tag where only an `>` is allowed.
   *
   * ```markdown
   * > | <a b="c">
   *             ^
   * ```
   *
   * @type {State}
   */
  function completeEnd(code) {
    if (code === codes.greaterThan) {
      effects.consume(code);
      return completeAfter
    }

    return nok(code)
  }

  /**
   * After `>` in a complete tag.
   *
   * ```markdown
   * > | <x>
   *        ^
   * ```
   *
   * @type {State}
   */
  function completeAfter(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      // // Do not form containers.
      // tokenizer.concrete = true
      return continuation(code)
    }

    if (markdownSpace(code)) {
      effects.consume(code);
      return completeAfter
    }

    return nok(code)
  }

  /**
   * In continuation of any HTML kind.
   *
   * ```markdown
   * > | <!--xxx-->
   *          ^
   * ```
   *
   * @type {State}
   */
  function continuation(code) {
    if (code === codes.dash && marker === constants.htmlComment) {
      effects.consume(code);
      return continuationCommentInside
    }

    if (code === codes.lessThan && marker === constants.htmlRaw) {
      effects.consume(code);
      return continuationRawTagOpen
    }

    if (code === codes.greaterThan && marker === constants.htmlDeclaration) {
      effects.consume(code);
      return continuationClose
    }

    if (code === codes.questionMark && marker === constants.htmlInstruction) {
      effects.consume(code);
      return continuationDeclarationInside
    }

    if (code === codes.rightSquareBracket && marker === constants.htmlCdata) {
      effects.consume(code);
      return continuationCdataInside
    }

    if (
      markdownLineEnding(code) &&
      (marker === constants.htmlBasic || marker === constants.htmlComplete)
    ) {
      effects.exit(types.htmlFlowData);
      return effects.check(
        blankLineBefore,
        continuationAfter,
        continuationStart
      )(code)
    }

    if (code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types.htmlFlowData);
      return continuationStart(code)
    }

    effects.consume(code);
    return continuation
  }

  /**
   * In continuation, at eol.
   *
   * ```markdown
   * > | <x>
   *        ^
   *   | asd
   * ```
   *
   * @type {State}
   */
  function continuationStart(code) {
    return effects.check(
      nonLazyContinuationStart,
      continuationStartNonLazy,
      continuationAfter
    )(code)
  }

  /**
   * In continuation, at eol, before non-lazy content.
   *
   * ```markdown
   * > | <x>
   *        ^
   *   | asd
   * ```
   *
   * @type {State}
   */
  function continuationStartNonLazy(code) {
    ok(markdownLineEnding(code));
    effects.enter(types.lineEnding);
    effects.consume(code);
    effects.exit(types.lineEnding);
    return continuationBefore
  }

  /**
   * In continuation, before non-lazy content.
   *
   * ```markdown
   *   | <x>
   * > | asd
   *     ^
   * ```
   *
   * @type {State}
   */
  function continuationBefore(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      return continuationStart(code)
    }

    effects.enter(types.htmlFlowData);
    return continuation(code)
  }

  /**
   * In comment continuation, after one `-`, expecting another.
   *
   * ```markdown
   * > | <!--xxx-->
   *             ^
   * ```
   *
   * @type {State}
   */
  function continuationCommentInside(code) {
    if (code === codes.dash) {
      effects.consume(code);
      return continuationDeclarationInside
    }

    return continuation(code)
  }

  /**
   * In raw continuation, after `<`, at `/`.
   *
   * ```markdown
   * > | <script>console.log(1)</script>
   *                            ^
   * ```
   *
   * @type {State}
   */
  function continuationRawTagOpen(code) {
    if (code === codes.slash) {
      effects.consume(code);
      buffer = '';
      return continuationRawEndTag
    }

    return continuation(code)
  }

  /**
   * In raw continuation, after `</`, in a raw tag name.
   *
   * ```markdown
   * > | <script>console.log(1)</script>
   *                             ^^^^^^
   * ```
   *
   * @type {State}
   */
  function continuationRawEndTag(code) {
    if (code === codes.greaterThan) {
      const name = buffer.toLowerCase();

      if (htmlRawNames.includes(name)) {
        effects.consume(code);
        return continuationClose
      }

      return continuation(code)
    }

    if (asciiAlpha(code) && buffer.length < constants.htmlRawSizeMax) {
      effects.consume(code);
      // @ts-expect-error: not null.
      buffer += String.fromCharCode(code);
      return continuationRawEndTag
    }

    return continuation(code)
  }

  /**
   * In cdata continuation, after `]`, expecting `]>`.
   *
   * ```markdown
   * > | <![CDATA[>&<]]>
   *                  ^
   * ```
   *
   * @type {State}
   */
  function continuationCdataInside(code) {
    if (code === codes.rightSquareBracket) {
      effects.consume(code);
      return continuationDeclarationInside
    }

    return continuation(code)
  }

  /**
   * In declaration or instruction continuation, at `>`.
   *
   * ```markdown
   * > | <!-->
   *         ^
   * > | <?>
   *       ^
   * > | <!q>
   *        ^
   * > | <!--ab-->
   *             ^
   * > | <![CDATA[>&<]]>
   *                   ^
   * ```
   *
   * @type {State}
   */
  function continuationDeclarationInside(code) {
    if (code === codes.greaterThan) {
      effects.consume(code);
      return continuationClose
    }

    // More dashes.
    if (code === codes.dash && marker === constants.htmlComment) {
      effects.consume(code);
      return continuationDeclarationInside
    }

    return continuation(code)
  }

  /**
   * In closed continuation: everything we get until the eol/eof is part of it.
   *
   * ```markdown
   * > | <!doctype>
   *               ^
   * ```
   *
   * @type {State}
   */
  function continuationClose(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types.htmlFlowData);
      return continuationAfter(code)
    }

    effects.consume(code);
    return continuationClose
  }

  /**
   * Done.
   *
   * ```markdown
   * > | <!doctype>
   *               ^
   * ```
   *
   * @type {State}
   */
  function continuationAfter(code) {
    effects.exit(types.htmlFlow);
    // // Feel free to interrupt.
    // tokenizer.interrupt = false
    // // No longer concrete.
    // tokenizer.concrete = false
    return ok$1(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeNonLazyContinuationStart(effects, ok, nok) {
  const self = this;

  return start

  /**
   * At eol, before continuation.
   *
   * ```markdown
   * > | * ```js
   *            ^
   *   | b
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (markdownLineEnding(code)) {
      effects.enter(types.lineEnding);
      effects.consume(code);
      effects.exit(types.lineEnding);
      return after
    }

    return nok(code)
  }

  /**
   * A continuation.
   *
   * ```markdown
   *   | * ```js
   * > | b
   *     ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    return self.parser.lazy[self.now().line] ? nok(code) : ok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeBlankLineBefore(effects, ok$1, nok) {
  return start

  /**
   * Before eol, expecting blank line.
   *
   * ```markdown
   * > | <div>
   *          ^
   *   |
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ok(markdownLineEnding(code), 'expected a line ending');
    effects.enter(types.lineEnding);
    effects.consume(code);
    effects.exit(types.lineEnding);
    return effects.attempt(blankLine, ok$1, nok)
  }
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const htmlText = {name: 'htmlText', tokenize: tokenizeHtmlText};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeHtmlText(effects, ok$1, nok) {
  const self = this;
  /** @type {NonNullable<Code> | undefined} */
  let marker;
  /** @type {number} */
  let index;
  /** @type {State} */
  let returnState;

  return start

  /**
   * Start of HTML (text).
   *
   * ```markdown
   * > | a <b> c
   *       ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ok(code === codes.lessThan, 'expected `<`');
    effects.enter(types.htmlText);
    effects.enter(types.htmlTextData);
    effects.consume(code);
    return open
  }

  /**
   * After `<`, at tag name or other stuff.
   *
   * ```markdown
   * > | a <b> c
   *        ^
   * > | a <!doctype> c
   *        ^
   * > | a <!--b--> c
   *        ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === codes.exclamationMark) {
      effects.consume(code);
      return declarationOpen
    }

    if (code === codes.slash) {
      effects.consume(code);
      return tagCloseStart
    }

    if (code === codes.questionMark) {
      effects.consume(code);
      return instruction
    }

    // ASCII alphabetical.
    if (asciiAlpha(code)) {
      effects.consume(code);
      return tagOpen
    }

    return nok(code)
  }

  /**
   * After `<!`, at declaration, comment, or CDATA.
   *
   * ```markdown
   * > | a <!doctype> c
   *         ^
   * > | a <!--b--> c
   *         ^
   * > | a <![CDATA[>&<]]> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function declarationOpen(code) {
    if (code === codes.dash) {
      effects.consume(code);
      return commentOpenInside
    }

    if (code === codes.leftSquareBracket) {
      effects.consume(code);
      index = 0;
      return cdataOpenInside
    }

    if (asciiAlpha(code)) {
      effects.consume(code);
      return declaration
    }

    return nok(code)
  }

  /**
   * In a comment, after `<!-`, at another `-`.
   *
   * ```markdown
   * > | a <!--b--> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function commentOpenInside(code) {
    if (code === codes.dash) {
      effects.consume(code);
      return commentEnd
    }

    return nok(code)
  }

  /**
   * In comment.
   *
   * ```markdown
   * > | a <!--b--> c
   *           ^
   * ```
   *
   * @type {State}
   */
  function comment(code) {
    if (code === codes.eof) {
      return nok(code)
    }

    if (code === codes.dash) {
      effects.consume(code);
      return commentClose
    }

    if (markdownLineEnding(code)) {
      returnState = comment;
      return lineEndingBefore(code)
    }

    effects.consume(code);
    return comment
  }

  /**
   * In comment, after `-`.
   *
   * ```markdown
   * > | a <!--b--> c
   *             ^
   * ```
   *
   * @type {State}
   */
  function commentClose(code) {
    if (code === codes.dash) {
      effects.consume(code);
      return commentEnd
    }

    return comment(code)
  }

  /**
   * In comment, after `--`.
   *
   * ```markdown
   * > | a <!--b--> c
   *              ^
   * ```
   *
   * @type {State}
   */
  function commentEnd(code) {
    return code === codes.greaterThan
      ? end(code)
      : code === codes.dash
      ? commentClose(code)
      : comment(code)
  }

  /**
   * After `<![`, in CDATA, expecting `CDATA[`.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *          ^^^^^^
   * ```
   *
   * @type {State}
   */
  function cdataOpenInside(code) {
    const value = constants.cdataOpeningString;

    if (code === value.charCodeAt(index++)) {
      effects.consume(code);
      return index === value.length ? cdata : cdataOpenInside
    }

    return nok(code)
  }

  /**
   * In CDATA.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *                ^^^
   * ```
   *
   * @type {State}
   */
  function cdata(code) {
    if (code === codes.eof) {
      return nok(code)
    }

    if (code === codes.rightSquareBracket) {
      effects.consume(code);
      return cdataClose
    }

    if (markdownLineEnding(code)) {
      returnState = cdata;
      return lineEndingBefore(code)
    }

    effects.consume(code);
    return cdata
  }

  /**
   * In CDATA, after `]`, at another `]`.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *                    ^
   * ```
   *
   * @type {State}
   */
  function cdataClose(code) {
    if (code === codes.rightSquareBracket) {
      effects.consume(code);
      return cdataEnd
    }

    return cdata(code)
  }

  /**
   * In CDATA, after `]]`, at `>`.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *                     ^
   * ```
   *
   * @type {State}
   */
  function cdataEnd(code) {
    if (code === codes.greaterThan) {
      return end(code)
    }

    if (code === codes.rightSquareBracket) {
      effects.consume(code);
      return cdataEnd
    }

    return cdata(code)
  }

  /**
   * In declaration.
   *
   * ```markdown
   * > | a <!b> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function declaration(code) {
    if (code === codes.eof || code === codes.greaterThan) {
      return end(code)
    }

    if (markdownLineEnding(code)) {
      returnState = declaration;
      return lineEndingBefore(code)
    }

    effects.consume(code);
    return declaration
  }

  /**
   * In instruction.
   *
   * ```markdown
   * > | a <?b?> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function instruction(code) {
    if (code === codes.eof) {
      return nok(code)
    }

    if (code === codes.questionMark) {
      effects.consume(code);
      return instructionClose
    }

    if (markdownLineEnding(code)) {
      returnState = instruction;
      return lineEndingBefore(code)
    }

    effects.consume(code);
    return instruction
  }

  /**
   * In instruction, after `?`, at `>`.
   *
   * ```markdown
   * > | a <?b?> c
   *           ^
   * ```
   *
   * @type {State}
   */
  function instructionClose(code) {
    return code === codes.greaterThan ? end(code) : instruction(code)
  }

  /**
   * After `</`, in closing tag, at tag name.
   *
   * ```markdown
   * > | a </b> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function tagCloseStart(code) {
    // ASCII alphabetical.
    if (asciiAlpha(code)) {
      effects.consume(code);
      return tagClose
    }

    return nok(code)
  }

  /**
   * After `</x`, in a tag name.
   *
   * ```markdown
   * > | a </b> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function tagClose(code) {
    // ASCII alphanumerical and `-`.
    if (code === codes.dash || asciiAlphanumeric(code)) {
      effects.consume(code);
      return tagClose
    }

    return tagCloseBetween(code)
  }

  /**
   * In closing tag, after tag name.
   *
   * ```markdown
   * > | a </b> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function tagCloseBetween(code) {
    if (markdownLineEnding(code)) {
      returnState = tagCloseBetween;
      return lineEndingBefore(code)
    }

    if (markdownSpace(code)) {
      effects.consume(code);
      return tagCloseBetween
    }

    return end(code)
  }

  /**
   * After `<x`, in opening tag name.
   *
   * ```markdown
   * > | a <b> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function tagOpen(code) {
    // ASCII alphanumerical and `-`.
    if (code === codes.dash || asciiAlphanumeric(code)) {
      effects.consume(code);
      return tagOpen
    }

    if (
      code === codes.slash ||
      code === codes.greaterThan ||
      markdownLineEndingOrSpace(code)
    ) {
      return tagOpenBetween(code)
    }

    return nok(code)
  }

  /**
   * In opening tag, after tag name.
   *
   * ```markdown
   * > | a <b> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function tagOpenBetween(code) {
    if (code === codes.slash) {
      effects.consume(code);
      return end
    }

    // ASCII alphabetical and `:` and `_`.
    if (code === codes.colon || code === codes.underscore || asciiAlpha(code)) {
      effects.consume(code);
      return tagOpenAttributeName
    }

    if (markdownLineEnding(code)) {
      returnState = tagOpenBetween;
      return lineEndingBefore(code)
    }

    if (markdownSpace(code)) {
      effects.consume(code);
      return tagOpenBetween
    }

    return end(code)
  }

  /**
   * In attribute name.
   *
   * ```markdown
   * > | a <b c> d
   *          ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeName(code) {
    // ASCII alphabetical and `-`, `.`, `:`, and `_`.
    if (
      code === codes.dash ||
      code === codes.dot ||
      code === codes.colon ||
      code === codes.underscore ||
      asciiAlphanumeric(code)
    ) {
      effects.consume(code);
      return tagOpenAttributeName
    }

    return tagOpenAttributeNameAfter(code)
  }

  /**
   * After attribute name, before initializer, the end of the tag, or
   * whitespace.
   *
   * ```markdown
   * > | a <b c> d
   *           ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeNameAfter(code) {
    if (code === codes.equalsTo) {
      effects.consume(code);
      return tagOpenAttributeValueBefore
    }

    if (markdownLineEnding(code)) {
      returnState = tagOpenAttributeNameAfter;
      return lineEndingBefore(code)
    }

    if (markdownSpace(code)) {
      effects.consume(code);
      return tagOpenAttributeNameAfter
    }

    return tagOpenBetween(code)
  }

  /**
   * Before unquoted, double quoted, or single quoted attribute value, allowing
   * whitespace.
   *
   * ```markdown
   * > | a <b c=d> e
   *            ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueBefore(code) {
    if (
      code === codes.eof ||
      code === codes.lessThan ||
      code === codes.equalsTo ||
      code === codes.greaterThan ||
      code === codes.graveAccent
    ) {
      return nok(code)
    }

    if (code === codes.quotationMark || code === codes.apostrophe) {
      effects.consume(code);
      marker = code;
      return tagOpenAttributeValueQuoted
    }

    if (markdownLineEnding(code)) {
      returnState = tagOpenAttributeValueBefore;
      return lineEndingBefore(code)
    }

    if (markdownSpace(code)) {
      effects.consume(code);
      return tagOpenAttributeValueBefore
    }

    effects.consume(code);
    return tagOpenAttributeValueUnquoted
  }

  /**
   * In double or single quoted attribute value.
   *
   * ```markdown
   * > | a <b c="d"> e
   *             ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueQuoted(code) {
    if (code === marker) {
      effects.consume(code);
      marker = undefined;
      return tagOpenAttributeValueQuotedAfter
    }

    if (code === codes.eof) {
      return nok(code)
    }

    if (markdownLineEnding(code)) {
      returnState = tagOpenAttributeValueQuoted;
      return lineEndingBefore(code)
    }

    effects.consume(code);
    return tagOpenAttributeValueQuoted
  }

  /**
   * In unquoted attribute value.
   *
   * ```markdown
   * > | a <b c=d> e
   *            ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueUnquoted(code) {
    if (
      code === codes.eof ||
      code === codes.quotationMark ||
      code === codes.apostrophe ||
      code === codes.lessThan ||
      code === codes.equalsTo ||
      code === codes.graveAccent
    ) {
      return nok(code)
    }

    if (
      code === codes.slash ||
      code === codes.greaterThan ||
      markdownLineEndingOrSpace(code)
    ) {
      return tagOpenBetween(code)
    }

    effects.consume(code);
    return tagOpenAttributeValueUnquoted
  }

  /**
   * After double or single quoted attribute value, before whitespace or the end
   * of the tag.
   *
   * ```markdown
   * > | a <b c="d"> e
   *               ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueQuotedAfter(code) {
    if (
      code === codes.slash ||
      code === codes.greaterThan ||
      markdownLineEndingOrSpace(code)
    ) {
      return tagOpenBetween(code)
    }

    return nok(code)
  }

  /**
   * In certain circumstances of a tag where only an `>` is allowed.
   *
   * ```markdown
   * > | a <b c="d"> e
   *               ^
   * ```
   *
   * @type {State}
   */
  function end(code) {
    if (code === codes.greaterThan) {
      effects.consume(code);
      effects.exit(types.htmlTextData);
      effects.exit(types.htmlText);
      return ok$1
    }

    return nok(code)
  }

  /**
   * At eol.
   *
   * > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
   * > empty tokens.
   *
   * ```markdown
   * > | a <!--a
   *            ^
   *   | b-->
   * ```
   *
   * @type {State}
   */
  function lineEndingBefore(code) {
    ok(returnState, 'expected return state');
    ok(markdownLineEnding(code), 'expected eol');
    effects.exit(types.htmlTextData);
    effects.enter(types.lineEnding);
    effects.consume(code);
    effects.exit(types.lineEnding);
    return lineEndingAfter
  }

  /**
   * After eol, at optional whitespace.
   *
   * > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
   * > empty tokens.
   *
   * ```markdown
   *   | a <!--a
   * > | b-->
   *     ^
   * ```
   *
   * @type {State}
   */
  function lineEndingAfter(code) {
    // Always populated by defaults.
    ok(
      self.parser.constructs.disable.null,
      'expected `disable.null` to be populated'
    );
    return markdownSpace(code)
      ? factorySpace(
          effects,
          lineEndingAfterPrefix,
          types.linePrefix,
          self.parser.constructs.disable.null.includes('codeIndented')
            ? undefined
            : constants.tabSize
        )(code)
      : lineEndingAfterPrefix(code)
  }

  /**
   * After eol, after optional whitespace.
   *
   * > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
   * > empty tokens.
   *
   * ```markdown
   *   | a <!--a
   * > | b-->
   *     ^
   * ```
   *
   * @type {State}
   */
  function lineEndingAfterPrefix(code) {
    effects.enter(types.htmlTextData);
    return returnState(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const labelEnd = {
  name: 'labelEnd',
  tokenize: tokenizeLabelEnd,
  resolveTo: resolveToLabelEnd,
  resolveAll: resolveAllLabelEnd
};

/** @type {Construct} */
const resourceConstruct = {tokenize: tokenizeResource};
/** @type {Construct} */
const referenceFullConstruct = {tokenize: tokenizeReferenceFull};
/** @type {Construct} */
const referenceCollapsedConstruct = {tokenize: tokenizeReferenceCollapsed};

/** @type {Resolver} */
function resolveAllLabelEnd(events) {
  let index = -1;

  while (++index < events.length) {
    const token = events[index][1];

    if (
      token.type === types.labelImage ||
      token.type === types.labelLink ||
      token.type === types.labelEnd
    ) {
      // Remove the marker.
      events.splice(index + 1, token.type === types.labelImage ? 4 : 2);
      token.type = types.data;
      index++;
    }
  }

  return events
}

/** @type {Resolver} */
function resolveToLabelEnd(events, context) {
  let index = events.length;
  let offset = 0;
  /** @type {Token} */
  let token;
  /** @type {number | undefined} */
  let open;
  /** @type {number | undefined} */
  let close;
  /** @type {Array<Event>} */
  let media;

  // Find an opening.
  while (index--) {
    token = events[index][1];

    if (open) {
      // If we see another link, or inactive link label, we’ve been here before.
      if (
        token.type === types.link ||
        (token.type === types.labelLink && token._inactive)
      ) {
        break
      }

      // Mark other link openings as inactive, as we can’t have links in
      // links.
      if (events[index][0] === 'enter' && token.type === types.labelLink) {
        token._inactive = true;
      }
    } else if (close) {
      if (
        events[index][0] === 'enter' &&
        (token.type === types.labelImage || token.type === types.labelLink) &&
        !token._balanced
      ) {
        open = index;

        if (token.type !== types.labelLink) {
          offset = 2;
          break
        }
      }
    } else if (token.type === types.labelEnd) {
      close = index;
    }
  }

  ok(open !== undefined, '`open` is supposed to be found');
  ok(close !== undefined, '`close` is supposed to be found');

  const group = {
    type: events[open][1].type === types.labelLink ? types.link : types.image,
    start: Object.assign({}, events[open][1].start),
    end: Object.assign({}, events[events.length - 1][1].end)
  };

  const label = {
    type: types.label,
    start: Object.assign({}, events[open][1].start),
    end: Object.assign({}, events[close][1].end)
  };

  const text = {
    type: types.labelText,
    start: Object.assign({}, events[open + offset + 2][1].end),
    end: Object.assign({}, events[close - 2][1].start)
  };

  media = [
    ['enter', group, context],
    ['enter', label, context]
  ];

  // Opening marker.
  media = push(media, events.slice(open + 1, open + offset + 3));

  // Text open.
  media = push(media, [['enter', text, context]]);

  // Always populated by defaults.
  ok(
    context.parser.constructs.insideSpan.null,
    'expected `insideSpan.null` to be populated'
  );
  // Between.
  media = push(
    media,
    resolveAll(
      context.parser.constructs.insideSpan.null,
      events.slice(open + offset + 4, close - 3),
      context
    )
  );

  // Text close, marker close, label close.
  media = push(media, [
    ['exit', text, context],
    events[close - 2],
    events[close - 1],
    ['exit', label, context]
  ]);

  // Reference, resource, or so.
  media = push(media, events.slice(close + 1));

  // Media close.
  media = push(media, [['exit', group, context]]);

  splice(events, open, events.length, media);

  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeLabelEnd(effects, ok$1, nok) {
  const self = this;
  let index = self.events.length;
  /** @type {Token} */
  let labelStart;
  /** @type {boolean} */
  let defined;

  // Find an opening.
  while (index--) {
    if (
      (self.events[index][1].type === types.labelImage ||
        self.events[index][1].type === types.labelLink) &&
      !self.events[index][1]._balanced
    ) {
      labelStart = self.events[index][1];
      break
    }
  }

  return start

  /**
   * Start of label end.
   *
   * ```markdown
   * > | [a](b) c
   *       ^
   * > | [a][b] c
   *       ^
   * > | [a][] b
   *       ^
   * > | [a] b
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ok(code === codes.rightSquareBracket, 'expected `]`');

    // If there is not an okay opening.
    if (!labelStart) {
      return nok(code)
    }

    // If the corresponding label (link) start is marked as inactive,
    // it means we’d be wrapping a link, like this:
    //
    // ```markdown
    // > | a [b [c](d) e](f) g.
    //                  ^
    // ```
    //
    // We can’t have that, so it’s just balanced brackets.
    if (labelStart._inactive) {
      return labelEndNok(code)
    }

    defined = self.parser.defined.includes(
      normalizeIdentifier(
        self.sliceSerialize({start: labelStart.end, end: self.now()})
      )
    );
    effects.enter(types.labelEnd);
    effects.enter(types.labelMarker);
    effects.consume(code);
    effects.exit(types.labelMarker);
    effects.exit(types.labelEnd);
    return after
  }

  /**
   * After `]`.
   *
   * ```markdown
   * > | [a](b) c
   *       ^
   * > | [a][b] c
   *       ^
   * > | [a][] b
   *       ^
   * > | [a] b
   *       ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    // Note: `markdown-rs` also parses GFM footnotes here, which for us is in
    // an extension.

    // Resource (`[asd](fgh)`)?
    if (code === codes.leftParenthesis) {
      return effects.attempt(
        resourceConstruct,
        labelEndOk,
        defined ? labelEndOk : labelEndNok
      )(code)
    }

    // Full (`[asd][fgh]`) or collapsed (`[asd][]`) reference?
    if (code === codes.leftSquareBracket) {
      return effects.attempt(
        referenceFullConstruct,
        labelEndOk,
        defined ? referenceNotFull : labelEndNok
      )(code)
    }

    // Shortcut (`[asd]`) reference?
    return defined ? labelEndOk(code) : labelEndNok(code)
  }

  /**
   * After `]`, at `[`, but not at a full reference.
   *
   * > 👉 **Note**: we only get here if the label is defined.
   *
   * ```markdown
   * > | [a][] b
   *        ^
   * > | [a] b
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceNotFull(code) {
    return effects.attempt(
      referenceCollapsedConstruct,
      labelEndOk,
      labelEndNok
    )(code)
  }

  /**
   * Done, we found something.
   *
   * ```markdown
   * > | [a](b) c
   *           ^
   * > | [a][b] c
   *           ^
   * > | [a][] b
   *          ^
   * > | [a] b
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelEndOk(code) {
    // Note: `markdown-rs` does a bunch of stuff here.
    return ok$1(code)
  }

  /**
   * Done, it’s nothing.
   *
   * There was an okay opening, but we didn’t match anything.
   *
   * ```markdown
   * > | [a](b c
   *        ^
   * > | [a][b c
   *        ^
   * > | [a] b
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelEndNok(code) {
    labelStart._balanced = true;
    return nok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeResource(effects, ok$1, nok) {
  return resourceStart

  /**
   * At a resource.
   *
   * ```markdown
   * > | [a](b) c
   *        ^
   * ```
   *
   * @type {State}
   */
  function resourceStart(code) {
    ok(code === codes.leftParenthesis, 'expected left paren');
    effects.enter(types.resource);
    effects.enter(types.resourceMarker);
    effects.consume(code);
    effects.exit(types.resourceMarker);
    return resourceBefore
  }

  /**
   * In resource, after `(`, at optional whitespace.
   *
   * ```markdown
   * > | [a](b) c
   *         ^
   * ```
   *
   * @type {State}
   */
  function resourceBefore(code) {
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, resourceOpen)(code)
      : resourceOpen(code)
  }

  /**
   * In resource, after optional whitespace, at `)` or a destination.
   *
   * ```markdown
   * > | [a](b) c
   *         ^
   * ```
   *
   * @type {State}
   */
  function resourceOpen(code) {
    if (code === codes.rightParenthesis) {
      return resourceEnd(code)
    }

    return factoryDestination(
      effects,
      resourceDestinationAfter,
      resourceDestinationMissing,
      types.resourceDestination,
      types.resourceDestinationLiteral,
      types.resourceDestinationLiteralMarker,
      types.resourceDestinationRaw,
      types.resourceDestinationString,
      constants.linkResourceDestinationBalanceMax
    )(code)
  }

  /**
   * In resource, after destination, at optional whitespace.
   *
   * ```markdown
   * > | [a](b) c
   *          ^
   * ```
   *
   * @type {State}
   */
  function resourceDestinationAfter(code) {
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, resourceBetween)(code)
      : resourceEnd(code)
  }

  /**
   * At invalid destination.
   *
   * ```markdown
   * > | [a](<<) b
   *         ^
   * ```
   *
   * @type {State}
   */
  function resourceDestinationMissing(code) {
    return nok(code)
  }

  /**
   * In resource, after destination and whitespace, at `(` or title.
   *
   * ```markdown
   * > | [a](b ) c
   *           ^
   * ```
   *
   * @type {State}
   */
  function resourceBetween(code) {
    if (
      code === codes.quotationMark ||
      code === codes.apostrophe ||
      code === codes.leftParenthesis
    ) {
      return factoryTitle(
        effects,
        resourceTitleAfter,
        nok,
        types.resourceTitle,
        types.resourceTitleMarker,
        types.resourceTitleString
      )(code)
    }

    return resourceEnd(code)
  }

  /**
   * In resource, after title, at optional whitespace.
   *
   * ```markdown
   * > | [a](b "c") d
   *              ^
   * ```
   *
   * @type {State}
   */
  function resourceTitleAfter(code) {
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, resourceEnd)(code)
      : resourceEnd(code)
  }

  /**
   * In resource, at `)`.
   *
   * ```markdown
   * > | [a](b) d
   *          ^
   * ```
   *
   * @type {State}
   */
  function resourceEnd(code) {
    if (code === codes.rightParenthesis) {
      effects.enter(types.resourceMarker);
      effects.consume(code);
      effects.exit(types.resourceMarker);
      effects.exit(types.resource);
      return ok$1
    }

    return nok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeReferenceFull(effects, ok$1, nok) {
  const self = this;

  return referenceFull

  /**
   * In a reference (full), at the `[`.
   *
   * ```markdown
   * > | [a][b] d
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceFull(code) {
    ok(code === codes.leftSquareBracket, 'expected left bracket');
    return factoryLabel.call(
      self,
      effects,
      referenceFullAfter,
      referenceFullMissing,
      types.reference,
      types.referenceMarker,
      types.referenceString
    )(code)
  }

  /**
   * In a reference (full), after `]`.
   *
   * ```markdown
   * > | [a][b] d
   *          ^
   * ```
   *
   * @type {State}
   */
  function referenceFullAfter(code) {
    return self.parser.defined.includes(
      normalizeIdentifier(
        self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1)
      )
    )
      ? ok$1(code)
      : nok(code)
  }

  /**
   * In reference (full) that was missing.
   *
   * ```markdown
   * > | [a][b d
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceFullMissing(code) {
    return nok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeReferenceCollapsed(effects, ok$1, nok) {
  return referenceCollapsedStart

  /**
   * In reference (collapsed), at `[`.
   *
   * > 👉 **Note**: we only get here if the label is defined.
   *
   * ```markdown
   * > | [a][] d
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceCollapsedStart(code) {
    // We only attempt a collapsed label if there’s a `[`.
    ok(code === codes.leftSquareBracket, 'expected left bracket');
    effects.enter(types.reference);
    effects.enter(types.referenceMarker);
    effects.consume(code);
    effects.exit(types.referenceMarker);
    return referenceCollapsedOpen
  }

  /**
   * In reference (collapsed), at `]`.
   *
   * > 👉 **Note**: we only get here if the label is defined.
   *
   * ```markdown
   * > | [a][] d
   *         ^
   * ```
   *
   *  @type {State}
   */
  function referenceCollapsedOpen(code) {
    if (code === codes.rightSquareBracket) {
      effects.enter(types.referenceMarker);
      effects.consume(code);
      effects.exit(types.referenceMarker);
      effects.exit(types.reference);
      return ok$1
    }

    return nok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const labelStartImage = {
  name: 'labelStartImage',
  tokenize: tokenizeLabelStartImage,
  resolveAll: labelEnd.resolveAll
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeLabelStartImage(effects, ok$1, nok) {
  const self = this;

  return start

  /**
   * Start of label (image) start.
   *
   * ```markdown
   * > | a ![b] c
   *       ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ok(code === codes.exclamationMark, 'expected `!`');
    effects.enter(types.labelImage);
    effects.enter(types.labelImageMarker);
    effects.consume(code);
    effects.exit(types.labelImageMarker);
    return open
  }

  /**
   * After `!`, at `[`.
   *
   * ```markdown
   * > | a ![b] c
   *        ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === codes.leftSquareBracket) {
      effects.enter(types.labelMarker);
      effects.consume(code);
      effects.exit(types.labelMarker);
      effects.exit(types.labelImage);
      return after
    }

    return nok(code)
  }

  /**
   * After `![`.
   *
   * ```markdown
   * > | a ![b] c
   *         ^
   * ```
   *
   * This is needed in because, when GFM footnotes are enabled, images never
   * form when started with a `^`.
   * Instead, links form:
   *
   * ```markdown
   * ![^a](b)
   *
   * ![^a][b]
   *
   * [b]: c
   * ```
   *
   * ```html
   * <p>!<a href=\"b\">^a</a></p>
   * <p>!<a href=\"c\">^a</a></p>
   * ```
   *
   * @type {State}
   */
  function after(code) {
    // To do: use a new field to do this, this is still needed for
    // `micromark-extension-gfm-footnote`, but the `label-start-link`
    // behavior isn’t.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    return code === codes.caret &&
      '_hiddenFootnoteSupport' in self.parser.constructs
      ? nok(code)
      : ok$1(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const labelStartLink = {
  name: 'labelStartLink',
  tokenize: tokenizeLabelStartLink,
  resolveAll: labelEnd.resolveAll
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeLabelStartLink(effects, ok$1, nok) {
  const self = this;

  return start

  /**
   * Start of label (link) start.
   *
   * ```markdown
   * > | a [b] c
   *       ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    ok(code === codes.leftSquareBracket, 'expected `[`');
    effects.enter(types.labelLink);
    effects.enter(types.labelMarker);
    effects.consume(code);
    effects.exit(types.labelMarker);
    effects.exit(types.labelLink);
    return after
  }

  /** @type {State} */
  function after(code) {
    // To do: this isn’t needed in `micromark-extension-gfm-footnote`,
    // remove.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    return code === codes.caret &&
      '_hiddenFootnoteSupport' in self.parser.constructs
      ? nok(code)
      : ok$1(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const lineEnding = {name: 'lineEnding', tokenize: tokenizeLineEnding};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeLineEnding(effects, ok$1) {
  return start

  /** @type {State} */
  function start(code) {
    ok(markdownLineEnding(code), 'expected eol');
    effects.enter(types.lineEnding);
    effects.consume(code);
    effects.exit(types.lineEnding);
    return factorySpace(effects, ok$1, types.linePrefix)
  }
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const thematicBreak = {
  name: 'thematicBreak',
  tokenize: tokenizeThematicBreak
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeThematicBreak(effects, ok$1, nok) {
  let size = 0;
  /** @type {NonNullable<Code>} */
  let marker;

  return start

  /**
   * Start of thematic break.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter(types.thematicBreak);
    // To do: parse indent like `markdown-rs`.
    return before(code)
  }

  /**
   * After optional whitespace, at marker.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    ok(
      code === codes.asterisk ||
        code === codes.dash ||
        code === codes.underscore,
      'expected `*`, `-`, or `_`'
    );
    marker = code;
    return atBreak(code)
  }

  /**
   * After something, before something else.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === marker) {
      effects.enter(types.thematicBreakSequence);
      return sequence(code)
    }

    if (
      size >= constants.thematicBreakMarkerCountMin &&
      (code === codes.eof || markdownLineEnding(code))
    ) {
      effects.exit(types.thematicBreak);
      return ok$1(code)
    }

    return nok(code)
  }

  /**
   * In sequence.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function sequence(code) {
    if (code === marker) {
      effects.consume(code);
      size++;
      return sequence
    }

    effects.exit(types.thematicBreakSequence);
    return markdownSpace(code)
      ? factorySpace(effects, atBreak, types.whitespace)(code)
      : atBreak(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').ContainerState} ContainerState
 * @typedef {import('micromark-util-types').Exiter} Exiter
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const list = {
  name: 'list',
  tokenize: tokenizeListStart,
  continuation: {tokenize: tokenizeListContinuation},
  exit: tokenizeListEnd
};

/** @type {Construct} */
const listItemPrefixWhitespaceConstruct = {
  tokenize: tokenizeListItemPrefixWhitespace,
  partial: true
};

/** @type {Construct} */
const indentConstruct = {tokenize: tokenizeIndent, partial: true};

// To do: `markdown-rs` parses list items on their own and later stitches them
// together.

/**
 * @type {Tokenizer}
 * @this {TokenizeContext}
 */
function tokenizeListStart(effects, ok$1, nok) {
  const self = this;
  const tail = self.events[self.events.length - 1];
  let initialSize =
    tail && tail[1].type === types.linePrefix
      ? tail[2].sliceSerialize(tail[1], true).length
      : 0;
  let size = 0;

  return start

  /** @type {State} */
  function start(code) {
    ok(self.containerState, 'expected state');
    const kind =
      self.containerState.type ||
      (code === codes.asterisk || code === codes.plusSign || code === codes.dash
        ? types.listUnordered
        : types.listOrdered);

    if (
      kind === types.listUnordered
        ? !self.containerState.marker || code === self.containerState.marker
        : asciiDigit(code)
    ) {
      if (!self.containerState.type) {
        self.containerState.type = kind;
        effects.enter(kind, {_container: true});
      }

      if (kind === types.listUnordered) {
        effects.enter(types.listItemPrefix);
        return code === codes.asterisk || code === codes.dash
          ? effects.check(thematicBreak, nok, atMarker)(code)
          : atMarker(code)
      }

      if (!self.interrupt || code === codes.digit1) {
        effects.enter(types.listItemPrefix);
        effects.enter(types.listItemValue);
        return inside(code)
      }
    }

    return nok(code)
  }

  /** @type {State} */
  function inside(code) {
    ok(self.containerState, 'expected state');
    if (asciiDigit(code) && ++size < constants.listItemValueSizeMax) {
      effects.consume(code);
      return inside
    }

    if (
      (!self.interrupt || size < 2) &&
      (self.containerState.marker
        ? code === self.containerState.marker
        : code === codes.rightParenthesis || code === codes.dot)
    ) {
      effects.exit(types.listItemValue);
      return atMarker(code)
    }

    return nok(code)
  }

  /**
   * @type {State}
   **/
  function atMarker(code) {
    ok(self.containerState, 'expected state');
    ok(code !== codes.eof, 'eof (`null`) is not a marker');
    effects.enter(types.listItemMarker);
    effects.consume(code);
    effects.exit(types.listItemMarker);
    self.containerState.marker = self.containerState.marker || code;
    return effects.check(
      blankLine,
      // Can’t be empty when interrupting.
      self.interrupt ? nok : onBlank,
      effects.attempt(
        listItemPrefixWhitespaceConstruct,
        endOfPrefix,
        otherPrefix
      )
    )
  }

  /** @type {State} */
  function onBlank(code) {
    ok(self.containerState, 'expected state');
    self.containerState.initialBlankLine = true;
    initialSize++;
    return endOfPrefix(code)
  }

  /** @type {State} */
  function otherPrefix(code) {
    if (markdownSpace(code)) {
      effects.enter(types.listItemPrefixWhitespace);
      effects.consume(code);
      effects.exit(types.listItemPrefixWhitespace);
      return endOfPrefix
    }

    return nok(code)
  }

  /** @type {State} */
  function endOfPrefix(code) {
    ok(self.containerState, 'expected state');
    self.containerState.size =
      initialSize +
      self.sliceSerialize(effects.exit(types.listItemPrefix), true).length;
    return ok$1(code)
  }
}

/**
 * @type {Tokenizer}
 * @this {TokenizeContext}
 */
function tokenizeListContinuation(effects, ok$1, nok) {
  const self = this;

  ok(self.containerState, 'expected state');
  self.containerState._closeFlow = undefined;

  return effects.check(blankLine, onBlank, notBlank)

  /** @type {State} */
  function onBlank(code) {
    ok(self.containerState, 'expected state');
    ok(typeof self.containerState.size === 'number', 'expected size');
    self.containerState.furtherBlankLines =
      self.containerState.furtherBlankLines ||
      self.containerState.initialBlankLine;

    // We have a blank line.
    // Still, try to consume at most the items size.
    return factorySpace(
      effects,
      ok$1,
      types.listItemIndent,
      self.containerState.size + 1
    )(code)
  }

  /** @type {State} */
  function notBlank(code) {
    ok(self.containerState, 'expected state');
    if (self.containerState.furtherBlankLines || !markdownSpace(code)) {
      self.containerState.furtherBlankLines = undefined;
      self.containerState.initialBlankLine = undefined;
      return notInCurrentItem(code)
    }

    self.containerState.furtherBlankLines = undefined;
    self.containerState.initialBlankLine = undefined;
    return effects.attempt(indentConstruct, ok$1, notInCurrentItem)(code)
  }

  /** @type {State} */
  function notInCurrentItem(code) {
    ok(self.containerState, 'expected state');
    // While we do continue, we signal that the flow should be closed.
    self.containerState._closeFlow = true;
    // As we’re closing flow, we’re no longer interrupting.
    self.interrupt = undefined;
    // Always populated by defaults.
    ok(
      self.parser.constructs.disable.null,
      'expected `disable.null` to be populated'
    );
    return factorySpace(
      effects,
      effects.attempt(list, ok$1, nok),
      types.linePrefix,
      self.parser.constructs.disable.null.includes('codeIndented')
        ? undefined
        : constants.tabSize
    )(code)
  }
}

/**
 * @type {Tokenizer}
 * @this {TokenizeContext}
 */
function tokenizeIndent(effects, ok$1, nok) {
  const self = this;

  ok(self.containerState, 'expected state');
  ok(typeof self.containerState.size === 'number', 'expected size');

  return factorySpace(
    effects,
    afterPrefix,
    types.listItemIndent,
    self.containerState.size + 1
  )

  /** @type {State} */
  function afterPrefix(code) {
    ok(self.containerState, 'expected state');
    const tail = self.events[self.events.length - 1];
    return tail &&
      tail[1].type === types.listItemIndent &&
      tail[2].sliceSerialize(tail[1], true).length === self.containerState.size
      ? ok$1(code)
      : nok(code)
  }
}

/**
 * @type {Exiter}
 * @this {TokenizeContext}
 */
function tokenizeListEnd(effects) {
  ok(this.containerState, 'expected state');
  ok(typeof this.containerState.type === 'string', 'expected type');
  effects.exit(this.containerState.type);
}

/**
 * @type {Tokenizer}
 * @this {TokenizeContext}
 */
function tokenizeListItemPrefixWhitespace(effects, ok$1, nok) {
  const self = this;

  // Always populated by defaults.
  ok(
    self.parser.constructs.disable.null,
    'expected `disable.null` to be populated'
  );

  return factorySpace(
    effects,
    afterPrefix,
    types.listItemPrefixWhitespace,
    self.parser.constructs.disable.null.includes('codeIndented')
      ? undefined
      : constants.tabSize + 1
  )

  /** @type {State} */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1];

    return !markdownSpace(code) &&
      tail &&
      tail[1].type === types.listItemPrefixWhitespace
      ? ok$1(code)
      : nok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const setextUnderline = {
  name: 'setextUnderline',
  tokenize: tokenizeSetextUnderline,
  resolveTo: resolveToSetextUnderline
};

/** @type {Resolver} */
function resolveToSetextUnderline(events, context) {
  // To do: resolve like `markdown-rs`.
  let index = events.length;
  /** @type {number | undefined} */
  let content;
  /** @type {number | undefined} */
  let text;
  /** @type {number | undefined} */
  let definition;

  // Find the opening of the content.
  // It’ll always exist: we don’t tokenize if it isn’t there.
  while (index--) {
    if (events[index][0] === 'enter') {
      if (events[index][1].type === types.content) {
        content = index;
        break
      }

      if (events[index][1].type === types.paragraph) {
        text = index;
      }
    }
    // Exit
    else {
      if (events[index][1].type === types.content) {
        // Remove the content end (if needed we’ll add it later)
        events.splice(index, 1);
      }

      if (!definition && events[index][1].type === types.definition) {
        definition = index;
      }
    }
  }

  ok(text !== undefined, 'expected a `text` index to be found');
  ok(content !== undefined, 'expected a `text` index to be found');

  const heading = {
    type: types.setextHeading,
    start: Object.assign({}, events[text][1].start),
    end: Object.assign({}, events[events.length - 1][1].end)
  };

  // Change the paragraph to setext heading text.
  events[text][1].type = types.setextHeadingText;

  // If we have definitions in the content, we’ll keep on having content,
  // but we need move it.
  if (definition) {
    events.splice(text, 0, ['enter', heading, context]);
    events.splice(definition + 1, 0, ['exit', events[content][1], context]);
    events[content][1].end = Object.assign({}, events[definition][1].end);
  } else {
    events[content][1] = heading;
  }

  // Add the heading exit at the end.
  events.push(['exit', heading, context]);

  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeSetextUnderline(effects, ok$1, nok) {
  const self = this;
  /** @type {NonNullable<Code>} */
  let marker;

  return start

  /**
   * At start of heading (setext) underline.
   *
   * ```markdown
   *   | aa
   * > | ==
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    let index = self.events.length;
    /** @type {boolean | undefined} */
    let paragraph;

    ok(
      code === codes.dash || code === codes.equalsTo,
      'expected `=` or `-`'
    );

    // Find an opening.
    while (index--) {
      // Skip enter/exit of line ending, line prefix, and content.
      // We can now either have a definition or a paragraph.
      if (
        self.events[index][1].type !== types.lineEnding &&
        self.events[index][1].type !== types.linePrefix &&
        self.events[index][1].type !== types.content
      ) {
        paragraph = self.events[index][1].type === types.paragraph;
        break
      }
    }

    // To do: handle lazy/pierce like `markdown-rs`.
    // To do: parse indent like `markdown-rs`.
    if (!self.parser.lazy[self.now().line] && (self.interrupt || paragraph)) {
      effects.enter(types.setextHeadingLine);
      marker = code;
      return before(code)
    }

    return nok(code)
  }

  /**
   * After optional whitespace, at `-` or `=`.
   *
   * ```markdown
   *   | aa
   * > | ==
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    effects.enter(types.setextHeadingLineSequence);
    return inside(code)
  }

  /**
   * In sequence.
   *
   * ```markdown
   *   | aa
   * > | ==
   *     ^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    if (code === marker) {
      effects.consume(code);
      return inside
    }

    effects.exit(types.setextHeadingLineSequence);

    return markdownSpace(code)
      ? factorySpace(effects, after, types.lineSuffix)(code)
      : after(code)
  }

  /**
   * After sequence, after optional whitespace.
   *
   * ```markdown
   *   | aa
   * > | ==
   *       ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types.setextHeadingLine);
      return ok$1(code)
    }

    return nok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').Initializer} Initializer
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 */


/** @type {InitialConstruct} */
const flow$1 = {tokenize: initializeFlow};

/**
 * @this {TokenizeContext}
 * @type {Initializer}
 */
function initializeFlow(effects) {
  const self = this;
  const initial = effects.attempt(
    // Try to parse a blank line.
    blankLine,
    atBlankEnding,
    // Try to parse initial flow (essentially, only code).
    effects.attempt(
      this.parser.constructs.flowInitial,
      afterConstruct,
      factorySpace(
        effects,
        effects.attempt(
          this.parser.constructs.flow,
          afterConstruct,
          effects.attempt(content, afterConstruct)
        ),
        types.linePrefix
      )
    )
  );

  return initial

  /** @type {State} */
  function atBlankEnding(code) {
    ok(
      code === codes.eof || markdownLineEnding(code),
      'expected eol or eof'
    );

    if (code === codes.eof) {
      effects.consume(code);
      return
    }

    effects.enter(types.lineEndingBlank);
    effects.consume(code);
    effects.exit(types.lineEndingBlank);
    self.currentConstruct = undefined;
    return initial
  }

  /** @type {State} */
  function afterConstruct(code) {
    ok(
      code === codes.eof || markdownLineEnding(code),
      'expected eol or eof'
    );

    if (code === codes.eof) {
      effects.consume(code);
      return
    }

    effects.enter(types.lineEnding);
    effects.consume(code);
    effects.exit(types.lineEnding);
    self.currentConstruct = undefined;
    return initial
  }
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').Initializer} Initializer
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 */


const resolver = {resolveAll: createResolver()};
const string$1 = initializeFactory('string');
const text$1 = initializeFactory('text');

/**
 * @param {'string' | 'text'} field
 * @returns {InitialConstruct}
 */
function initializeFactory(field) {
  return {
    tokenize: initializeText,
    resolveAll: createResolver(
      field === 'text' ? resolveAllLineSuffixes : undefined
    )
  }

  /**
   * @this {TokenizeContext}
   * @type {Initializer}
   */
  function initializeText(effects) {
    const self = this;
    const constructs = this.parser.constructs[field];
    const text = effects.attempt(constructs, start, notText);

    return start

    /** @type {State} */
    function start(code) {
      return atBreak(code) ? text(code) : notText(code)
    }

    /** @type {State} */
    function notText(code) {
      if (code === codes.eof) {
        effects.consume(code);
        return
      }

      effects.enter(types.data);
      effects.consume(code);
      return data
    }

    /** @type {State} */
    function data(code) {
      if (atBreak(code)) {
        effects.exit(types.data);
        return text(code)
      }

      // Data.
      effects.consume(code);
      return data
    }

    /**
     * @param {Code} code
     * @returns {boolean}
     */
    function atBreak(code) {
      if (code === codes.eof) {
        return true
      }

      const list = constructs[code];
      let index = -1;

      if (list) {
        // Always populated by defaults.
        ok(Array.isArray(list), 'expected `disable.null` to be populated');

        while (++index < list.length) {
          const item = list[index];
          if (!item.previous || item.previous.call(self, self.previous)) {
            return true
          }
        }
      }

      return false
    }
  }
}

/**
 * @param {Resolver | undefined} [extraResolver]
 * @returns {Resolver}
 */
function createResolver(extraResolver) {
  return resolveAllText

  /** @type {Resolver} */
  function resolveAllText(events, context) {
    let index = -1;
    /** @type {number | undefined} */
    let enter;

    // A rather boring computation (to merge adjacent `data` events) which
    // improves mm performance by 29%.
    while (++index <= events.length) {
      if (enter === undefined) {
        if (events[index] && events[index][1].type === types.data) {
          enter = index;
          index++;
        }
      } else if (!events[index] || events[index][1].type !== types.data) {
        // Don’t do anything if there is one data token.
        if (index !== enter + 2) {
          events[enter][1].end = events[index - 1][1].end;
          events.splice(enter + 2, index - enter - 2);
          index = enter + 2;
        }

        enter = undefined;
      }
    }

    return extraResolver ? extraResolver(events, context) : events
  }
}

/**
 * A rather ugly set of instructions which again looks at chunks in the input
 * stream.
 * The reason to do this here is that it is *much* faster to parse in reverse.
 * And that we can’t hook into `null` to split the line suffix before an EOF.
 * To do: figure out if we can make this into a clean utility, or even in core.
 * As it will be useful for GFMs literal autolink extension (and maybe even
 * tables?)
 *
 * @type {Resolver}
 */
function resolveAllLineSuffixes(events, context) {
  let eventIndex = 0; // Skip first.

  while (++eventIndex <= events.length) {
    if (
      (eventIndex === events.length ||
        events[eventIndex][1].type === types.lineEnding) &&
      events[eventIndex - 1][1].type === types.data
    ) {
      const data = events[eventIndex - 1][1];
      const chunks = context.sliceStream(data);
      let index = chunks.length;
      let bufferIndex = -1;
      let size = 0;
      /** @type {boolean | undefined} */
      let tabs;

      while (index--) {
        const chunk = chunks[index];

        if (typeof chunk === 'string') {
          bufferIndex = chunk.length;

          while (chunk.charCodeAt(bufferIndex - 1) === codes.space) {
            size++;
            bufferIndex--;
          }

          if (bufferIndex) break
          bufferIndex = -1;
        }
        // Number
        else if (chunk === codes.horizontalTab) {
          tabs = true;
          size++;
        } else if (chunk === codes.virtualSpace) ; else {
          // Replacement character, exit.
          index++;
          break
        }
      }

      if (size) {
        const token = {
          type:
            eventIndex === events.length ||
            tabs ||
            size < constants.hardBreakPrefixSizeMin
              ? types.lineSuffix
              : types.hardBreakTrailing,
          start: {
            line: data.end.line,
            column: data.end.column - size,
            offset: data.end.offset - size,
            _index: data.start._index + index,
            _bufferIndex: index
              ? bufferIndex
              : data.start._bufferIndex + bufferIndex
          },
          end: Object.assign({}, data.end)
        };

        data.end = Object.assign({}, token.start);

        if (data.start.offset === data.end.offset) {
          Object.assign(data, token);
        } else {
          events.splice(
            eventIndex,
            0,
            ['enter', token, context],
            ['exit', token, context]
          );
          eventIndex += 2;
        }
      }

      eventIndex++;
    }
  }

  return events
}

var browser = {exports: {}};

/**
 * Helpers.
 */

var ms;
var hasRequiredMs;

function requireMs () {
	if (hasRequiredMs) return ms;
	hasRequiredMs = 1;
	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} [options]
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */

	ms = function(val, options) {
	  options = options || {};
	  var type = typeof val;
	  if (type === 'string' && val.length > 0) {
	    return parse(val);
	  } else if (type === 'number' && isFinite(val)) {
	    return options.long ? fmtLong(val) : fmtShort(val);
	  }
	  throw new Error(
	    'val is not a non-empty string or a valid number. val=' +
	      JSON.stringify(val)
	  );
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = String(str);
	  if (str.length > 100) {
	    return;
	  }
	  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
	    str
	  );
	  if (!match) {
	    return;
	  }
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'weeks':
	    case 'week':
	    case 'w':
	      return n * w;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	    default:
	      return undefined;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtShort(ms) {
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return Math.round(ms / d) + 'd';
	  }
	  if (msAbs >= h) {
	    return Math.round(ms / h) + 'h';
	  }
	  if (msAbs >= m) {
	    return Math.round(ms / m) + 'm';
	  }
	  if (msAbs >= s) {
	    return Math.round(ms / s) + 's';
	  }
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtLong(ms) {
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return plural(ms, msAbs, d, 'day');
	  }
	  if (msAbs >= h) {
	    return plural(ms, msAbs, h, 'hour');
	  }
	  if (msAbs >= m) {
	    return plural(ms, msAbs, m, 'minute');
	  }
	  if (msAbs >= s) {
	    return plural(ms, msAbs, s, 'second');
	  }
	  return ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, msAbs, n, name) {
	  var isPlural = msAbs >= n * 1.5;
	  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
	}
	return ms;
}

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = requireMs();
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

var common = setup;

/* eslint-env browser */

(function (module, exports) {
	/**
	 * This is the web browser implementation of `debug()`.
	 */

	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = localstorage();
	exports.destroy = (() => {
		let warned = false;

		return () => {
			if (!warned) {
				warned = true;
				console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
			}
		};
	})();

	/**
	 * Colors.
	 */

	exports.colors = [
		'#0000CC',
		'#0000FF',
		'#0033CC',
		'#0033FF',
		'#0066CC',
		'#0066FF',
		'#0099CC',
		'#0099FF',
		'#00CC00',
		'#00CC33',
		'#00CC66',
		'#00CC99',
		'#00CCCC',
		'#00CCFF',
		'#3300CC',
		'#3300FF',
		'#3333CC',
		'#3333FF',
		'#3366CC',
		'#3366FF',
		'#3399CC',
		'#3399FF',
		'#33CC00',
		'#33CC33',
		'#33CC66',
		'#33CC99',
		'#33CCCC',
		'#33CCFF',
		'#6600CC',
		'#6600FF',
		'#6633CC',
		'#6633FF',
		'#66CC00',
		'#66CC33',
		'#9900CC',
		'#9900FF',
		'#9933CC',
		'#9933FF',
		'#99CC00',
		'#99CC33',
		'#CC0000',
		'#CC0033',
		'#CC0066',
		'#CC0099',
		'#CC00CC',
		'#CC00FF',
		'#CC3300',
		'#CC3333',
		'#CC3366',
		'#CC3399',
		'#CC33CC',
		'#CC33FF',
		'#CC6600',
		'#CC6633',
		'#CC9900',
		'#CC9933',
		'#CCCC00',
		'#CCCC33',
		'#FF0000',
		'#FF0033',
		'#FF0066',
		'#FF0099',
		'#FF00CC',
		'#FF00FF',
		'#FF3300',
		'#FF3333',
		'#FF3366',
		'#FF3399',
		'#FF33CC',
		'#FF33FF',
		'#FF6600',
		'#FF6633',
		'#FF9900',
		'#FF9933',
		'#FFCC00',
		'#FFCC33'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	// eslint-disable-next-line complexity
	function useColors() {
		// NB: In an Electron preload script, document will be defined but not fully
		// initialized. Since we know we're in Chrome, we'll just detect this case
		// explicitly
		if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
			return true;
		}

		// Internet Explorer and Edge do not support colors.
		if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
			return false;
		}

		// Is webkit? http://stackoverflow.com/a/16459606/376773
		// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
		return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
			// Is firebug? http://stackoverflow.com/a/398120/376773
			(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
			// Is firefox >= v31?
			// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
			(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
			// Double check webkit in userAgent just in case we are in a worker
			(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
	}

	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs(args) {
		args[0] = (this.useColors ? '%c' : '') +
			this.namespace +
			(this.useColors ? ' %c' : ' ') +
			args[0] +
			(this.useColors ? '%c ' : ' ') +
			'+' + module.exports.humanize(this.diff);

		if (!this.useColors) {
			return;
		}

		const c = 'color: ' + this.color;
		args.splice(1, 0, c, 'color: inherit');

		// The final "%c" is somewhat tricky, because there could be other
		// arguments passed either before or after the %c, so we need to
		// figure out the correct index to insert the CSS into
		let index = 0;
		let lastC = 0;
		args[0].replace(/%[a-zA-Z%]/g, match => {
			if (match === '%%') {
				return;
			}
			index++;
			if (match === '%c') {
				// We only are interested in the *last* %c
				// (the user may have provided their own)
				lastC = index;
			}
		});

		args.splice(lastC, 0, c);
	}

	/**
	 * Invokes `console.debug()` when available.
	 * No-op when `console.debug` is not a "function".
	 * If `console.debug` is not available, falls back
	 * to `console.log`.
	 *
	 * @api public
	 */
	exports.log = console.debug || console.log || (() => {});

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */
	function save(namespaces) {
		try {
			if (namespaces) {
				exports.storage.setItem('debug', namespaces);
			} else {
				exports.storage.removeItem('debug');
			}
		} catch (error) {
			// Swallow
			// XXX (@Qix-) should we be logging these?
		}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */
	function load() {
		let r;
		try {
			r = exports.storage.getItem('debug');
		} catch (error) {
			// Swallow
			// XXX (@Qix-) should we be logging these?
		}

		// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
		if (!r && typeof process !== 'undefined' && 'env' in process) {
			r = process.env.DEBUG;
		}

		return r;
	}

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage() {
		try {
			// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
			// The Browser also has localStorage in the global context.
			return localStorage;
		} catch (error) {
			// Swallow
			// XXX (@Qix-) should we be logging these?
		}
	}

	module.exports = common(exports);

	const {formatters} = module.exports;

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	formatters.j = function (v) {
		try {
			return JSON.stringify(v);
		} catch (error) {
			return '[UnexpectedJSONParseError]: ' + error.message;
		}
	}; 
} (browser, browser.exports));

var browserExports = browser.exports;
var createDebug = /*@__PURE__*/TmoLexicalEditor.getDefaultExportFromCjs(browserExports);

/**
 * @typedef {import('micromark-util-types').Chunk} Chunk
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').ConstructRecord} ConstructRecord
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').ParseContext} ParseContext
 * @typedef {import('micromark-util-types').Point} Point
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenType} TokenType
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 */


const debug = createDebug('micromark');

/**
 * Create a tokenizer.
 * Tokenizers deal with one type of data (e.g., containers, flow, text).
 * The parser is the object dealing with it all.
 * `initialize` works like other constructs, except that only its `tokenize`
 * function is used, in which case it doesn’t receive an `ok` or `nok`.
 * `from` can be given to set the point before the first character, although
 * when further lines are indented, they must be set with `defineSkip`.
 *
 * @param {ParseContext} parser
 * @param {InitialConstruct} initialize
 * @param {Omit<Point, '_bufferIndex' | '_index'> | undefined} [from]
 * @returns {TokenizeContext}
 */
function createTokenizer(parser, initialize, from) {
  /** @type {Point} */
  let point = Object.assign(
    from ? Object.assign({}, from) : {line: 1, column: 1, offset: 0},
    {_index: 0, _bufferIndex: -1}
  );
  /** @type {Record<string, number>} */
  const columnStart = {};
  /** @type {Array<Construct>} */
  const resolveAllConstructs = [];
  /** @type {Array<Chunk>} */
  let chunks = [];
  /** @type {Array<Token>} */
  let stack = [];
  /** @type {boolean | undefined} */
  let consumed = true;

  /**
   * Tools used for tokenizing.
   *
   * @type {Effects}
   */
  const effects = {
    consume,
    enter,
    exit,
    attempt: constructFactory(onsuccessfulconstruct),
    check: constructFactory(onsuccessfulcheck),
    interrupt: constructFactory(onsuccessfulcheck, {interrupt: true})
  };

  /**
   * State and tools for resolving and serializing.
   *
   * @type {TokenizeContext}
   */
  const context = {
    previous: codes.eof,
    code: codes.eof,
    containerState: {},
    events: [],
    parser,
    sliceStream,
    sliceSerialize,
    now,
    defineSkip,
    write
  };

  /**
   * The state function.
   *
   * @type {State | void}
   */
  let state = initialize.tokenize.call(context, effects);

  /**
   * Track which character we expect to be consumed, to catch bugs.
   *
   * @type {Code}
   */
  let expectedCode;

  if (initialize.resolveAll) {
    resolveAllConstructs.push(initialize);
  }

  return context

  /** @type {TokenizeContext['write']} */
  function write(slice) {
    chunks = push(chunks, slice);

    main();

    // Exit if we’re not done, resolve might change stuff.
    if (chunks[chunks.length - 1] !== codes.eof) {
      return []
    }

    addResult(initialize, 0);

    // Otherwise, resolve, and exit.
    context.events = resolveAll(resolveAllConstructs, context.events, context);

    return context.events
  }

  //
  // Tools.
  //

  /** @type {TokenizeContext['sliceSerialize']} */
  function sliceSerialize(token, expandTabs) {
    return serializeChunks(sliceStream(token), expandTabs)
  }

  /** @type {TokenizeContext['sliceStream']} */
  function sliceStream(token) {
    return sliceChunks(chunks, token)
  }

  /** @type {TokenizeContext['now']} */
  function now() {
    // This is a hot path, so we clone manually instead of `Object.assign({}, point)`
    const {line, column, offset, _index, _bufferIndex} = point;
    return {line, column, offset, _index, _bufferIndex}
  }

  /** @type {TokenizeContext['defineSkip']} */
  function defineSkip(value) {
    columnStart[value.line] = value.column;
    accountForPotentialSkip();
    debug('position: define skip: `%j`', point);
  }

  //
  // State management.
  //

  /**
   * Main loop (note that `_index` and `_bufferIndex` in `point` are modified by
   * `consume`).
   * Here is where we walk through the chunks, which either include strings of
   * several characters, or numerical character codes.
   * The reason to do this in a loop instead of a call is so the stack can
   * drain.
   *
   * @returns {void}
   */
  function main() {
    /** @type {number} */
    let chunkIndex;

    while (point._index < chunks.length) {
      const chunk = chunks[point._index];

      // If we’re in a buffer chunk, loop through it.
      if (typeof chunk === 'string') {
        chunkIndex = point._index;

        if (point._bufferIndex < 0) {
          point._bufferIndex = 0;
        }

        while (
          point._index === chunkIndex &&
          point._bufferIndex < chunk.length
        ) {
          go(chunk.charCodeAt(point._bufferIndex));
        }
      } else {
        go(chunk);
      }
    }
  }

  /**
   * Deal with one code.
   *
   * @param {Code} code
   * @returns {void}
   */
  function go(code) {
    ok(consumed === true, 'expected character to be consumed');
    consumed = undefined;
    debug('main: passing `%s` to %s', code, state && state.name);
    expectedCode = code;
    ok(typeof state === 'function', 'expected state');
    state = state(code);
  }

  /** @type {Effects['consume']} */
  function consume(code) {
    ok(code === expectedCode, 'expected given code to equal expected code');

    debug('consume: `%s`', code);

    ok(
      consumed === undefined,
      'expected code to not have been consumed: this might be because `return x(code)` instead of `return x` was used'
    );
    ok(
      code === null
        ? context.events.length === 0 ||
            context.events[context.events.length - 1][0] === 'exit'
        : context.events[context.events.length - 1][0] === 'enter',
      'expected last token to be open'
    );

    if (markdownLineEnding(code)) {
      point.line++;
      point.column = 1;
      point.offset += code === codes.carriageReturnLineFeed ? 2 : 1;
      accountForPotentialSkip();
      debug('position: after eol: `%j`', point);
    } else if (code !== codes.virtualSpace) {
      point.column++;
      point.offset++;
    }

    // Not in a string chunk.
    if (point._bufferIndex < 0) {
      point._index++;
    } else {
      point._bufferIndex++;

      // At end of string chunk.
      // @ts-expect-error Points w/ non-negative `_bufferIndex` reference
      // strings.
      if (point._bufferIndex === chunks[point._index].length) {
        point._bufferIndex = -1;
        point._index++;
      }
    }

    // Expose the previous character.
    context.previous = code;

    // Mark as consumed.
    consumed = true;
  }

  /** @type {Effects['enter']} */
  function enter(type, fields) {
    /** @type {Token} */
    // @ts-expect-error Patch instead of assign required fields to help GC.
    const token = fields || {};
    token.type = type;
    token.start = now();

    ok(typeof type === 'string', 'expected string type');
    ok(type.length > 0, 'expected non-empty string');
    debug('enter: `%s`', type);

    context.events.push(['enter', token, context]);

    stack.push(token);

    return token
  }

  /** @type {Effects['exit']} */
  function exit(type) {
    ok(typeof type === 'string', 'expected string type');
    ok(type.length > 0, 'expected non-empty string');

    const token = stack.pop();
    ok(token, 'cannot close w/o open tokens');
    token.end = now();

    ok(type === token.type, 'expected exit token to match current token');

    ok(
      !(
        token.start._index === token.end._index &&
        token.start._bufferIndex === token.end._bufferIndex
      ),
      'expected non-empty token (`' + type + '`)'
    );

    debug('exit: `%s`', token.type);
    context.events.push(['exit', token, context]);

    return token
  }

  /**
   * Use results.
   *
   * @type {ReturnHandle}
   */
  function onsuccessfulconstruct(construct, info) {
    addResult(construct, info.from);
  }

  /**
   * Discard results.
   *
   * @type {ReturnHandle}
   */
  function onsuccessfulcheck(_, info) {
    info.restore();
  }

  /**
   * Factory to attempt/check/interrupt.
   *
   * @param {ReturnHandle} onreturn
   * @param {{interrupt?: boolean | undefined} | undefined} [fields]
   */
  function constructFactory(onreturn, fields) {
    return hook

    /**
     * Handle either an object mapping codes to constructs, a list of
     * constructs, or a single construct.
     *
     * @param {Array<Construct> | Construct | ConstructRecord} constructs
     * @param {State} returnState
     * @param {State | undefined} [bogusState]
     * @returns {State}
     */
    function hook(constructs, returnState, bogusState) {
      /** @type {Array<Construct>} */
      let listOfConstructs;
      /** @type {number} */
      let constructIndex;
      /** @type {Construct} */
      let currentConstruct;
      /** @type {Info} */
      let info;

      return Array.isArray(constructs)
        ? /* c8 ignore next 1 */
          handleListOfConstructs(constructs)
        : 'tokenize' in constructs
        ? // @ts-expect-error Looks like a construct.
          handleListOfConstructs([constructs])
        : handleMapOfConstructs(constructs)

      /**
       * Handle a list of construct.
       *
       * @param {ConstructRecord} map
       * @returns {State}
       */
      function handleMapOfConstructs(map) {
        return start

        /** @type {State} */
        function start(code) {
          const def = code !== null && map[code];
          const all = code !== null && map.null;
          const list = [
            // To do: add more extension tests.
            /* c8 ignore next 2 */
            ...(Array.isArray(def) ? def : def ? [def] : []),
            ...(Array.isArray(all) ? all : all ? [all] : [])
          ];

          return handleListOfConstructs(list)(code)
        }
      }

      /**
       * Handle a list of construct.
       *
       * @param {Array<Construct>} list
       * @returns {State}
       */
      function handleListOfConstructs(list) {
        listOfConstructs = list;
        constructIndex = 0;

        if (list.length === 0) {
          ok(bogusState, 'expected `bogusState` to be given');
          return bogusState
        }

        return handleConstruct(list[constructIndex])
      }

      /**
       * Handle a single construct.
       *
       * @param {Construct} construct
       * @returns {State}
       */
      function handleConstruct(construct) {
        return start

        /** @type {State} */
        function start(code) {
          // To do: not needed to store if there is no bogus state, probably?
          // Currently doesn’t work because `inspect` in document does a check
          // w/o a bogus, which doesn’t make sense. But it does seem to help perf
          // by not storing.
          info = store();
          currentConstruct = construct;

          if (!construct.partial) {
            context.currentConstruct = construct;
          }

          // Always populated by defaults.
          ok(
            context.parser.constructs.disable.null,
            'expected `disable.null` to be populated'
          );

          if (
            construct.name &&
            context.parser.constructs.disable.null.includes(construct.name)
          ) {
            return nok(code)
          }

          return construct.tokenize.call(
            // If we do have fields, create an object w/ `context` as its
            // prototype.
            // This allows a “live binding”, which is needed for `interrupt`.
            fields ? Object.assign(Object.create(context), fields) : context,
            effects,
            ok$1,
            nok
          )(code)
        }
      }

      /** @type {State} */
      function ok$1(code) {
        ok(code === expectedCode, 'expected code');
        consumed = true;
        onreturn(currentConstruct, info);
        return returnState
      }

      /** @type {State} */
      function nok(code) {
        ok(code === expectedCode, 'expected code');
        consumed = true;
        info.restore();

        if (++constructIndex < listOfConstructs.length) {
          return handleConstruct(listOfConstructs[constructIndex])
        }

        return bogusState
      }
    }
  }

  /**
   * @param {Construct} construct
   * @param {number} from
   * @returns {void}
   */
  function addResult(construct, from) {
    if (construct.resolveAll && !resolveAllConstructs.includes(construct)) {
      resolveAllConstructs.push(construct);
    }

    if (construct.resolve) {
      splice(
        context.events,
        from,
        context.events.length - from,
        construct.resolve(context.events.slice(from), context)
      );
    }

    if (construct.resolveTo) {
      context.events = construct.resolveTo(context.events, context);
    }

    ok(
      construct.partial ||
        context.events.length === 0 ||
        context.events[context.events.length - 1][0] === 'exit',
      'expected last token to end'
    );
  }

  /**
   * Store state.
   *
   * @returns {Info}
   */
  function store() {
    const startPoint = now();
    const startPrevious = context.previous;
    const startCurrentConstruct = context.currentConstruct;
    const startEventsIndex = context.events.length;
    const startStack = Array.from(stack);

    return {restore, from: startEventsIndex}

    /**
     * Restore state.
     *
     * @returns {void}
     */
    function restore() {
      point = startPoint;
      context.previous = startPrevious;
      context.currentConstruct = startCurrentConstruct;
      context.events.length = startEventsIndex;
      stack = startStack;
      accountForPotentialSkip();
      debug('position: restore: `%j`', point);
    }
  }

  /**
   * Move the current point a bit forward in the line when it’s on a column
   * skip.
   *
   * @returns {void}
   */
  function accountForPotentialSkip() {
    if (point.line in columnStart && point.column < 2) {
      point.column = columnStart[point.line];
      point.offset += columnStart[point.line] - 1;
    }
  }
}

/**
 * Get the chunks from a slice of chunks in the range of a token.
 *
 * @param {Array<Chunk>} chunks
 * @param {Pick<Token, 'end' | 'start'>} token
 * @returns {Array<Chunk>}
 */
function sliceChunks(chunks, token) {
  const startIndex = token.start._index;
  const startBufferIndex = token.start._bufferIndex;
  const endIndex = token.end._index;
  const endBufferIndex = token.end._bufferIndex;
  /** @type {Array<Chunk>} */
  let view;

  if (startIndex === endIndex) {
    ok(endBufferIndex > -1, 'expected non-negative end buffer index');
    ok(startBufferIndex > -1, 'expected non-negative start buffer index');
    // @ts-expect-error `_bufferIndex` is used on string chunks.
    view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)];
  } else {
    view = chunks.slice(startIndex, endIndex);

    if (startBufferIndex > -1) {
      const head = view[0];
      if (typeof head === 'string') {
        view[0] = head.slice(startBufferIndex);
      } else {
        ok(startBufferIndex === 0, 'expected `startBufferIndex` to be `0`');
        view.shift();
      }
    }

    if (endBufferIndex > 0) {
      // @ts-expect-error `_bufferIndex` is used on string chunks.
      view.push(chunks[endIndex].slice(0, endBufferIndex));
    }
  }

  return view
}

/**
 * Get the string value of a slice of chunks.
 *
 * @param {Array<Chunk>} chunks
 * @param {boolean | undefined} [expandTabs=false]
 * @returns {string}
 */
function serializeChunks(chunks, expandTabs) {
  let index = -1;
  /** @type {Array<string>} */
  const result = [];
  /** @type {boolean | undefined} */
  let atTab;

  while (++index < chunks.length) {
    const chunk = chunks[index];
    /** @type {string} */
    let value;

    if (typeof chunk === 'string') {
      value = chunk;
    } else
      switch (chunk) {
        case codes.carriageReturn: {
          value = values.cr;

          break
        }

        case codes.lineFeed: {
          value = values.lf;

          break
        }

        case codes.carriageReturnLineFeed: {
          value = values.cr + values.lf;

          break
        }

        case codes.horizontalTab: {
          value = expandTabs ? values.space : values.ht;

          break
        }

        case codes.virtualSpace: {
          if (!expandTabs && atTab) continue
          value = values.space;

          break
        }

        default: {
          ok(typeof chunk === 'number', 'expected number');
          // Currently only replacement character.
          value = String.fromCharCode(chunk);
        }
      }

    atTab = chunk === codes.horizontalTab;
    result.push(value);
  }

  return result.join('')
}

/**
 * @typedef {import('micromark-util-types').Extension} Extension
 */


/** @satisfies {Extension['document']} */
const document$1 = {
  [codes.asterisk]: list,
  [codes.plusSign]: list,
  [codes.dash]: list,
  [codes.digit0]: list,
  [codes.digit1]: list,
  [codes.digit2]: list,
  [codes.digit3]: list,
  [codes.digit4]: list,
  [codes.digit5]: list,
  [codes.digit6]: list,
  [codes.digit7]: list,
  [codes.digit8]: list,
  [codes.digit9]: list,
  [codes.greaterThan]: blockQuote
};

/** @satisfies {Extension['contentInitial']} */
const contentInitial = {
  [codes.leftSquareBracket]: definition
};

/** @satisfies {Extension['flowInitial']} */
const flowInitial = {
  [codes.horizontalTab]: codeIndented,
  [codes.virtualSpace]: codeIndented,
  [codes.space]: codeIndented
};

/** @satisfies {Extension['flow']} */
const flow = {
  [codes.numberSign]: headingAtx,
  [codes.asterisk]: thematicBreak,
  [codes.dash]: [setextUnderline, thematicBreak],
  [codes.lessThan]: htmlFlow,
  [codes.equalsTo]: setextUnderline,
  [codes.underscore]: thematicBreak,
  [codes.graveAccent]: codeFenced,
  [codes.tilde]: codeFenced
};

/** @satisfies {Extension['string']} */
const string = {
  [codes.ampersand]: characterReference,
  [codes.backslash]: characterEscape
};

/** @satisfies {Extension['text']} */
const text = {
  [codes.carriageReturn]: lineEnding,
  [codes.lineFeed]: lineEnding,
  [codes.carriageReturnLineFeed]: lineEnding,
  [codes.exclamationMark]: labelStartImage,
  [codes.ampersand]: characterReference,
  [codes.asterisk]: attention,
  [codes.lessThan]: [autolink, htmlText],
  [codes.leftSquareBracket]: labelStartLink,
  [codes.backslash]: [hardBreakEscape, characterEscape],
  [codes.rightSquareBracket]: labelEnd,
  [codes.underscore]: attention,
  [codes.graveAccent]: codeText
};

/** @satisfies {Extension['insideSpan']} */
const insideSpan = {null: [attention, resolver]};

/** @satisfies {Extension['attentionMarkers']} */
const attentionMarkers = {null: [codes.asterisk, codes.underscore]};

/** @satisfies {Extension['disable']} */
const disable = {null: []};

var defaultConstructs = {
	__proto__: null,
	attentionMarkers: attentionMarkers,
	contentInitial: contentInitial,
	disable: disable,
	document: document$1,
	flow: flow,
	flowInitial: flowInitial,
	insideSpan: insideSpan,
	string: string,
	text: text
};

/**
 * @typedef {import('micromark-util-types').Create} Create
 * @typedef {import('micromark-util-types').FullNormalizedExtension} FullNormalizedExtension
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').ParseContext} ParseContext
 * @typedef {import('micromark-util-types').ParseOptions} ParseOptions
 */


/**
 * @param {ParseOptions | null | undefined} [options]
 * @returns {ParseContext}
 */
function parse(options) {
  const settings = options || {};
  const constructs = /** @type {FullNormalizedExtension} */ (
    combineExtensions([defaultConstructs, ...(settings.extensions || [])])
  );

  /** @type {ParseContext} */
  const parser = {
    defined: [],
    lazy: {},
    constructs,
    content: create(content$1),
    document: create(document$2),
    flow: create(flow$1),
    string: create(string$1),
    text: create(text$1)
  };

  return parser

  /**
   * @param {InitialConstruct} initial
   */
  function create(initial) {
    return creator
    /** @type {Create} */
    function creator(from) {
      return createTokenizer(parser, initial, from)
    }
  }
}

/**
 * @typedef {import('micromark-util-types').Chunk} Chunk
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Encoding} Encoding
 * @typedef {import('micromark-util-types').Value} Value
 */


const search = /[\0\t\n\r]/g;

/**
 * @returns {Preprocessor}
 */
function preprocess() {
  let column = 1;
  let buffer = '';
  /** @type {boolean | undefined} */
  let start = true;
  /** @type {boolean | undefined} */
  let atCarriageReturn;

  return preprocessor

  /** @type {Preprocessor} */
  function preprocessor(value, encoding, end) {
    /** @type {Array<Chunk>} */
    const chunks = [];
    /** @type {RegExpMatchArray | null} */
    let match;
    /** @type {number} */
    let next;
    /** @type {number} */
    let startPosition;
    /** @type {number} */
    let endPosition;
    /** @type {Code} */
    let code;

    // @ts-expect-error `Buffer` does allow an encoding.
    value = buffer + value.toString(encoding);
    startPosition = 0;
    buffer = '';

    if (start) {
      // To do: `markdown-rs` actually parses BOMs (byte order mark).
      if (value.charCodeAt(0) === codes.byteOrderMarker) {
        startPosition++;
      }

      start = undefined;
    }

    while (startPosition < value.length) {
      search.lastIndex = startPosition;
      match = search.exec(value);
      endPosition =
        match && match.index !== undefined ? match.index : value.length;
      code = value.charCodeAt(endPosition);

      if (!match) {
        buffer = value.slice(startPosition);
        break
      }

      if (
        code === codes.lf &&
        startPosition === endPosition &&
        atCarriageReturn
      ) {
        chunks.push(codes.carriageReturnLineFeed);
        atCarriageReturn = undefined;
      } else {
        if (atCarriageReturn) {
          chunks.push(codes.carriageReturn);
          atCarriageReturn = undefined;
        }

        if (startPosition < endPosition) {
          chunks.push(value.slice(startPosition, endPosition));
          column += endPosition - startPosition;
        }

        switch (code) {
          case codes.nul: {
            chunks.push(codes.replacementCharacter);
            column++;

            break
          }

          case codes.ht: {
            next = Math.ceil(column / constants.tabSize) * constants.tabSize;
            chunks.push(codes.horizontalTab);
            while (column++ < next) chunks.push(codes.virtualSpace);

            break
          }

          case codes.lf: {
            chunks.push(codes.lineFeed);
            column = 1;

            break
          }

          default: {
            atCarriageReturn = true;
            column = 1;
          }
        }
      }

      startPosition = endPosition + 1;
    }

    if (end) {
      if (atCarriageReturn) chunks.push(codes.carriageReturn);
      if (buffer) chunks.push(buffer);
      chunks.push(codes.eof);
    }

    return chunks
  }
}

/**
 * @typedef {import('micromark-util-types').Event} Event
 */


/**
 * @param {Array<Event>} events
 * @returns {Array<Event>}
 */
function postprocess(events) {
  while (!subtokenize(events)) {
    // Empty
  }

  return events
}

/**
 * Turn the number (in string form as either hexa- or plain decimal) coming from
 * a numeric character reference into a character.
 *
 * Sort of like `String.fromCharCode(Number.parseInt(value, base))`, but makes
 * non-characters and control characters safe.
 *
 * @param {string} value
 *   Value to decode.
 * @param {number} base
 *   Numeric base.
 * @returns {string}
 *   Character.
 */
function decodeNumericCharacterReference(value, base) {
  const code = Number.parseInt(value, base);

  if (
    // C0 except for HT, LF, FF, CR, space.
    code < codes.ht ||
    code === codes.vt ||
    (code > codes.cr && code < codes.space) ||
    // Control character (DEL) of C0, and C1 controls.
    (code > codes.tilde && code < 160) ||
    // Lone high surrogates and low surrogates.
    (code > 55295 && code < 57344) ||
    // Noncharacters.
    (code > 64975 && code < 65008) ||
    /* eslint-disable no-bitwise */
    (code & 65535) === 65535 ||
    (code & 65535) === 65534 ||
    /* eslint-enable no-bitwise */
    // Out of range
    code > 1114111
  ) {
    return values.replacementCharacter
  }

  return String.fromCharCode(code)
}

const characterEscapeOrReference =
  /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;

/**
 * Decode markdown strings (which occur in places such as fenced code info
 * strings, destinations, labels, and titles).
 *
 * The “string” content type allows character escapes and -references.
 * This decodes those.
 *
 * @param {string} value
 *   Value to decode.
 * @returns {string}
 *   Decoded value.
 */
function decodeString(value) {
  return value.replace(characterEscapeOrReference, decode)
}

/**
 * @param {string} $0
 * @param {string} $1
 * @param {string} $2
 * @returns {string}
 */
function decode($0, $1, $2) {
  if ($1) {
    // Escape.
    return $1
  }

  // Reference.
  const head = $2.charCodeAt(0);

  if (head === codes.numberSign) {
    const head = $2.charCodeAt(1);
    const hex = head === codes.lowercaseX || head === codes.uppercaseX;
    return decodeNumericCharacterReference(
      $2.slice(hex ? 2 : 1),
      hex ? constants.numericBaseHexadecimal : constants.numericBaseDecimal
    )
  }

  return decodeNamedCharacterReference($2) || $0
}

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Point} Point
 * @typedef {import('unist').Position} Position
 */

/**
 * @typedef NodeLike
 * @property {string} type
 * @property {PositionLike | null | undefined} [position]
 *
 * @typedef PositionLike
 * @property {PointLike | null | undefined} [start]
 * @property {PointLike | null | undefined} [end]
 *
 * @typedef PointLike
 * @property {number | null | undefined} [line]
 * @property {number | null | undefined} [column]
 * @property {number | null | undefined} [offset]
 */

/**
 * Serialize the positional info of a point, position (start and end points),
 * or node.
 *
 * @param {Node | NodeLike | Position | PositionLike | Point | PointLike | null | undefined} [value]
 *   Node, position, or point.
 * @returns {string}
 *   Pretty printed positional info of a node (`string`).
 *
 *   In the format of a range `ls:cs-le:ce` (when given `node` or `position`)
 *   or a point `l:c` (when given `point`), where `l` stands for line, `c` for
 *   column, `s` for `start`, and `e` for end.
 *   An empty string (`''`) is returned if the given value is neither `node`,
 *   `position`, nor `point`.
 */
function stringifyPosition(value) {
  // Nothing.
  if (!value || typeof value !== 'object') {
    return ''
  }

  // Node.
  if ('position' in value || 'type' in value) {
    return position(value.position)
  }

  // Position.
  if ('start' in value || 'end' in value) {
    return position(value)
  }

  // Point.
  if ('line' in value || 'column' in value) {
    return point$1(value)
  }

  // ?
  return ''
}

/**
 * @param {Point | PointLike | null | undefined} point
 * @returns {string}
 */
function point$1(point) {
  return index(point && point.line) + ':' + index(point && point.column)
}

/**
 * @param {Position | PositionLike | null | undefined} pos
 * @returns {string}
 */
function position(pos) {
  return point$1(pos && pos.start) + '-' + point$1(pos && pos.end)
}

/**
 * @param {number | null | undefined} value
 * @returns {number}
 */
function index(value) {
  return value && typeof value === 'number' ? value : 1
}

/**
 * @typedef {import('micromark-util-types').Encoding} Encoding
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').ParseOptions} ParseOptions
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Value} Value
 *
 * @typedef {import('unist').Parent} UnistParent
 * @typedef {import('unist').Point} Point
 *
 * @typedef {import('mdast').PhrasingContent} PhrasingContent
 * @typedef {import('mdast').StaticPhrasingContent} StaticPhrasingContent
 * @typedef {import('mdast').Content} Content
 * @typedef {import('mdast').Break} Break
 * @typedef {import('mdast').Blockquote} Blockquote
 * @typedef {import('mdast').Code} Code
 * @typedef {import('mdast').Definition} Definition
 * @typedef {import('mdast').Emphasis} Emphasis
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('mdast').HTML} HTML
 * @typedef {import('mdast').Image} Image
 * @typedef {import('mdast').ImageReference} ImageReference
 * @typedef {import('mdast').InlineCode} InlineCode
 * @typedef {import('mdast').Link} Link
 * @typedef {import('mdast').LinkReference} LinkReference
 * @typedef {import('mdast').List} List
 * @typedef {import('mdast').ListItem} ListItem
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').Strong} Strong
 * @typedef {import('mdast').Text} Text
 * @typedef {import('mdast').ThematicBreak} ThematicBreak
 * @typedef {import('mdast').ReferenceType} ReferenceType
 * @typedef {import('../index.js').CompileData} CompileData
 */


const own = {}.hasOwnProperty;

/**
 * @param value
 *   Markdown to parse.
 * @param encoding
 *   Character encoding for when `value` is `Buffer`.
 * @param options
 *   Configuration.
 * @returns
 *   mdast tree.
 */
const fromMarkdown =
  /**
   * @type {(
   *   ((value: Value, encoding: Encoding, options?: Options | null | undefined) => Root) &
   *   ((value: Value, options?: Options | null | undefined) => Root)
   * )}
   */
  (
    /**
     * @param {Value} value
     * @param {Encoding | Options | null | undefined} [encoding]
     * @param {Options | null | undefined} [options]
     * @returns {Root}
     */
    function (value, encoding, options) {
      if (typeof encoding !== 'string') {
        options = encoding;
        encoding = undefined;
      }

      return compiler(options)(
        postprocess(
          parse(options).document().write(preprocess()(value, encoding, true))
        )
      )
    }
  );

/**
 * Note this compiler only understand complete buffering, not streaming.
 *
 * @param {Options | null | undefined} [options]
 */
function compiler(options) {
  /** @type {Config} */
  const config = {
    transforms: [],
    canContainEols: ['emphasis', 'fragment', 'heading', 'paragraph', 'strong'],
    enter: {
      autolink: opener(link),
      autolinkProtocol: onenterdata,
      autolinkEmail: onenterdata,
      atxHeading: opener(heading),
      blockQuote: opener(blockQuote),
      characterEscape: onenterdata,
      characterReference: onenterdata,
      codeFenced: opener(codeFlow),
      codeFencedFenceInfo: buffer,
      codeFencedFenceMeta: buffer,
      codeIndented: opener(codeFlow, buffer),
      codeText: opener(codeText, buffer),
      codeTextData: onenterdata,
      data: onenterdata,
      codeFlowValue: onenterdata,
      definition: opener(definition),
      definitionDestinationString: buffer,
      definitionLabelString: buffer,
      definitionTitleString: buffer,
      emphasis: opener(emphasis),
      hardBreakEscape: opener(hardBreak),
      hardBreakTrailing: opener(hardBreak),
      htmlFlow: opener(html, buffer),
      htmlFlowData: onenterdata,
      htmlText: opener(html, buffer),
      htmlTextData: onenterdata,
      image: opener(image),
      label: buffer,
      link: opener(link),
      listItem: opener(listItem),
      listItemValue: onenterlistitemvalue,
      listOrdered: opener(list, onenterlistordered),
      listUnordered: opener(list),
      paragraph: opener(paragraph),
      reference: onenterreference,
      referenceString: buffer,
      resourceDestinationString: buffer,
      resourceTitleString: buffer,
      setextHeading: opener(heading),
      strong: opener(strong),
      thematicBreak: opener(thematicBreak)
    },
    exit: {
      atxHeading: closer(),
      atxHeadingSequence: onexitatxheadingsequence,
      autolink: closer(),
      autolinkEmail: onexitautolinkemail,
      autolinkProtocol: onexitautolinkprotocol,
      blockQuote: closer(),
      characterEscapeValue: onexitdata,
      characterReferenceMarkerHexadecimal: onexitcharacterreferencemarker,
      characterReferenceMarkerNumeric: onexitcharacterreferencemarker,
      characterReferenceValue: onexitcharacterreferencevalue,
      codeFenced: closer(onexitcodefenced),
      codeFencedFence: onexitcodefencedfence,
      codeFencedFenceInfo: onexitcodefencedfenceinfo,
      codeFencedFenceMeta: onexitcodefencedfencemeta,
      codeFlowValue: onexitdata,
      codeIndented: closer(onexitcodeindented),
      codeText: closer(onexitcodetext),
      codeTextData: onexitdata,
      data: onexitdata,
      definition: closer(),
      definitionDestinationString: onexitdefinitiondestinationstring,
      definitionLabelString: onexitdefinitionlabelstring,
      definitionTitleString: onexitdefinitiontitlestring,
      emphasis: closer(),
      hardBreakEscape: closer(onexithardbreak),
      hardBreakTrailing: closer(onexithardbreak),
      htmlFlow: closer(onexithtmlflow),
      htmlFlowData: onexitdata,
      htmlText: closer(onexithtmltext),
      htmlTextData: onexitdata,
      image: closer(onexitimage),
      label: onexitlabel,
      labelText: onexitlabeltext,
      lineEnding: onexitlineending,
      link: closer(onexitlink),
      listItem: closer(),
      listOrdered: closer(),
      listUnordered: closer(),
      paragraph: closer(),
      referenceString: onexitreferencestring,
      resourceDestinationString: onexitresourcedestinationstring,
      resourceTitleString: onexitresourcetitlestring,
      resource: onexitresource,
      setextHeading: closer(onexitsetextheading),
      setextHeadingLineSequence: onexitsetextheadinglinesequence,
      setextHeadingText: onexitsetextheadingtext,
      strong: closer(),
      thematicBreak: closer()
    }
  };

  configure(config, (options || {}).mdastExtensions || []);

  /** @type {CompileData} */
  const data = {};

  return compile

  /**
   * Turn micromark events into an mdast tree.
   *
   * @param {Array<Event>} events
   *   Events.
   * @returns {Root}
   *   mdast tree.
   */
  function compile(events) {
    /** @type {Root} */
    let tree = {type: 'root', children: []};
    /** @type {Omit<CompileContext, 'sliceSerialize'>} */
    const context = {
      stack: [tree],
      tokenStack: [],
      config,
      enter,
      exit,
      buffer,
      resume,
      setData,
      getData
    };
    /** @type {Array<number>} */
    const listStack = [];
    let index = -1;

    while (++index < events.length) {
      // We preprocess lists to add `listItem` tokens, and to infer whether
      // items the list itself are spread out.
      if (
        events[index][1].type === types.listOrdered ||
        events[index][1].type === types.listUnordered
      ) {
        if (events[index][0] === 'enter') {
          listStack.push(index);
        } else {
          const tail = listStack.pop();
          ok(typeof tail === 'number', 'expected list ot be open');
          index = prepareList(events, tail, index);
        }
      }
    }

    index = -1;

    while (++index < events.length) {
      const handler = config[events[index][0]];

      if (own.call(handler, events[index][1].type)) {
        handler[events[index][1].type].call(
          Object.assign(
            {sliceSerialize: events[index][2].sliceSerialize},
            context
          ),
          events[index][1]
        );
      }
    }

    // Handle tokens still being open.
    if (context.tokenStack.length > 0) {
      const tail = context.tokenStack[context.tokenStack.length - 1];
      const handler = tail[1] || defaultOnError;
      handler.call(context, undefined, tail[0]);
    }

    // Figure out `root` position.
    tree.position = {
      start: point(
        events.length > 0 ? events[0][1].start : {line: 1, column: 1, offset: 0}
      ),
      end: point(
        events.length > 0
          ? events[events.length - 2][1].end
          : {line: 1, column: 1, offset: 0}
      )
    };

    // Call transforms.
    index = -1;
    while (++index < config.transforms.length) {
      tree = config.transforms[index](tree) || tree;
    }

    return tree
  }

  /**
   * @param {Array<Event>} events
   * @param {number} start
   * @param {number} length
   * @returns {number}
   */
  function prepareList(events, start, length) {
    let index = start - 1;
    let containerBalance = -1;
    let listSpread = false;
    /** @type {Token | undefined} */
    let listItem;
    /** @type {number | undefined} */
    let lineIndex;
    /** @type {number | undefined} */
    let firstBlankLineIndex;
    /** @type {boolean | undefined} */
    let atMarker;

    while (++index <= length) {
      const event = events[index];

      if (
        event[1].type === types.listUnordered ||
        event[1].type === types.listOrdered ||
        event[1].type === types.blockQuote
      ) {
        if (event[0] === 'enter') {
          containerBalance++;
        } else {
          containerBalance--;
        }

        atMarker = undefined;
      } else if (event[1].type === types.lineEndingBlank) {
        if (event[0] === 'enter') {
          if (
            listItem &&
            !atMarker &&
            !containerBalance &&
            !firstBlankLineIndex
          ) {
            firstBlankLineIndex = index;
          }

          atMarker = undefined;
        }
      } else if (
        event[1].type === types.linePrefix ||
        event[1].type === types.listItemValue ||
        event[1].type === types.listItemMarker ||
        event[1].type === types.listItemPrefix ||
        event[1].type === types.listItemPrefixWhitespace
      ) ; else {
        atMarker = undefined;
      }

      if (
        (!containerBalance &&
          event[0] === 'enter' &&
          event[1].type === types.listItemPrefix) ||
        (containerBalance === -1 &&
          event[0] === 'exit' &&
          (event[1].type === types.listUnordered ||
            event[1].type === types.listOrdered))
      ) {
        if (listItem) {
          let tailIndex = index;
          lineIndex = undefined;

          while (tailIndex--) {
            const tailEvent = events[tailIndex];

            if (
              tailEvent[1].type === types.lineEnding ||
              tailEvent[1].type === types.lineEndingBlank
            ) {
              if (tailEvent[0] === 'exit') continue

              if (lineIndex) {
                events[lineIndex][1].type = types.lineEndingBlank;
                listSpread = true;
              }

              tailEvent[1].type = types.lineEnding;
              lineIndex = tailIndex;
            } else if (
              tailEvent[1].type === types.linePrefix ||
              tailEvent[1].type === types.blockQuotePrefix ||
              tailEvent[1].type === types.blockQuotePrefixWhitespace ||
              tailEvent[1].type === types.blockQuoteMarker ||
              tailEvent[1].type === types.listItemIndent
            ) ; else {
              break
            }
          }

          if (
            firstBlankLineIndex &&
            (!lineIndex || firstBlankLineIndex < lineIndex)
          ) {
            listItem._spread = true;
          }

          // Fix position.
          listItem.end = Object.assign(
            {},
            lineIndex ? events[lineIndex][1].start : event[1].end
          );

          events.splice(lineIndex || index, 0, ['exit', listItem, event[2]]);
          index++;
          length++;
        }

        // Create a new list item.
        if (event[1].type === types.listItemPrefix) {
          listItem = {
            type: 'listItem',
            _spread: false,
            start: Object.assign({}, event[1].start),
            // @ts-expect-error: we’ll add `end` in a second.
            end: undefined
          };
          // @ts-expect-error: `listItem` is most definitely defined, TS...
          events.splice(index, 0, ['enter', listItem, event[2]]);
          index++;
          length++;
          firstBlankLineIndex = undefined;
          atMarker = true;
        }
      }
    }

    events[start][1]._spread = listSpread;
    return length
  }

  /**
   * Set data.
   *
   * @template {keyof CompileData} Key
   *   Field type.
   * @param {Key} key
   *   Key of field.
   * @param {CompileData[Key]} [value]
   *   New value.
   * @returns {void}
   *   Nothing.
   */
  function setData(key, value) {
    data[key] = value;
  }

  /**
   * Get data.
   *
   * @template {keyof CompileData} Key
   *   Field type.
   * @param {Key} key
   *   Key of field.
   * @returns {CompileData[Key]}
   *   Value.
   */
  function getData(key) {
    return data[key]
  }

  /**
   * Create an opener handle.
   *
   * @param {(token: Token) => Node} create
   *   Create a node.
   * @param {Handle} [and]
   *   Optional function to also run.
   * @returns {Handle}
   *   Handle.
   */
  function opener(create, and) {
    return open

    /**
     * @this {CompileContext}
     * @param {Token} token
     * @returns {void}
     */
    function open(token) {
      enter.call(this, create(token), token);
      if (and) and.call(this, token);
    }
  }

  /**
   * @this {CompileContext}
   * @returns {void}
   */
  function buffer() {
    this.stack.push({type: 'fragment', children: []});
  }

  /**
   * @template {Node} Kind
   *   Node type.
   * @this {CompileContext}
   *   Context.
   * @param {Kind} node
   *   Node to enter.
   * @param {Token} token
   *   Corresponding token.
   * @param {OnEnterError | undefined} [errorHandler]
   *   Handle the case where this token is open, but it is closed by something else.
   * @returns {Kind}
   *   The given node.
   */
  function enter(node, token, errorHandler) {
    const parent = this.stack[this.stack.length - 1];
    ok(parent, 'expected `parent`');
    ok('children' in parent, 'expected `parent`');
    // @ts-expect-error: Assume `Node` can exist as a child of `parent`.
    parent.children.push(node);
    this.stack.push(node);
    this.tokenStack.push([token, errorHandler]);
    // @ts-expect-error: `end` will be patched later.
    node.position = {start: point(token.start)};
    return node
  }

  /**
   * Create a closer handle.
   *
   * @param {Handle} [and]
   *   Optional function to also run.
   * @returns {Handle}
   *   Handle.
   */
  function closer(and) {
    return close

    /**
     * @this {CompileContext}
     * @param {Token} token
     * @returns {void}
     */
    function close(token) {
      if (and) and.call(this, token);
      exit.call(this, token);
    }
  }

  /**
   * @this {CompileContext}
   *   Context.
   * @param {Token} token
   *   Corresponding token.
   * @param {OnExitError | undefined} [onExitError]
   *   Handle the case where another token is open.
   * @returns {Node}
   *   The closed node.
   */
  function exit(token, onExitError) {
    const node = this.stack.pop();
    ok(node, 'expected `node`');
    const open = this.tokenStack.pop();

    if (!open) {
      throw new Error(
        'Cannot close `' +
          token.type +
          '` (' +
          stringifyPosition({start: token.start, end: token.end}) +
          '): it’s not open'
      )
    } else if (open[0].type !== token.type) {
      if (onExitError) {
        onExitError.call(this, token, open[0]);
      } else {
        const handler = open[1] || defaultOnError;
        handler.call(this, token, open[0]);
      }
    }

    ok(node.type !== 'fragment', 'unexpected fragment `exit`ed');
    ok(node.position, 'expected `position` to be defined');
    node.position.end = point(token.end);
    return node
  }

  /**
   * @this {CompileContext}
   * @returns {string}
   */
  function resume() {
    return toString(this.stack.pop())
  }

  //
  // Handlers.
  //

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterlistordered() {
    setData('expectingFirstListItemValue', true);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterlistitemvalue(token) {
    if (getData('expectingFirstListItemValue')) {
      const ancestor = this.stack[this.stack.length - 2];
      ok(ancestor, 'expected nodes on stack');
      ok(ancestor.type === 'list', 'expected list on stack');
      ancestor.start = Number.parseInt(
        this.sliceSerialize(token),
        constants.numericBaseDecimal
      );
      setData('expectingFirstListItemValue');
    }
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefencedfenceinfo() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    ok(node, 'expected node on stack');
    ok(node.type === 'code', 'expected code on stack');
    node.lang = data;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefencedfencemeta() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    ok(node, 'expected node on stack');
    ok(node.type === 'code', 'expected code on stack');
    node.meta = data;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefencedfence() {
    // Exit if this is the closing fence.
    if (getData('flowCodeInside')) return
    this.buffer();
    setData('flowCodeInside', true);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefenced() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    ok(node, 'expected node on stack');
    ok(node.type === 'code', 'expected code on stack');

    node.value = data.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, '');
    setData('flowCodeInside');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodeindented() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    ok(node, 'expected node on stack');
    ok(node.type === 'code', 'expected code on stack');

    node.value = data.replace(/(\r?\n|\r)$/g, '');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitdefinitionlabelstring(token) {
    const label = this.resume();
    const node = this.stack[this.stack.length - 1];
    ok(node, 'expected node on stack');
    ok(node.type === 'definition', 'expected definition on stack');

    node.label = label;
    node.identifier = normalizeIdentifier(
      this.sliceSerialize(token)
    ).toLowerCase();
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitdefinitiontitlestring() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    ok(node, 'expected node on stack');
    ok(node.type === 'definition', 'expected definition on stack');

    node.title = data;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitdefinitiondestinationstring() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    ok(node, 'expected node on stack');
    ok(node.type === 'definition', 'expected definition on stack');

    node.url = data;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitatxheadingsequence(token) {
    const node = this.stack[this.stack.length - 1];
    ok(node, 'expected node on stack');
    ok(node.type === 'heading', 'expected heading on stack');

    if (!node.depth) {
      const depth = this.sliceSerialize(token).length;

      ok(
        depth === 1 ||
          depth === 2 ||
          depth === 3 ||
          depth === 4 ||
          depth === 5 ||
          depth === 6,
        'expected `depth` between `1` and `6`'
      );

      node.depth = depth;
    }
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitsetextheadingtext() {
    setData('setextHeadingSlurpLineEnding', true);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitsetextheadinglinesequence(token) {
    const node = this.stack[this.stack.length - 1];
    ok(node, 'expected node on stack');
    ok(node.type === 'heading', 'expected heading on stack');

    node.depth =
      this.sliceSerialize(token).charCodeAt(0) === codes.equalsTo ? 1 : 2;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitsetextheading() {
    setData('setextHeadingSlurpLineEnding');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onenterdata(token) {
    const node = this.stack[this.stack.length - 1];
    ok(node, 'expected node on stack');
    ok('children' in node, 'expected parent on stack');

    let tail = node.children[node.children.length - 1];

    if (!tail || tail.type !== 'text') {
      // Add a new text node.
      tail = text();
      // @ts-expect-error: we’ll add `end` later.
      tail.position = {start: point(token.start)};
      // @ts-expect-error: Assume `parent` accepts `text`.
      node.children.push(tail);
    }

    this.stack.push(tail);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitdata(token) {
    const tail = this.stack.pop();
    ok(tail, 'expected a `node` to be on the stack');
    ok('value' in tail, 'expected a `literal` to be on the stack');
    ok(tail.position, 'expected `node` to have an open position');
    tail.value += this.sliceSerialize(token);
    tail.position.end = point(token.end);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitlineending(token) {
    const context = this.stack[this.stack.length - 1];
    ok(context, 'expected `node`');

    // If we’re at a hard break, include the line ending in there.
    if (getData('atHardBreak')) {
      ok('children' in context, 'expected `parent`');
      const tail = context.children[context.children.length - 1];
      ok(tail.position, 'expected tail to have a starting position');
      tail.position.end = point(token.end);
      setData('atHardBreak');
      return
    }

    if (
      !getData('setextHeadingSlurpLineEnding') &&
      config.canContainEols.includes(context.type)
    ) {
      onenterdata.call(this, token);
      onexitdata.call(this, token);
    }
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexithardbreak() {
    setData('atHardBreak', true);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexithtmlflow() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    ok(node, 'expected node on stack');
    ok(node.type === 'html', 'expected html on stack');

    node.value = data;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexithtmltext() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    ok(node, 'expected node on stack');
    ok(node.type === 'html', 'expected html on stack');

    node.value = data;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitcodetext() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    ok(node, 'expected node on stack');
    ok(node.type === 'inlineCode', 'expected inline code on stack');

    node.value = data;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitlink() {
    const node = this.stack[this.stack.length - 1];
    ok(node, 'expected node on stack');
    ok(node.type === 'link', 'expected link on stack');

    // Note: there are also `identifier` and `label` fields on this link node!
    // These are used / cleaned here.

    // To do: clean.
    if (getData('inReference')) {
      /** @type {ReferenceType} */
      const referenceType = getData('referenceType') || 'shortcut';

      node.type += 'Reference';
      // @ts-expect-error: mutate.
      node.referenceType = referenceType;
      // @ts-expect-error: mutate.
      delete node.url;
      delete node.title;
    } else {
      // @ts-expect-error: mutate.
      delete node.identifier;
      // @ts-expect-error: mutate.
      delete node.label;
    }

    setData('referenceType');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitimage() {
    const node = this.stack[this.stack.length - 1];
    ok(node, 'expected node on stack');
    ok(node.type === 'image', 'expected image on stack');

    // Note: there are also `identifier` and `label` fields on this link node!
    // These are used / cleaned here.

    // To do: clean.
    if (getData('inReference')) {
      /** @type {ReferenceType} */
      const referenceType = getData('referenceType') || 'shortcut';

      node.type += 'Reference';
      // @ts-expect-error: mutate.
      node.referenceType = referenceType;
      // @ts-expect-error: mutate.
      delete node.url;
      delete node.title;
    } else {
      // @ts-expect-error: mutate.
      delete node.identifier;
      // @ts-expect-error: mutate.
      delete node.label;
    }

    setData('referenceType');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitlabeltext(token) {
    const string = this.sliceSerialize(token);
    const ancestor = this.stack[this.stack.length - 2];
    ok(ancestor, 'expected ancestor on stack');
    ok(
      ancestor.type === 'image' || ancestor.type === 'link',
      'expected image or link on stack'
    );

    // @ts-expect-error: stash this on the node, as it might become a reference
    // later.
    ancestor.label = decodeString(string);
    // @ts-expect-error: same as above.
    ancestor.identifier = normalizeIdentifier(string).toLowerCase();
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitlabel() {
    const fragment = this.stack[this.stack.length - 1];
    ok(fragment, 'expected node on stack');
    ok(fragment.type === 'fragment', 'expected fragment on stack');
    const value = this.resume();
    const node = this.stack[this.stack.length - 1];
    ok(node, 'expected node on stack');
    ok(
      node.type === 'image' || node.type === 'link',
      'expected image or link on stack'
    );

    // Assume a reference.
    setData('inReference', true);

    if (node.type === 'link') {
      /** @type {Array<StaticPhrasingContent>} */
      // @ts-expect-error: Assume static phrasing content.
      const children = fragment.children;

      node.children = children;
    } else {
      node.alt = value;
    }
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitresourcedestinationstring() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    ok(node, 'expected node on stack');
    ok(
      node.type === 'image' || node.type === 'link',
      'expected image or link on stack'
    );
    node.url = data;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitresourcetitlestring() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    ok(node, 'expected node on stack');
    ok(
      node.type === 'image' || node.type === 'link',
      'expected image or link on stack'
    );
    node.title = data;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitresource() {
    setData('inReference');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onenterreference() {
    setData('referenceType', 'collapsed');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitreferencestring(token) {
    const label = this.resume();
    const node = this.stack[this.stack.length - 1];
    ok(node, 'expected node on stack');
    ok(
      node.type === 'image' || node.type === 'link',
      'expected image reference or link reference on stack'
    );

    // @ts-expect-error: stash this on the node, as it might become a reference
    // later.
    node.label = label;
    // @ts-expect-error: same as above.
    node.identifier = normalizeIdentifier(
      this.sliceSerialize(token)
    ).toLowerCase();
    setData('referenceType', 'full');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitcharacterreferencemarker(token) {
    ok(
      token.type === 'characterReferenceMarkerNumeric' ||
        token.type === 'characterReferenceMarkerHexadecimal'
    );
    setData('characterReferenceType', token.type);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcharacterreferencevalue(token) {
    const data = this.sliceSerialize(token);
    const type = getData('characterReferenceType');
    /** @type {string} */
    let value;

    if (type) {
      value = decodeNumericCharacterReference(
        data,
        type === types.characterReferenceMarkerNumeric
          ? constants.numericBaseDecimal
          : constants.numericBaseHexadecimal
      );
      setData('characterReferenceType');
    } else {
      const result = decodeNamedCharacterReference(data);
      ok(result !== false, 'expected reference to decode');
      value = result;
    }

    const tail = this.stack.pop();
    ok(tail, 'expected `node`');
    ok(tail.position, 'expected `node.position`');
    ok('value' in tail, 'expected `node.value`');
    tail.value += value;
    tail.position.end = point(token.end);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitautolinkprotocol(token) {
    onexitdata.call(this, token);
    const node = this.stack[this.stack.length - 1];
    ok(node, 'expected node on stack');
    ok(node.type === 'link', 'expected link on stack');

    node.url = this.sliceSerialize(token);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitautolinkemail(token) {
    onexitdata.call(this, token);
    const node = this.stack[this.stack.length - 1];
    ok(node, 'expected node on stack');
    ok(node.type === 'link', 'expected link on stack');

    node.url = 'mailto:' + this.sliceSerialize(token);
  }

  //
  // Creaters.
  //

  /** @returns {Blockquote} */
  function blockQuote() {
    return {type: 'blockquote', children: []}
  }

  /** @returns {Code} */
  function codeFlow() {
    return {type: 'code', lang: null, meta: null, value: ''}
  }

  /** @returns {InlineCode} */
  function codeText() {
    return {type: 'inlineCode', value: ''}
  }

  /** @returns {Definition} */
  function definition() {
    return {
      type: 'definition',
      identifier: '',
      label: null,
      title: null,
      url: ''
    }
  }

  /** @returns {Emphasis} */
  function emphasis() {
    return {type: 'emphasis', children: []}
  }

  /** @returns {Heading} */
  function heading() {
    // @ts-expect-error `depth` will be set later.
    return {type: 'heading', depth: undefined, children: []}
  }

  /** @returns {Break} */
  function hardBreak() {
    return {type: 'break'}
  }

  /** @returns {HTML} */
  function html() {
    return {type: 'html', value: ''}
  }

  /** @returns {Image} */
  function image() {
    return {type: 'image', title: null, url: '', alt: null}
  }

  /** @returns {Link} */
  function link() {
    return {type: 'link', title: null, url: '', children: []}
  }

  /**
   * @param {Token} token
   * @returns {List}
   */
  function list(token) {
    return {
      type: 'list',
      ordered: token.type === 'listOrdered',
      start: null,
      spread: token._spread,
      children: []
    }
  }

  /**
   * @param {Token} token
   * @returns {ListItem}
   */
  function listItem(token) {
    return {
      type: 'listItem',
      spread: token._spread,
      checked: null,
      children: []
    }
  }

  /** @returns {Paragraph} */
  function paragraph() {
    return {type: 'paragraph', children: []}
  }

  /** @returns {Strong} */
  function strong() {
    return {type: 'strong', children: []}
  }

  /** @returns {Text} */
  function text() {
    return {type: 'text', value: ''}
  }

  /** @returns {ThematicBreak} */
  function thematicBreak() {
    return {type: 'thematicBreak'}
  }
}

/**
 * Copy a point-like value.
 *
 * @param {Point} d
 *   Point-like value.
 * @returns {Point}
 *   unist point.
 */
function point(d) {
  return {line: d.line, column: d.column, offset: d.offset}
}

/**
 * @param {Config} combined
 * @param {Array<Extension | Array<Extension>>} extensions
 * @returns {void}
 */
function configure(combined, extensions) {
  let index = -1;

  while (++index < extensions.length) {
    const value = extensions[index];

    if (Array.isArray(value)) {
      configure(combined, value);
    } else {
      extension(combined, value);
    }
  }
}

/**
 * @param {Config} combined
 * @param {Extension} extension
 * @returns {void}
 */
function extension(combined, extension) {
  /** @type {keyof Extension} */
  let key;

  for (key in extension) {
    if (own.call(extension, key)) {
      if (key === 'canContainEols') {
        const right = extension[key];
        if (right) {
          combined[key].push(...right);
        }
      } else if (key === 'transforms') {
        const right = extension[key];
        if (right) {
          combined[key].push(...right);
        }
      } else if (key === 'enter' || key === 'exit') {
        const right = extension[key];
        if (right) {
          Object.assign(combined[key], right);
        }
      }
    }
  }
}

/** @type {OnEnterError} */
function defaultOnError(left, right) {
  if (left) {
    throw new Error(
      'Cannot close `' +
        left.type +
        '` (' +
        stringifyPosition({start: left.start, end: left.end}) +
        '): a different token (`' +
        right.type +
        '`, ' +
        stringifyPosition({start: right.start, end: right.end}) +
        ') is open'
    )
  } else {
    throw new Error(
      'Cannot close document, a token (`' +
        right.type +
        '`, ' +
        stringifyPosition({start: right.start, end: right.end}) +
        ') is still open'
    )
  }
}

function preprocessMarkdown(markdown) {
  const withoutMultipleNewlines = markdown.replace(/\n{2,}/g, "\n");
  const withoutExtraSpaces = index$1.dedent(withoutMultipleNewlines);
  return withoutExtraSpaces;
}
function markdownToLines(markdown) {
  const preprocessedMarkdown = preprocessMarkdown(markdown);
  const { children } = fromMarkdown(preprocessedMarkdown);
  const lines = [[]];
  let currentLine = 0;
  function processNode(node, parentType = "normal") {
    if (node.type === "text") {
      const textLines = node.value.split("\n");
      textLines.forEach((textLine, index) => {
        if (index !== 0) {
          currentLine++;
          lines.push([]);
        }
        textLine.split(" ").forEach((word) => {
          if (word) {
            lines[currentLine].push({ content: word, type: parentType });
          }
        });
      });
    } else if (node.type === "strong" || node.type === "emphasis") {
      node.children.forEach((contentNode) => {
        processNode(contentNode, node.type);
      });
    }
  }
  children.forEach((treeNode) => {
    if (treeNode.type === "paragraph") {
      treeNode.children.forEach((contentNode) => {
        processNode(contentNode);
      });
    }
  });
  return lines;
}
function markdownToHTML(markdown) {
  const { children } = fromMarkdown(markdown);
  function output(node) {
    if (node.type === "text") {
      return node.value.replace(/\n/g, "<br/>");
    } else if (node.type === "strong") {
      return `<strong>${node.children.map(output).join("")}</strong>`;
    } else if (node.type === "emphasis") {
      return `<em>${node.children.map(output).join("")}</em>`;
    } else if (node.type === "paragraph") {
      return `<p>${node.children.map(output).join("")}</p>`;
    }
    return `Unsupported markdown: ${node.type}`;
  }
  return children.map(output).join("");
}
function splitTextToChars(text) {
  if (Intl.Segmenter) {
    return [...new Intl.Segmenter().segment(text)].map((s) => s.segment);
  }
  return [...text];
}
function splitWordToFitWidth(checkFit, word) {
  const characters = splitTextToChars(word.content);
  return splitWordToFitWidthRecursion(checkFit, [], characters, word.type);
}
function splitWordToFitWidthRecursion(checkFit, usedChars, remainingChars, type) {
  if (remainingChars.length === 0) {
    return [
      { content: usedChars.join(""), type },
      { content: "", type }
    ];
  }
  const [nextChar, ...rest] = remainingChars;
  const newWord = [...usedChars, nextChar];
  if (checkFit([{ content: newWord.join(""), type }])) {
    return splitWordToFitWidthRecursion(checkFit, newWord, rest, type);
  }
  if (usedChars.length === 0 && nextChar) {
    usedChars.push(nextChar);
    remainingChars.shift();
  }
  return [
    { content: usedChars.join(""), type },
    { content: remainingChars.join(""), type }
  ];
}
function splitLineToFitWidth(line, checkFit) {
  if (line.some(({ content }) => content.includes("\n"))) {
    throw new Error("splitLineToFitWidth does not support newlines in the line");
  }
  return splitLineToFitWidthRecursion(line, checkFit);
}
function splitLineToFitWidthRecursion(words, checkFit, lines = [], newLine = []) {
  if (words.length === 0) {
    if (newLine.length > 0) {
      lines.push(newLine);
    }
    return lines.length > 0 ? lines : [];
  }
  let joiner = "";
  if (words[0].content === " ") {
    joiner = " ";
    words.shift();
  }
  const nextWord = words.shift() ?? { content: " ", type: "normal" };
  const lineWithNextWord = [...newLine];
  if (joiner !== "") {
    lineWithNextWord.push({ content: joiner, type: "normal" });
  }
  lineWithNextWord.push(nextWord);
  if (checkFit(lineWithNextWord)) {
    return splitLineToFitWidthRecursion(words, checkFit, lines, lineWithNextWord);
  }
  if (newLine.length > 0) {
    lines.push(newLine);
    words.unshift(nextWord);
  } else if (nextWord.content) {
    const [line, rest] = splitWordToFitWidth(checkFit, nextWord);
    lines.push([line]);
    if (rest.content) {
      words.unshift(rest);
    }
  }
  return splitLineToFitWidthRecursion(words, checkFit, lines);
}
function applyStyle(dom, styleFn) {
  if (styleFn) {
    dom.attr("style", styleFn);
  }
}
function addHtmlSpan(element, node, width, classes, addBackground = false) {
  const fo = element.append("foreignObject");
  const div = fo.append("xhtml:div");
  const label = node.label;
  const labelClass = node.isNode ? "nodeLabel" : "edgeLabel";
  div.html(
    `
    <span class="${labelClass} ${classes}" ` + (node.labelStyle ? 'style="' + node.labelStyle + '"' : "") + ">" + label + "</span>"
  );
  applyStyle(div, node.labelStyle);
  div.style("display", "table-cell");
  div.style("white-space", "nowrap");
  div.style("max-width", width + "px");
  div.attr("xmlns", "http://www.w3.org/1999/xhtml");
  if (addBackground) {
    div.attr("class", "labelBkg");
  }
  let bbox = div.node().getBoundingClientRect();
  if (bbox.width === width) {
    div.style("display", "table");
    div.style("white-space", "break-spaces");
    div.style("width", width + "px");
    bbox = div.node().getBoundingClientRect();
  }
  fo.style("width", bbox.width);
  fo.style("height", bbox.height);
  return fo.node();
}
function createTspan(textElement, lineIndex, lineHeight) {
  return textElement.append("tspan").attr("class", "text-outer-tspan").attr("x", 0).attr("y", lineIndex * lineHeight - 0.1 + "em").attr("dy", lineHeight + "em");
}
function computeWidthOfText(parentNode, lineHeight, line) {
  const testElement = parentNode.append("text");
  const testSpan = createTspan(testElement, 1, lineHeight);
  updateTextContentAndStyles(testSpan, line);
  const textLength = testSpan.node().getComputedTextLength();
  testElement.remove();
  return textLength;
}
function computeDimensionOfText(parentNode, lineHeight, text) {
  var _a;
  const testElement = parentNode.append("text");
  const testSpan = createTspan(testElement, 1, lineHeight);
  updateTextContentAndStyles(testSpan, [{ content: text, type: "normal" }]);
  const textDimension = (_a = testSpan.node()) == null ? void 0 : _a.getBoundingClientRect();
  if (textDimension) {
    testElement.remove();
  }
  return textDimension;
}
function createFormattedText(width, g, structuredText, addBackground = false) {
  const lineHeight = 1.1;
  const labelGroup = g.append("g");
  const bkg = labelGroup.insert("rect").attr("class", "background");
  const textElement = labelGroup.append("text").attr("y", "-10.1");
  let lineIndex = 0;
  for (const line of structuredText) {
    const checkWidth = (line2) => computeWidthOfText(labelGroup, lineHeight, line2) <= width;
    const linesUnderWidth = checkWidth(line) ? [line] : splitLineToFitWidth(line, checkWidth);
    for (const preparedLine of linesUnderWidth) {
      const tspan = createTspan(textElement, lineIndex, lineHeight);
      updateTextContentAndStyles(tspan, preparedLine);
      lineIndex++;
    }
  }
  if (addBackground) {
    const bbox = textElement.node().getBBox();
    const padding = 2;
    bkg.attr("x", -padding).attr("y", -padding).attr("width", bbox.width + 2 * padding).attr("height", bbox.height + 2 * padding);
    return labelGroup.node();
  } else {
    return textElement.node();
  }
}
function updateTextContentAndStyles(tspan, wrappedLine) {
  tspan.text("");
  wrappedLine.forEach((word, index) => {
    const innerTspan = tspan.append("tspan").attr("font-style", word.type === "emphasis" ? "italic" : "normal").attr("class", "text-inner-tspan").attr("font-weight", word.type === "strong" ? "bold" : "normal");
    if (index === 0) {
      innerTspan.text(word.content);
    } else {
      innerTspan.text(" " + word.content);
    }
  });
}
const createText = (el, text = "", {
  style = "",
  isTitle = false,
  classes = "",
  useHtmlLabels = true,
  isNode = true,
  width = 200,
  addSvgBackground = false
} = {}) => {
  index$1.log$1.info("createText", text, style, isTitle, classes, useHtmlLabels, isNode, addSvgBackground);
  if (useHtmlLabels) {
    const htmlText = markdownToHTML(text);
    const node = {
      isNode,
      label: index$1.decodeEntities(htmlText).replace(
        /fa[blrs]?:fa-[\w-]+/g,
        // cspell: disable-line
        (s) => `<i class='${s.replace(":", " ")}'></i>`
      ),
      labelStyle: style.replace("fill:", "color:")
    };
    const vertexNode = addHtmlSpan(el, node, width, classes, addSvgBackground);
    return vertexNode;
  } else {
    const structuredText = markdownToLines(text);
    const svgLabel = createFormattedText(width, el, structuredText, addSvgBackground);
    return svgLabel;
  }
};

exports.computeDimensionOfText = computeDimensionOfText;
exports.createText = createText;
