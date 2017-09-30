export class AJAXRequestService{
  
  getData(url){
    return fetch(url).then(response => {
      var contentType = response.headers.get("content-type");
      if(contentType && contentType.includes("application/json")) {
        return response.json();
      }
      throw new TypeError("Oops, we haven't got JSON!");
    })
  }
}
