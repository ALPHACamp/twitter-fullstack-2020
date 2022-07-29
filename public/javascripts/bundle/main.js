/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./public/javascripts/index.js":
/*!*************************************!*\
  !*** ./public/javascripts/index.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _like_btn_listener__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./like-btn-listener */ \"./public/javascripts/like-btn-listener.js\");\n/* harmony import */ var _reply_btn_listener__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reply-btn-listener */ \"./public/javascripts/reply-btn-listener.js\");\n\r\n\r\n\r\n(0,_like_btn_listener__WEBPACK_IMPORTED_MODULE_0__.likeAddListener)()\r\n;(0,_reply_btn_listener__WEBPACK_IMPORTED_MODULE_1__.replyAddListener)()\r\n\n\n//# sourceURL=webpack://test/./public/javascripts/index.js?");

/***/ }),

/***/ "./public/javascripts/like-btn-listener.js":
/*!*************************************************!*\
  !*** ./public/javascripts/like-btn-listener.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"likeAddListener\": () => (/* binding */ likeAddListener),\n/* harmony export */   \"likeBtns\": () => (/* binding */ likeBtns)\n/* harmony export */ });\n// 選取喜歡按鈕父群\r\nconst likeBtns = document.querySelectorAll('.like-btn')\r\n\r\nfunction likeAddListener () {\r\n  // likeBtns全上監聽器，防止跳轉\r\n  likeBtns.forEach(btn => {\r\n    btn.addEventListener('click', event => {\r\n      event.preventDefault()\r\n    })\r\n  })\r\n}\r\n\r\n\r\n\n\n//# sourceURL=webpack://test/./public/javascripts/like-btn-listener.js?");

/***/ }),

/***/ "./public/javascripts/reply-btn-listener.js":
/*!**************************************************!*\
  !*** ./public/javascripts/reply-btn-listener.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"replyAddListener\": () => (/* binding */ replyAddListener),\n/* harmony export */   \"replyAvatar\": () => (/* binding */ replyAvatar),\n/* harmony export */   \"replyBtnOnClick\": () => (/* binding */ replyBtnOnClick),\n/* harmony export */   \"replyBtns\": () => (/* binding */ replyBtns),\n/* harmony export */   \"replyWindow\": () => (/* binding */ replyWindow)\n/* harmony export */ });\n// 選取回復按鈕父群\r\nconst replyBtns = document.querySelectorAll('.reply-btn-container')\r\n// 抓樣板檔reply-btn-model裡的回覆者大頭照位置\r\nlet replyAvatar = document.querySelector('.model-reply-avatar')\r\n// 抓樣板檔reply-btn-model裡的回覆者內文位置\r\nlet replyWindow = document.querySelector('.model-description')\r\n\r\n// function //\r\nfunction replyBtnOnClick(target) {\r\n  // 如果點到父元素\r\n  if (target.matches('.reply-btn-container')) {\r\n    const tweetId = target.children[0].dataset.tweet\r\n    const tweetUserId = target.children[0].dataset.user\r\n    const tweetAvatarUrl = document.querySelector(`#tweet-avatar-${tweetUserId}`).src\r\n    const description = document.querySelector(`#description-${tweetId}`).innerText\r\n    replyAvatar.src = tweetAvatarUrl\r\n    replyWindow.innerText = description\r\n  }\r\n  // 如果點到回復按鈕\r\n  if (target.matches('.reply')) {\r\n    const tweetId = target.dataset.tweet\r\n    const tweetUserId = target.dataset.user\r\n    const tweetAvatar = document.querySelector(`.tweet-avatar-${tweetUserId}`)\r\n    const description = document.querySelector(`#description-${tweetId}`).innerText\r\n    replyAvatar.src = tweetAvatar\r\n    replyWindow.innerText = description\r\n  }\r\n}\r\n\r\nfunction replyAddListener() {\r\n  // 回復按鈕父群全上監聽器\r\n  replyBtns.forEach(btn => {\r\n    btn.addEventListener('click', event => {\r\n      let target = event.target\r\n      replyBtnOnClick(target)\r\n    })\r\n  })\r\n}\r\n\r\n\r\n\n\n//# sourceURL=webpack://test/./public/javascripts/reply-btn-listener.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./public/javascripts/index.js");
/******/ 	
/******/ })()
;