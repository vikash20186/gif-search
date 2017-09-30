export class AppConfig {
  constructor(){
    this.appServerURL = "https://api.giphy.com/v1";
  }
}

export class AJAXRequestService{
  
  getData(url){
    return fetch(url).then(response => {
      var contentType = response.headers.get("content-type");
      if(contentType && contentType.includes("application/json")) {
        return response.json();
      }
      throw new TypeError("Oops, we haven't got JSON!");
    }).catch(err => console.log(err));
  }
}

export class GifService {
  
  constructor(networkConfig, httpService){
    console.log("inside GifService Constructor");
    this.networkConfig = networkConfig;
    this.searchURL = this.networkConfig.appServerURL + "/gifs/search?api_key=GZKGwdu6xlIM0iV58yFKJOFLqj0NLXFw&q=";
    this.httpService = httpService;
  }
  
  
  getGifSearchResults(searchText){
    console.log("networkConfig is", this.networkConfig);
    var searchURL = this.searchURL + searchText;
    return this.httpService.getData(searchURL);
  }
  
} 