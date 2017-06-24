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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component_ts__ = __webpack_require__(1);


var data = {
    message: 'Hello World'
};
window.data = data;
var component = new __WEBPACK_IMPORTED_MODULE_0__Component_ts__["a" /* Component */]({
    data: data
});
window.component = component;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Component; });

var Component = (function () {
    function Component(model) {
        this.data = null;
        this.handlers = {
            get: function (target, property, receiver) {
                var path = this.getPropertyPath.call(this, principal, principalKey);
                console.log(path);
                return target[property];
            }
        };
        this.monitorData(model.data);
    }
    ;
    Component.prototype.monitorData = function (object) {
        Object.defineProperty(object, '__model__', {
            configurable: false,
            enumerable: false,
            value: {
                data: {}
            },
            writable: true
        });
        this.monitorProperties.call(this, object, object);
    };
    ;
    Component.prototype.monitorProperties = function (principal, proxy) {
        var propertyKeys = Object.keys(principal);
        for (var propertyIndex = 0; propertyIndex < propertyKeys.length; propertyIndex++) {
            var propertyKey = propertyKeys[propertyIndex];
            if (propertyKey !== '__model__') {
                this.monitorProperty.call(this, principal, propertyKey, proxy, propertyKey);
            }
            ;
        }
        ;
    };
    ;
    Component.prototype.monitorProperty = function (principal, principalKey, proxy, proxyKey) {
        if (principal === proxy) {
            this.establishPropertyBackend(principal, principalKey);
        }
        ;
        var principalValue = principal[principalKey];
        switch (typeof principalValue) {
            case 'number':
            case 'boolean':
            case 'string':
                this.monitorPrimitive.call(this, principal, principalKey, proxy, proxyKey);
                break;
            case 'object':
                this.monitorObject.call(this, principal, principalKey, proxy, proxyKey);
                if (principal === proxy) {
                    this.monitorData.call(this, principalValue);
                    principalValue.__model__.key = principalKey;
                    principalValue.__model__.parent = principal;
                    this.monitorProperties.call(this, principalValue, principalValue);
                    if (Array.isArray(principalValue)) {
                        this.monitorArray.call(this, principal, principalKey, proxy, proxyKey);
                    }
                    ;
                }
                ;
                break;
        }
        ;
    };
    ;
    Component.prototype.monitorPrimitive = function (principal, principalKey, proxy, proxyKey) {
        Object.defineProperty(proxy, proxyKey, {
            configurable: true,
            enumerable: true,
            get: (function () {
                return principal.__model__.data[principalKey];
            }).bind(this),
            set: (function (newValue) {
                var path = this.getPropertyPath.call(this, principal, principalKey);
                console.log('Setting Primitive: ' + path + '.');
                principal.__model__.data[principalKey] = newValue;
                if (primitiveTypes.indexOf(typeof newValue) === -1) {
                    this.monitorProperty.call(this, principal, principalKey, proxy, proxyKey);
                }
                ;
            }).bind(this)
        });
    };
    ;
    Component.prototype.monitorArray = function (principal, principalKey, proxy, proxyKey) {
        Object.defineProperty(proxy, proxyKey, {
            configurable: true,
            enumerable: true,
            get: function () {
                return principal.__model__.data[principalKey];
            },
            set: (function (newValue) {
                console.log('Array modified.');
                principal.__model__.data[principalKey] = newValue;
                if (primitiveTypes.indexOf(typeof newValue) === -1) {
                    this.monitorProperty.call(this, principal, principalKey, proxy, proxyKey);
                }
                ;
            }).bind(this)
        });
        var array = principal[principalKey];
        for (var methodIndex = 0; methodIndex < arrayInterceptMethods.length; methodIndex++) {
            (function () {
                var methodKey = arrayInterceptMethods[methodIndex];
                var methodValue = Array.prototype[methodKey];
                Object.defineProperty(array, methodKey, {
                    configurable: false,
                    enumerable: false,
                    value: function () {
                        console.log('Array modified. Method: ' + methodKey + '.');
                        return methodValue.apply(this, arguments);
                    },
                    writable: false
                });
            })();
        }
        ;
    };
    ;
    Component.prototype.monitorObject = function (principal, principalKey, proxy, proxyKey) {
        Object.defineProperty(proxy, proxyKey, {
            configurable: true,
            enumerable: true,
            get: function () {
                return principal.__model__.data[principalKey];
            },
            set: (function (newValue) {
                console.log('Object modified.');
                principal.__model__.data[principalKey] = newValue;
                if (primitiveTypes.indexOf(typeof newValue) === -1) {
                    this.monitorProperty.call(this, principal, principalKey, proxy, proxyKey);
                }
                ;
            }).bind(this)
        });
    };
    ;
    Component.prototype.establishPropertyBackend = function (object, propertyKey) {
        object.__model__.data[propertyKey] = object[propertyKey];
    };
    ;
    Component.prototype.getPropertyPath = function (object, propertyKey) {
        var path = this.getPropertyPathRecursive.call(this, object, []);
        if (path.length === 0) {
            return propertyKey;
        }
        else {
            return path + '.' + propertyKey;
        }
        ;
    };
    ;
    Component.prototype.getPropertyPathRecursive = function (object, branches) {
        if (object.__model__.key) {
            branches.push(object);
        }
        ;
        if (object.__model__.parent) {
            return this.getPropertyPathRecursive.call(this, object.__model__.parent, branches);
        }
        else {
            var path = '';
            for (var branchIndex = 0; branchIndex < branches.length; branchIndex++) {
                var branch = branches[branchIndex];
                if (branchIndex === 0) {
                    path += branch.__model__.key;
                }
                else {
                    path += '.' + branch.__model__.key;
                }
                ;
            }
            ;
            return path;
        }
        ;
    };
    ;
    return Component;
}());

;


/***/ })
/******/ ]);