import {AJAXRequestService} from './../http-service.js';
import {AppConfig} from './../app-config.js';

describe('getData method', function() {
	var promiseHelper;
	var ajaxRequestService;
	var url;
	var ajaxRequestServicePromise;


	beforeEach(function() {
		var fetchPromise = new Promise(function(resolve, reject) {
			promiseHelper = {
				resolve: resolve,
				reject: reject
			};
		});
		ajaxRequestService = new AJAXRequestService();
		url = AppConfig.appServerURL + "/gifs/search?api_key=GZKGwdu6xlIM0iV58yFKJOFLqj0NLXFw&q=baby";
		spyOn(window, 'fetch').and.returnValue(fetchPromise);
		ajaxRequestServicePromise = ajaxRequestService.getData(url);
	});

	it('it fetches from the giffy search ', function() {
		expect(window.fetch).toHaveBeenCalledWith(url);
	});

	it('returns a promise', function() {
		expect(ajaxRequestServicePromise).toEqual(jasmine.any(Promise));
	});

	describe('on successful fetch', function() {
		beforeEach(function() {
			var header = new Headers();
			header.append('content-type', 'application/json');
			var response = new Response(JSON.stringify({ 
				data : [{id:1}]
			}), {
				headers : header
			});
			promiseHelper.resolve(response);
		});
		
		it('resolves its promise with the data list', function(done) {
			ajaxRequestServicePromise.then(function(response) {
				expect(response.data).toBeDefined();
				expect(response.data.length).toBe(1);
				done();
			});
		});
	});

	describe('on successful fetch but other response', function() {
		beforeEach(function() {
			var header = new Headers();
			header.append('content-type', 'text/plain');
			var response = new Response(JSON.stringify({ 
				data : [{id:1}]
			}), {
				headers : header
			});
			promiseHelper.resolve(response);
		});
		
		it('resolves its promise with the data list', function(done) {
			ajaxRequestServicePromise.catch(function(response) {
				expect(response).toBeDefined();
				done();
			});
		});
	});

	describe('on unsuccessful fetch', function() {
		var errorObj = { msg: 'Wow, this really failed!' };
		
		beforeEach(function() {
			promiseHelper.reject(errorObj);
		});
		
		it('resolves its promise with reject', function(done) {
			ajaxRequestServicePromise.catch(function(error) {
				expect(error).toEqual(errorObj);
				done();
			});
		});
	});

});