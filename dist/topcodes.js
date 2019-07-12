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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/topcodes/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/bluetooth/Bluetooth.js":
/*!************************************!*\
  !*** ./src/bluetooth/Bluetooth.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Bluetooth; });\n/* global navigator TextEncoder TextDecoder $ */\nclass Bluetooth\n{\n    constructor()\n    {\n        this.eventHandlers = {};\n        this.encoder = new TextEncoder('utf-8');\n        this.decoder = new TextDecoder('utf-8');\n        this.characteristic = undefined;\n    }\n\n    async search(options)\n    {\n        let serviceUuid = options.serviceUuid;\n        let characteristicUuid = options.characteristicUuid;\n        \n        try \n        {\n            this.device = await navigator.bluetooth.requestDevice({\n                filters : [{\n                    name: options.name\n                }],\n                optionalServices: [serviceUuid]\n            });\n\n            this.device.addEventListener('gattserverdisconnected', () => this._onDisconnected());\n            let server = await this.device.gatt.connect();\n            let service = await server.getPrimaryService(serviceUuid);\n            this.characteristic = await service.getCharacteristic(characteristicUuid);\n            this.characteristic.addEventListener('characteristicvaluechanged', (event) => this._characteristicChanged(event));\n            this._notify('connected', this.characteristic);\n        } \n        catch (error) \n        {\n            this._notify('connection-failed', {});\n            this._log('Argh! ' + error);\n        }\n    }\n\n    _characteristicChanged(event) {\n        const value = this.decoder.decode( event.target.value ).trim();\n        this._log(`RoPE diz - ${value}` );\n        this._notify('characteristic-changed', value)\n    }\n\n    _notify(event, result) {\n        this.getEventHandlers(event).forEach(function(handler){\n            handler.call(this,result)\n        })\n    }\n\n    _onDisconnected() \n    {\n        this.characteristic = undefined;\n        this._notify('connection-failed')\n    }\n\n    setCharacteristic(value)\n    {\n        const chunks = value.match(/.{1,20}/g);\n        chunks.forEach(chunk=>{\n            this._log(`Tela diz - ${chunk}` );\n            this.characteristic.writeValue(this.encoder.encode(chunk))\n                .then(_ => {})\n                .catch(error => {})    \n        })\n    }\n\n    getEventHandlers(event) \n    {\n        if (!this.eventHandlers[event])\n            this.eventHandlers[event] = [];\n        return this.eventHandlers[event]\n    }\n\n    on(event, handler) \n    {\n        this.getEventHandlers(event).push(handler)\n    }\n\n    isConnected()\n    {\n        return this.characteristic !== undefined;\n    }\n\n    _log(text)\n    {\n        console.log(text);\n    }\n}\n\n\n//# sourceURL=webpack:///./src/bluetooth/Bluetooth.js?");

/***/ }),

/***/ "./src/rope/RoPE.js":
/*!**************************!*\
  !*** ./src/rope/RoPE.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return RoPE; });\n/* harmony import */ var _bluetooth_Bluetooth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../bluetooth/Bluetooth */ \"./src/bluetooth/Bluetooth.js\");\n/**\n * RoPE.\n * He can be programmed!\n */\n\n\nclass RoPE {\n\n    constructor()\n    {\n        this.bluetooth = new _bluetooth_Bluetooth__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    }\n\n    async search() {\n        await this.bluetooth.search(\n            {\n                serviceUuid: '0000ffe0-0000-1000-8000-00805f9b34fb',\n                characteristicUuid: '0000ffe1-0000-1000-8000-00805f9b34fb',\n                name: \"-['.']- RoPE\"\n            }\n        );\n    }\n\n    onConnected(callback)\n    {\n        this.bluetooth.on('connected', callback);\n    }\n\n    onConnectionFailed(callback)\n    {\n        this.bluetooth.on('connection-failed', callback);\n    }\n\n    async execute()\n    {\n        await this.sendInstructions('e')\n    }\n\n    async clear()\n    {\n        await this.sendInstructions('c')\n    }\n\n    onMessage(callback) \n    {\n        this.bluetooth.on('characteristic-changed', callback)\n    }\n\n    async sendInstructions(instructionsString) \n    {\n        this.bluetooth.setCharacteristic('cmds:'+instructionsString)\n    }\n\n    setConnected(connected)\n    {\n        this.connected = connected\n    }\n}\n\n//# sourceURL=webpack:///./src/rope/RoPE.js?");

/***/ }),

/***/ "./src/topcodes/Camera.js":
/*!********************************!*\
  !*** ./src/topcodes/Camera.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Camera; });\nclass Camera\n{\n    constructor(TopCodes, videoId)\n    {\n        this.TopCodes = TopCodes;\n        this.videoId = videoId;\n        this.topcodes = [];\n        \n        this.codeChangesCountArray = [];\n        this.codeChangesLimit = 3;\n        \n        this.changeOnTopcodesNumberLimit = 3;\n        this.changeOnTopcodesNumber = 0;\n        \n        this.onChangeCodesCallback = function(){}\n    }\n    \n    startStop()\n    {\n        this.TopCodes.startStopVideoScan(this.videoId);\n    }\n    \n    onChangeCodes(callback)\n    {\n        this.onChangeCodesCallback = callback;\n        this.TopCodes.setVideoFrameCallback(this.videoId, jsonString => {\n            const json = JSON.parse(jsonString);\n            if(this._topcodesChanged(json.topcodes))\n            {\n                this.topcodes = json.topcodes;\n                \n                this.codeChangesCountArray = [];\n                this.changeOnTopcodesNumber = 0;\n\n                this.onChangeCodesCallback(this.topcodes);\n            }\n        })\n    }\n    \n    /**\n     * Checks if topcodes views by camera has changed.\n     * The image changes frequently, but at mean the information the same.\n     * For example. A fiducial mark coded as 327, by instant movement light variations\n     * can be read as other code. \n     * @param {Array} newTopcodes \n     */\n    _topcodesChanged(newTopcodes)\n    {\n        this._countNumberOfCodesChanged(newTopcodes);\n        \n        if(this._sameNumberOfCodes()){\n            for(let i=0; i < this.topcodes.length; i++)\n            {\n                if(this.topcodes[i].code !== newTopcodes[i].code)\n                {\n                    this._incrementCodeChange(i)\n                }\n                else\n                {\n                    this._decrementCodeChange(i)\n                }\n            }\n        }\n        \n        return this.changeOnTopcodesNumber > this.changeOnTopcodesNumberLimit ||\n               this.codeChangesCountArray.find(changesCount => changesCount > this.codeChangesLimit);\n    }\n\n    _countNumberOfCodesChanged(newTopcodes)\n    {\n        if(newTopcodes.length !== this.topcodes.length)\n        {\n            this.changeOnTopcodesNumber++;\n        } \n        else \n        {\n            this.changeOnTopcodesNumber = 0;\n        }\n    }\n\n    _incrementCodeChange(i)\n    {\n        if(this.codeChangesCountArray[i] === undefined)\n        {\n            this.codeChangesCountArray[i] = 0;\n        }\n        this.codeChangesCountArray[i]++;\n    }\n\n    _decrementCodeChange(i)\n    {\n        if(this.codeChangesCountArray[i] > 0)\n        {\n            this.codeChangesCountArray[i]--;\n        }\n    }\n\n    _sameNumberOfCodes()\n    {\n        return this.changeOnTopcodesNumber === 0;\n    }\n}\n\n//# sourceURL=webpack:///./src/topcodes/Camera.js?");

/***/ }),

/***/ "./src/topcodes/Program.js":
/*!*********************************!*\
  !*** ./src/topcodes/Program.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Program; });\nclass Program\n{\n    constructor(instructionsString)\n    {\n        this.EXECUTE_CHAR = 'e';\n        this.CLEAR_CHAR   = 'c';\n        this.instructionsString = instructionsString;\n    }\n\n    mustExecute()\n    {\n        return this.instructionsString.includes(this.EXECUTE_CHAR);\n    }\n\n    build()\n    {\n        return this.CLEAR_CHAR + this._instructionsWithoutExecute() + this.EXECUTE_CHAR;\n    }\n\n    _instructionsWithoutExecute()\n    {\n        return this.instructionsString.replace(this.EXECUTE_CHAR, '');\n    }\n}\n\n//# sourceURL=webpack:///./src/topcodes/Program.js?");

/***/ }),

/***/ "./src/topcodes/app.js":
/*!*****************************!*\
  !*** ./src/topcodes/app.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _rope_RoPE__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../rope/RoPE */ \"./src/rope/RoPE.js\");\n/* harmony import */ var _Camera__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Camera */ \"./src/topcodes/Camera.js\");\n/* harmony import */ var _Program__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Program */ \"./src/topcodes/Program.js\");\n\n\n\n\nclass App\n{\n    constructor() \n    {\n        this.codes = \n        {\n            205: 'f',\n            279: 'b',\n            157: 'l',\n            327: 'r',\n            31: 'e'\n        };\n        this.setupEventListeners();\n    }\n    \n    setupEventListeners()\n    {\n        let elements = document.getElementsByClassName('command-button');\n        for(let i=0; i<elements.length;i++)\n        {\n            elements[i].addEventListener('click', event =>\n            {\n                const commandAttribute = event.target.id;\n                this.rope.sendInstructions(commandAttribute);\n            })\n        }\n    }\n    \n    async start()\n    {\n        App.log('starting..');\n        this.rope = new _rope_RoPE__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n        await this.rope.search();\n        this.rope.onMessage(message =>\n        {\n            App.log('RoPE - \"' + message + '\"');\n        });\n        \n        this.camera = new _Camera__WEBPACK_IMPORTED_MODULE_1__[\"default\"](TopCodes,'video-canvas');\n        this.camera.startStop();\n        \n        this.camera.onChangeCodes(async (topcodes) => await this.onChangeCodes(topcodes));\n    }\n\n    async onChangeCodes(topcodes)\n    {\n        const instructionsString = topcodes\n                        .sort((a,b)=> a.x > b.x ? 1 : -1)\n                        .map(topcode => this.codes[topcode.code] || '')\n                        .reduce((a,b)=>a + b,'');\n\n        const program = new _Program__WEBPACK_IMPORTED_MODULE_2__[\"default\"](instructionsString);\n\n        if(program.mustExecute())\n        {\n            try \n            {\n                const build = program.build();\n                App.log(build);\n                await this.rope.sendInstructions( build );\n            } \n            catch (error) \n            {\n                App.log('Error: ' + error)\n            }\n        }\n    }\n\n    static log(text)\n    {\n        document.getElementById('log').innerHTML += text + '<br>'\n    }\n}\n\nlet startButton = document.getElementById('startButton');\nstartButton.addEventListener('click', async () => {\n    const app = new App();\n    try {\n        await app.start();\n    } catch (e) {\n        console.log(e);\n    }\n});\n\n//# sourceURL=webpack:///./src/topcodes/app.js?");

/***/ })

/******/ });