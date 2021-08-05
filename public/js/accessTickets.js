const { response } = require('express');
var http = require('http');
const https = require('https');

/*using hard coded oAuthToken as there's some issues exchanging 
authorization code for oAuthToken to process requests keep getting invalid
client_id but I have included the code to process the access token for when I 
get around this in the ***{async function setSecret()}*** in index.js
*/
const oAuthToken = "Bearer 441305d64e8abd9565dbf4fd025405375ee2d55faa03e90a1d2de61191eb6130"

class AccessTickets{

    constructor (url) {
        this.url = url
    }

    async myTickets() {
        console.log('Listening on port 443 ... for tickets');

        let jsonTickets = new Promise((resolve, reject) => {
            https.get(this.url, {headers : { "Authorization": oAuthToken }}, (response) => {
                    let data = ""
                    response.on('data', (d) => {
                        data += d
                    });
                    
                    response.on('end', async () => {
                        var jsonContent = JSON.stringify(data,null,2)
                        resolve(JSON.parse(jsonContent))
                    })
            }).on('error', (err) => { 
                (console.error(err))
                reject(e)
                return 
            })
        })

        return jsonTickets
    }
}

module.exports = {accessTickets: AccessTickets}