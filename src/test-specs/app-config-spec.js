import {AppConfig} from './../app-config.js';

describe('AppConfig', () => {
   it('expect appconfig to have app url defined', () => {
       expect(AppConfig.appServerURL).toBeDefined();
       expect(AppConfig.appServerURL).toBe("https://api.giphy.com/v1");
   });

});