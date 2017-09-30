import {GifService} from './gif-service.js';
import {AppConfig} from './app-config.js';
import {AJAXRequestService} from './http-service.js';
import {SearchListView} from './search-list-view.js';

var appConfigObj = new AppConfig();
var ajaxRequestService = new AJAXRequestService();
var gifService = new GifService(appConfigObj, ajaxRequestService);

function afterDomLoadedEvent(){
	
	var template = document.querySelector("#item-template").innerHTML;
	var searchListElem = document.querySelector("#search-list");
	var searchBtnElem = document.querySelector("#search-button");
	var searchTextElem = document.querySelector("#search-text");
	
	var searchListView = new SearchListView(gifService, template, {
		searchListElem,
		searchBtnElem,
		searchTextElem
	});
}

document.addEventListener("DOMContentLoaded", afterDomLoadedEvent);