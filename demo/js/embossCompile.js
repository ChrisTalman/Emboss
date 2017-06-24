/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utilities_ts__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Constants_ts__ = __webpack_require__(2);

var here = false;


console.log(__WEBPACK_IMPORTED_MODULE_0__Utilities_ts__["a" /* arrayClearEmptyStrings */](['a', '', 'b']));
console.log(__WEBPACK_IMPORTED_MODULE_1__Constants_ts__);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export throwError */
/* harmony export (immutable) */ __webpack_exports__["a"] = arrayClearEmptyStrings;
/* unused harmony export arraySplitStrings */

function throwError(parameters) {
    throw 'EmbossError: ' + parameters.message;
}
;
function arrayClearEmptyStrings(array) {
    while (array.indexOf('') !== -1) {
        array.splice(array.indexOf(''), 1);
    }
    ;
    return array;
}
;
function arraySplitStrings(array, separator) {
    var newArray = [];
    for (var index = 0; index < array.length; index++) {
        var item = array[index];
        var split = item.split(separator);
        newArray = newArray.concat(split);
    }
    ;
    return newArray;
}
;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMPILE", function() { return COMPILE; });

var COMPILE;
(function (COMPILE) {
    COMPILE.BLOATSPACE = /[\f\n\r\t\v​\u00A0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​\u2028\u2029​\u202f\u205f​\u3000]/g;
    var SYNTAX;
    (function (SYNTAX) {
        var HTML;
        (function (HTML) {
            HTML.BLOCK_EXPRESSION = /(<\/?[a-z][a-z0-9]* *(?: *(?:[a-z_:][a-z0-9_:\-]*(?:\.(?:bind))?(?:=(?:(?:"[^"]*")|(?:'[^']*')))?))* *>)/i;
            var ATTRIBUTE;
            (function (ATTRIBUTE) {
                ATTRIBUTE.EXPRESSION = /([a-z_:][a-z0-9_:\-]*(?:\.(?:bind))?)(?:=(?:(?:"([^"]*)")|(?:'([^']*)')))?/ig;
                var INDEXES;
                (function (INDEXES) {
                    INDEXES.NAME = 1;
                    INDEXES.VALUE = 2;
                })(INDEXES = ATTRIBUTE.INDEXES || (ATTRIBUTE.INDEXES = {}));
                ;
            })(ATTRIBUTE = HTML.ATTRIBUTE || (HTML.ATTRIBUTE = {}));
            ;
            var CHILDLESS_KEYWORDS;
            (function (CHILDLESS_KEYWORDS) {
                CHILDLESS_KEYWORDS.AREA = 'area';
                CHILDLESS_KEYWORDS.BR = 'br';
                CHILDLESS_KEYWORDS.EMBED = 'embed';
                CHILDLESS_KEYWORDS.HR = 'hr';
                CHILDLESS_KEYWORDS.IMG = 'img';
                CHILDLESS_KEYWORDS.INPUT = 'input';
                CHILDLESS_KEYWORDS.KEYGEN = 'keygen';
                CHILDLESS_KEYWORDS.LINK = 'link';
                CHILDLESS_KEYWORDS.META = 'meta';
                CHILDLESS_KEYWORDS.PARAM = 'param';
                CHILDLESS_KEYWORDS.SOURCE = 'source';
                CHILDLESS_KEYWORDS.TRACK = 'track';
                CHILDLESS_KEYWORDS.WBR = 'wbr';
            })(CHILDLESS_KEYWORDS = HTML.CHILDLESS_KEYWORDS || (HTML.CHILDLESS_KEYWORDS = {}));
            ;
        })(HTML = SYNTAX.HTML || (SYNTAX.HTML = {}));
        ;
        var EMBOSS;
        (function (EMBOSS) {
            EMBOSS.BLOCK_EXPRESSION = /({{.*?}})/i;
            var KEYWORDS;
            (function (KEYWORDS) {
                KEYWORDS.PRINT = 'print';
                KEYWORDS.IF = 'if';
                KEYWORDS.ELSE_IF = 'elseif';
                KEYWORDS.ELSE = 'ELSE';
                KEYWORDS.FOR = 'for';
                KEYWORDS.EACH = 'each';
                KEYWORDS.IMPORT = 'import';
                KEYWORDS.EXECUTE = 'execute';
                KEYWORDS.IGNORE = 'ignore';
                KEYWORDS.NEGLECT = 'neglect';
            })(KEYWORDS = EMBOSS.KEYWORDS || (EMBOSS.KEYWORDS = {}));
            ;
            var SECOND_ORDER_KEYWORDS;
            (function (SECOND_ORDER_KEYWORDS) {
                SECOND_ORDER_KEYWORDS.IN = 'in';
                SECOND_ORDER_KEYWORDS.COUNT = 'count';
                SECOND_ORDER_KEYWORDS.KEY = 'key';
                SECOND_ORDER_KEYWORDS.CONTEXT = 'context';
            })(SECOND_ORDER_KEYWORDS = EMBOSS.SECOND_ORDER_KEYWORDS || (EMBOSS.SECOND_ORDER_KEYWORDS = {}));
            ;
            var CHILDLESS_KEYWORDS;
            (function (CHILDLESS_KEYWORDS) {
                CHILDLESS_KEYWORDS.PRINT = 'print';
                CHILDLESS_KEYWORDS.IMPORT = 'import';
                CHILDLESS_KEYWORDS.EXECUTE = 'execute';
            })(CHILDLESS_KEYWORDS = EMBOSS.CHILDLESS_KEYWORDS || (EMBOSS.CHILDLESS_KEYWORDS = {}));
            ;
        })(EMBOSS = SYNTAX.EMBOSS || (SYNTAX.EMBOSS = {}));
        ;
    })(SYNTAX = COMPILE.SYNTAX || (COMPILE.SYNTAX = {}));
    ;
    var RENDER;
    (function (RENDER) {
        var IDENTIFIERS;
        (function (IDENTIFIERS) {
            IDENTIFIERS.DATA_OBJECT = 'data';
            IDENTIFIERS.WINDOW_OBJECT = 'window';
        })(IDENTIFIERS = RENDER.IDENTIFIERS || (RENDER.IDENTIFIERS = {}));
        ;
    })(RENDER = COMPILE.RENDER || (COMPILE.RENDER = {}));
    ;
})(COMPILE || (COMPILE = {}));
;


/***/ })
/******/ ]);