"use strict";
//IMPORTS 
const http = require("http");
const open = require("open");
const { URL } = require("url");
const ls = require('node-localstorage');
const EventEmitter = require('events');
const eventsEmitter = new EventEmitter()
const { cAuth, sDomain, reDirUrl } = require ('./zAuthUrl.js');

//PARAMS
const PORT = process.env.port || 3000;
const TOKEN_URL = `https://${sDomain}.zendesk.com/oauth/tokens` 

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = ls.LocalStorage;
    var localStorage = new LocalStorage('./scratch');
}

//GET AUTHORIZATION & VALIDATE CLIENT IF NEW USER WITH BASIC AUTH. BEFORE AUTHORIZATION
class AUTHnVAL {
    async getAuthorization() {
        console.log("Awaiting authorization ...")
        var isAuthorized;
        const clientAuth = new cAuth()
        const authUrl = await clientAuth.zAuthUrl();

        const auth = new Promise((resolve, reject) => {
            const server = http.createServer( async (req, res) => {

                var newUrlReq = req.url
                var authCodeUrl = new URL(`${reDirUrl}` + newUrlReq)

                //Incoming Message from Redirect URL after auth. attempt
                let isCode = authCodeUrl.searchParams.get('code');
                let isError = authCodeUrl.searchParams.get('error');
                isCode != null ? isAuthorized = true : isAuthorized = false;
                
                if (res.statusCode == 200 && isCode != null) {
                    //UPDATE LOCAL STORAGE DATA
                    if(localStorage['code']) {localStorage.removeItem('code')}
                    localStorage.setItem('code', isCode)
                    
                    //CLOSE SERVER AND NOTIFY USER OF SUCCESS
                    res.end(
                        `<h1 style="color:blue;text-align:center;">Welcome to Zendesk Tickers</h1>
                        <a id="pageAnchor" href="home/tickets" style="vertical-align:middle;">
                            <img src="https://media.giphy.com/media/ka6loLNrqm0ao7LLbl/giphy.gif" width=35% style="align:middle;"/>
                        </a>
                        `
                    );
                } else if (isError != null) {
                    localStorage.setItem('code', isError)
                    res.end("Request unauthorized :?")
                } 

                //END SERVER
                req.socket.end();
                req.socket.destroy();
                server.close()

                //ONCE AUTH CONNECTION IS CLOSED: DO THIS
                if (res.writableFinished) {
                    resolve(isAuthorized)
                } else {
                    //CLOSING BEFORE http.IncomingMessage IS RECEIVED.
                    console.error('The connection was terminated while the message was still being sent');
                }
            }).listen(PORT, () => 
                console.log('Listening for authorization on PORT ' + PORT)
            ).on("error", err => {
                if (err.message == "Error: listen EADDRINUSE: address already in use :::3000") {
                    console.log(err.message+"\nPlease clear port ${PORT} and retry!")
                } else {
                    console.log("Error: " + err.message);
                    return err.statusCode;
                }
                reject(err)
            });
        })

        //Open auth page on web.
        if (!isAuthorized) {
            await open(authUrl)
        }

        return await auth;
    }
}

module.exports = {
    processAuth: AUTHnVAL,
    codeResult: localStorage['code'],
    authUrl: this.authUrl
};

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
