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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _gifService = __webpack_require__(1);

var _appConfig = __webpack_require__(2);

var _httpService = __webpack_require__(3);

var _searchListView = __webpack_require__(4);

var ajaxRequestService = new _httpService.AJAXRequestService();
var gifService = new _gifService.GifService(_appConfig.AppConfig, ajaxRequestService);

function afterDomLoadedEvent() {

	var template = document.querySelector("#item-template").innerHTML;
	var searchListElem = document.querySelector("#search-list");
	var searchBtnElem = document.querySelector("#search-button");
	var searchTextElem = document.querySelector("#search-text");

	var searchListView = new _searchListView.SearchListView(gifService, template, {
		searchListElem: searchListElem,
		searchBtnElem: searchBtnElem,
		searchTextElem: searchTextElem
	});
}

document.addEventListener("DOMContentLoaded", afterDomLoadedEvent);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GifService = exports.GifService = function () {
  function GifService(networkConfig, httpService) {
    _classCallCheck(this, GifService);

    this.networkConfig = networkConfig;
    this.searchURL = "/gifs/search?api_key=GZKGwdu6xlIM0iV58yFKJOFLqj0NLXFw&q=";
    this.searchURL = this.networkConfig.appServerURL + this.searchURL;
    this.httpService = httpService;
  }

  _createClass(GifService, [{
    key: "getGifSearchResults",
    value: function getGifSearchResults(searchText) {
      var _this = this;

      return this.getResults(searchText).then(function (response) {
        _this.requestInfo = {
          searchText: searchText,
          response: response
        };
        return response;
      });
    }
  }, {
    key: "getResults",
    value: function getResults(searchText) {
      var _this2 = this;

      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      var searchURL = this.searchURL + searchText + "&offset=" + offset;
      this.isRequestInProgress = true;
      return this.httpService.getData(searchURL).then(function (response) {
        _this2.isRequestInProgress = false;
        if (response.meta && response.meta.status === 200 && response.data) {
          response.data = _this2.processGifs(response.data);
          return response;
        } else {
          console.log("error in getting response", response);
          throw new Error("respose error");
        }
      });
    }
  }, {
    key: "canFetchMore",
    value: function canFetchMore() {
      if (!this.requestInfo) {
        return false;
      }
      return this.requestInfo.response.data.length < this.requestInfo.response.pagination.total_count && !this.isRequestInProgress;
    }
  }, {
    key: "getNext",
    value: function getNext() {
      var _this3 = this;

      if (!this.requestInfo) {
        throw Error("getData is not called yet");
      }

      if (!this.canFetchMore()) {
        throw Error("no more data to be feteched");
      }

      var offset = this.requestInfo.response.data.length;
      return this.getResults(this.requestInfo.searchText, offset).then(function (response) {
        _this3.requestInfo.response.data = _this3.requestInfo.response.data.concat(response.data);
        return {
          response: response,
          fullResponse: _this3.requestInfo.response
        };
      });
    }
  }, {
    key: "processGifs",
    value: function processGifs(gifs) {
      return gifs.map(function (gif) {
        //Get gif version which's width is close to 250 or less
        var versions = gif.images;
        var versionNames = Object.keys(versions);
        var smallerSizes = versionNames.filter(function (versionName) {
          return versions[versionName].width <= 250 && versions[versionName].url;
        }).map(function (versionName) {
          return versions[versionName];
        });
        smallerSizes = smallerSizes.sort(function (a, b) {
          return b.width - a.width;
        });
        //console.log(smallerSizes[0]);
        return Object.assign({
          preview: smallerSizes[0]
        }, gif);
      });
    }
  }]);

  return GifService;
}();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppConfig = exports.AppConfig = function () {
  function AppConfig() {
    _classCallCheck(this, AppConfig);

    this.appServerURL = "https://api.giphy.com/v1";
  }

  _createClass(AppConfig, null, [{
    key: "appServerURL",
    get: function get() {
      return "https://api.giphy.com/v1";
    }
  }]);

  return AppConfig;
}();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AJAXRequestService = exports.AJAXRequestService = function () {
  function AJAXRequestService() {
    _classCallCheck(this, AJAXRequestService);
  }

  _createClass(AJAXRequestService, [{
    key: "getData",
    value: function getData(url) {
      return fetch(url).then(function (response) {
        var contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json();
        }
        throw new TypeError("Oops, we haven't got JSON!");
      });
    }
  }]);

  return AJAXRequestService;
}();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SearchListView = exports.SearchListView = function () {
	function SearchListView(gifSearchService, template, elems) {
		_classCallCheck(this, SearchListView);

		this.template = template;
		this.parentElem = elems.searchListElem;
		this.elems = elems;
		this.gifService = gifSearchService;
		this.init();
	}

	_createClass(SearchListView, [{
		key: "init",
		value: function init() {
			this.onSearchClickBind = this.onSearchClick.bind(this);
			this.onSearchTextKeyDownBind = this.onSearchTextKeyDown.bind(this);
			this.onScrollBind = this.onScroll.bind(this);

			this.elems.searchBtnElem.addEventListener("click", this.onSearchClickBind);
			this.elems.searchTextElem.addEventListener("keydown", this.onSearchTextKeyDownBind);
			document.addEventListener("scroll", this.onScrollBind);

			this.lastScrollTop = 0;
			this.screenHeight = screen.height;
		}
	}, {
		key: "onSearchTextKeyDown",
		value: function onSearchTextKeyDown(event) {
			if (event.keyCode === 13) {
				this.onSearchClick(event);
			}
		}
	}, {
		key: "onSearchClick",
		value: function onSearchClick(event) {
			var _this = this;

			var searchText = this.elems.searchTextElem.value;
			if (!searchText) {
				return;
			}

			this.gifService.getGifSearchResults(searchText).then(function (response) {
				_this.updateView(response.data);
			});
			this.clearView();
			event.preventDefault();
		}
	}, {
		key: "onScroll",
		value: function onScroll(event) {
			var _this2 = this;

			if (this.lastScrollTop < document.documentElement.scrollTop) {
				requestAnimationFrame(function () {
					_this2.onScrollDown(event);
				});
			}
			this.lastScrollTop = document.documentElement.scrollTop;
		}
	}, {
		key: "onScrollDown",
		value: function onScrollDown(event) {
			var _this3 = this;

			if (this.gifService.canFetchMore()) {
				var bottomMargin = document.documentElement.scrollHeight - (document.documentElement.scrollTop + this.screenHeight);
				if (bottomMargin < 250) {
					this.gifService.getNext().then(function (obj) {
						_this3.updateView(obj.response.data);
					});
				}
			}
		}
	}, {
		key: "updateView",
		value: function updateView(gifs) {
			var documentFragmentElem = document.createDocumentFragment();
			gifs.map(this.getElem).forEach(function (divElem) {
				documentFragmentElem.appendChild(divElem);
			});
			this.parentElem.appendChild(documentFragmentElem);
		}
	}, {
		key: "getElem",
		value: function getElem(gif, index) {
			var divElem = document.createElement("div");
			divElem.classList.add("item");
			divElem.setAttribute("data-index", index);
			var imgElem = document.createElement("img");
			imgElem.src = gif.preview.url;
			imgElem.style.width = gif.preview.width + "px";
			imgElem.style.height = gif.preview.height + "px";
			var divInfoElem = document.createElement("div");
			divElem.appendChild(imgElem);
			divElem.appendChild(divInfoElem);
			//divInfoElem.innerHTML = index;
			return divElem;
		}
	}, {
		key: "clearView",
		value: function clearView() {
			var childNodes = this.parentElem.childNodes;
			if (childNodes) {
				for (var counter = childNodes.length - 1; counter >= 0; counter--) {
					this.parentElem.removeChild(childNodes[counter]);
				}
			}
		}
	}, {
		key: "clearEvents",
		value: function clearEvents() {
			this.elems.searchBtnElem.removeEventListener("click", this.onSearchClickBind);
			this.elems.searchTextElem.removeEventListener("keydown", this.onSearchTextKeyDownBind);
			document.removeEventListener("scroll", this.onScrollBind);
		}
	}, {
		key: "destroyView",
		value: function destroyView() {
			this.clearView();
			this.clearEvents();
		}
	}]);

	return SearchListView;
}();

/***/ })
/******/ ]);
//# sourceMappingURL=app.bundle.js.map