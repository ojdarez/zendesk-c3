//"use strict";
const ls = require('node-localstorage');
const { URL } = require("url");
const axios = require("axios");
const http = require("http");
const open = require("open");
const fs = require('fs');

const C_ID = "test_tickers"
const SUBDOMAIN = "zccojdarez"
const SCOPE = "tickets:read write"
const PORT = process.env.port || 3000;
const REDIRECT_URL = 'http://localhost:3000/' //'https://ojdarez.github.io/zendesk-c3/'
const TOKEN_URL = `https://${SUBDOMAIN}.zendesk.com/oauth/tokens` 
const z_AUTH_ROOT_URL = new URL(`https://zccojdarez.zendesk.com/oauth/authorizations/new`);

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = ls.LocalStorage;
    var localStorage = new LocalStorage('./scratch');
}

module.exports = {Auth, isAuthorized};

// async function setSecret() {
//     try {
//         localStorage.setItem('secret', fs.readFileSync('./scratch/oauth_secret.txt', 'utf8'))    
//     } catch(e) {
//         console.log('Error:', e.stack);
//         console.log("Missing oAuth Secret.")
//     }
//     return localStorage['secret']
// }

// function sleep(ms) {
//     return new Promise((resolve) => {
//         setTimeout(resolve, ms);
//     });
// } 

// async function getToken() {
//     const axios = require('axios').default;
//     if (localStorage.getItem('zAuth')) {
//         var access_token = localStorage.getItem('zAuth');
//         //TODO //DOSOMETHING
//     } else {
//         await getAuthCode()
//         await sleep(5000);
//         //POST REQUEST FOR ACCESS TOKEN...
//         console.log('Making request for access token -~-~-~>');
        
//         axios.post(TOKEN_URL, {}, {
//             params: {
//                     'grant_type': "authorization_code" ,
//                     'code': JSON.stringify(await localStorage['code']),
//                     'client_id': 360002837072,
//                     'client_secret': '840bf0d45be1a390b0ffe2352f4a6ecc6c0cd5bd161dbd5f4e9a99bf03f78210',
//                     'redirect_uri': 'http://localhost:3000/',
//                     'scope': 'tickets:read write'
//                 }
//             })
//             .then(response => { 
//                 response
//                 console.log(response.params),
//                 console.log(response)
//             })
//             .catch(error => {
//                 if (error.response) {
//                     // Request made and server responded
//                     console.log(error)
//                     console.log(error.response.status)
//                     console.log(error.response.statusText)
//                     console.log(error.response.data)
//                 } else if (error.request) {
//                     // The request was made but no response was received
//                     console.log(error.request);
//                 } else {
//                     // Something happened in setting up the request that triggered an Error
//                     console.log('Error', error.message);
//                 }
//             });
//     }
// }
