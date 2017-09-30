export class GifService {
  
  constructor(networkConfig, httpService){
    this.networkConfig = networkConfig;
    this.searchURL = "/gifs/search?api_key=GZKGwdu6xlIM0iV58yFKJOFLqj0NLXFw&q=";
    this.searchURL = this.networkConfig.appServerURL + this.searchURL;
    this.httpService = httpService;
  }
  
  
  getGifSearchResults(searchText){
    
    return this.getResults(searchText).then(response => {
      this.requestInfo = {
        searchText,
        response
      };
      return response;
    })
  }

  getResults(searchText, offset=0){
    var searchURL = this.searchURL + searchText + "&offset=" + offset;
    this.isRequestInProgress = true;
    return this.httpService.getData(searchURL).then(response => {
      this.isRequestInProgress = false;
      if (response.meta && response.meta.status === 200 && response.data){
        response.data = this.processGifs(response.data);
        return response;
      } else {
        console.log("error in getting response", response);
        throw new Error("respose error");
      }
    })
  }

  canFetchMore(){
    if (!this.requestInfo){
      return false;
    }
    return (this.requestInfo.response.data.length < this.requestInfo.response.pagination.total_count)
      && !this.isRequestInProgress;
  }

  getNext(){
    
    if (!this.requestInfo){
      throw Error("getData is not called yet");
    }

    if (!this.canFetchMore()){
      throw Error("no more data to be feteched");
    }

    var offset = this.requestInfo.response.data.length;
    return this.getResults(this.requestInfo.searchText, offset).then(response => {
      this.requestInfo.response.data = this.requestInfo.response.data.concat(response.data);
      return {
        response,
        fullResponse : this.requestInfo.response
      }
    })
  }
  
  processGifs(gifs){
    return gifs.map(gif => {
      //Get gif version which's width is close to 250 or less
      var versions = gif.images;
      var versionNames = Object.keys(versions);
      var smallerSizes = versionNames.filter(versionName => versions[versionName].width <= 250 && versions[versionName].url)
                          .map(versionName => versions[versionName]);
      smallerSizes = smallerSizes.sort((a,b) => b.width - a.width);
      //console.log(smallerSizes[0]);
      return Object.assign({
        preview : smallerSizes[0],
      }, gif);
    })
  }

} 