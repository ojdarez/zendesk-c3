"use strict";
const { URL } = require("url");
const axios = require("axios");
const http = require("http");
const open = require("open");
var fs = require('fs');

const C_ID = "test_tickers"
const SUBDOMAIN = "zccojdarez"
const SCOPE = "tickets:read write"
const PORT = process.env.port || 3000;
const REDIRECT_URL = 'http://localhost:3000/' //'https://ojdarez.github.io/zendesk-c3/'
const TOKEN_URL = `https://${SUBDOMAIN}.zendesk.com/oauth/tokens`
const TICKET_URL = `https://${SUBDOMAIN}.zendesk.com/api/v2/tickets.json`; 
const z_AUTH_ROOT_URL = new URL(`https://zccojdarez.zendesk.com/oauth/authorizations/new`);

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    var localStorage = new LocalStorage('./scratch');
}

function zAuthUrl() {
    z_AUTH_ROOT_URL.search = new URLSearchParams({
        response_type: "code",
        rediect_uri: REDIRECT_URL,
        client_id: C_ID,
        scope: SCOPE,
    })

    const params = z_AUTH_ROOT_URL.search
    return `${z_AUTH_ROOT_URL}${params}`
}

async function getAuthorization() {
    const zAuthCodeUrl = zAuthUrl();

    const server = http.createServer( async (req, res) => {
    
        var authCodeUrl = new URL(`${REDIRECT_URL}` + req.url)
        var isCode = authCodeUrl.searchParams.get('code')

        if (res.statusCode == 200 && isCode != null) {
            if(localStorage['code']) {localStorage.removeItem('code')}
            localStorage.setItem('code', isCode)
            
        } else {
            var isErr = authCodeUrl.searchParams.get('error')
            console.log(isErr)
        }
            

        res.end("They!");
        req.socket.end();
        req.socket.destroy();
        server.close()
    }).listen(PORT, () => console.log('Listening for code on port ' + PORT)).on("error", err => {
        console.log("Error: " + err.message);
        return err.statusCode;
    });

    open(zAuthCodeUrl)
}

getAuthorization()

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
