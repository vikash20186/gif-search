import {AppConfig, AJAXRequestService, GifService} from './gif-service.js';


var appConfigObj = new AppConfig();
var ajaxRequestService = new AJAXRequestService();

console.log(ajaxRequestService);

var gifService = new GifService(appConfigObj, ajaxRequestService);

gifService.getGifSearchResults("baby elephant").then(response => {
	console.log("got the response", response);
})