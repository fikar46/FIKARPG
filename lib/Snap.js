"use strict"
const { default: axios } = require('axios');
const KJUR = require('jsrsasign');
const ApiConfig = require('./ApiConfig');

class Snap{
    constructor(options={isProduction:false,privateKey:'',clientID:''}){
        this.apiConfig = new ApiConfig(options);
    }
    hexToBase64(hexString) {
        const buffer = Buffer.from(hexString, 'hex');
        return buffer.toString('base64');
    }
    generateSignature() {
        try {
            const privateKey = this.apiConfig.get().privateKey;
            const clientID = this.apiConfig.get().clientID;
            const xTimestamp = this.generateTimestamp(); 
            const signatureElements = `${clientID}|${xTimestamp}`;
            const kjurSignature = new KJUR.crypto.Signature({"alg": "SHA256withRSA"});
            kjurSignature.init(privateKey);
            kjurSignature.updateString(signatureElements);
            const signatureResult = this.hexToBase64(kjurSignature.sign());
            return { signatureResult, xTimestamp,clientID }; 
        } catch(error) {
            console.error("generateToken", error);
            throw error;
        }
    }

   

    generateTimestamp() {
        const now = new Date();
        const offset = now.getTimezoneOffset(); // Get timezone offset in minutes
        const offsetHours = Math.abs(offset / 60); // Convert offset to hours
        const offsetMinutes = Math.abs(offset % 60); // Get remaining minutes
        
        const sign = offset >= 0 ? '-' : '+'; // Determine sign of offset
        const pad = (num) => String(num).padStart(2, '0'); // Padding function
        
        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}${sign}${pad(offsetHours)}:${pad(offsetMinutes)}`;
    }
    generateToken(){
        let base_url_api = "https://api-uat.doku.com"
        const { signatureResult, xTimestamp,clientID } = this.generateSignature();
        return axios({
            method: 'post',
            url: `${base_url_api}/authorization/v1/access-token/b2b`,
            headers: {
               "X-CLIENT-KEY": clientID,
                "X-TIMESTAMP": xTimestamp, 
                "X-SIGNATURE": signatureResult
            },
            data:{
                "grantType":"client_credentials"
            }
        })
    }   
  }
module.exports = Snap;