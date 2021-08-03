 const fs = require('fs');
const https = require('https');

/*using hard coded oAuthToken as there's some issues exchanging 
authorization code for oAuthToken to process requests keep getting invalid
client_id but I have included the code to process the access token for when I 
get around this in the ***{async function setSecret()}*** in index.js
*/
var oAuthToken = "Bearer 441305d64e8abd9565dbf4fd025405375ee2d55faa03e90a1d2de61191eb6130"

class AccessTickets{
    async getTickets(url) {
        new Promise((resolve, reject) => {
            resolve(
                https.get( url, {headers : { "Authorization": oAuthToken }}, (response) => {
                    let data = ''
                    response.on('data', (d) => {
                        data += d
                    });

                    response.on('end', () => {
                        fs.writeFileSync('../../ticket_request.json', '', ()=>{console.log('~Ticket request file is ready~')})
                        var jsonContent  = JSON.parse(JSON.stringify(data, null, 4));
                        fs.writeFileSync('../../ticket_request.json', jsonContent)
                    })
                })
            ).on('error', (e) => {
                console.error(e);
                reject(e)
                return
            })
        }).then( response => console.log())
    }
}

module.exports = AccessTickets;