//IMPORTS
const { URL } = require("url");

const CLIENT_ID = "test_tickers"
const SUBDOMAIN = "zccojdarez"
const SCOPE = "tickets:read write"
const REDIRECT_URL = 'http://localhost:3000/' //'https://ojdarez.github.io/zendesk-c3/' 
const z_AUTH_ROOT_URL = new URL(`https://${SUBDOMAIN}.zendesk.com/oauth/authorizations/new`);

class Auth {
    constructor(){
        console.log(`<-~-~Processing ${CLIENT_ID} authorization url~-~->`)
    }
    async zAuthUrl() {
        z_AUTH_ROOT_URL.search = new URLSearchParams({
            response_type: "code",
            rediect_uri: REDIRECT_URL,
            client_id: CLIENT_ID,
            scope: SCOPE,
        })

        const params = z_AUTH_ROOT_URL.search
        return `${z_AUTH_ROOT_URL}${params}`
    }
}

module.exports = {
    cAuth: Auth,
    scope: SCOPE,
    c_id: CLIENT_ID,
    sDomain: SUBDOMAIN,
    reDirUrl: REDIRECT_URL,
}
