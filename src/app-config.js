export class AppConfig {
  constructor(){
    this.appServerURL = "https://api.giphy.com/v1";
  }

  static get appServerURL(){
  	return "https://api.giphy.com/v1";
  }
}
