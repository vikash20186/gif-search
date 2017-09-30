"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppConfig = exports.AppConfig = function () {
  function AppConfig() {
    _classCallCheck(this, AppConfig);
  }

  _createClass(AppConfig, [{
    key: "AppConfig",
    value: function AppConfig() {
      this.appServerURL = "https//api.giphy.com/v1/";
    }
  }]);

  return AppConfig;
}();

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
      }).catch(function (err) {
        return console.log(err);
      });
    }
  }]);

  return AJAXRequestService;
}();

var GifService = exports.GifService = function () {
  function GifService() {
    _classCallCheck(this, GifService);
  }

  _createClass(GifService, [{
    key: "GifService",
    value: function GifService(networkConfig, httpService) {
      this.networkConfig = networkConfig;
      this.searchURL = this.networkConfig.appServerURL + "/gifs/search?api_key=GZKGwdu6xlIM0iV58yFKJOFLqj0NLXFw&q=";
      this.httpService = httpService;
    }
  }, {
    key: "getGifSearchResults",
    value: function getGifSearchResults(searchText) {
      var searchURL = this.searchURL + searchText;
      return this.httpService.getData(searchURL);
    }
  }]);

  return GifService;
}();