'use strict'

const _ = require('lodash');
class ApiConfig{
 
  constructor(options={isProduction:false,privateKey:'',clientID:''}){
    this.isProduction = false;
    this.privateKey = '';
    this.clientID = '';

    this.set(options);
  }
  
  get(){
    let currentConfig = {
      isProduction : this.isProduction,
      privateKey : this.privateKey,
      clientID : this.clientID
    };
    return currentConfig;
  }
 
  set(options){
    let currentConfig = {
      isProduction : this.isProduction,
      privateKey : this.privateKey,
      clientID : this.clientID
    };
    const parsedOptions = _.pick(options,['isProduction','privateKey','clientID']);
    let mergedConfig = _.merge({},currentConfig,parsedOptions);

    this.isProduction = mergedConfig.isProduction;
    this.privateKey = mergedConfig.privateKey;
    this.clientID = mergedConfig.clientID;
  }
  
  getCoreApiBaseUrl(){
    return this.isProduction ?
      ApiConfig.CORE_PRODUCTION_BASE_URL : 
      ApiConfig.CORE_SANDBOX_BASE_URL;
  };
}

// Static vars
ApiConfig.CORE_SANDBOX_BASE_URL = 'https://api-uat.doku.com';
ApiConfig.CORE_PRODUCTION_BASE_URL = 'https://dashboard.doku.com';

module.exports = ApiConfig;