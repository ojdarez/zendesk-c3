const { response } = require('express');
const fs = require('fs');
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

        const serv = http.createServer(function(request, response){

            //The following code will print out the incoming request text
            request.pipe(response);
        }).listen(443, '127.0.0.1');
        
        console.log('Listening on port 443 ... for tickets');

        let jsonTickets = new Promise((resolve, reject) => {
            https.get(this.url, {headers : { "Authorization": oAuthToken }}, (response) => {
                    let data = ''
                    response.on('data', (d) => {
                        data += d
                    });
                    
                    response.on('end', async () => {
                        var jsonContent  = JSON.parse(JSON.stringify(data, null, 4));
                        resolve(jsonContent)
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

// fs.writeFileSync('../../ticket_request.json', '', ()=>{console.log('~Ticket request file is ready~')})
// fs.writeFileSync('../../ticket_request.json', jsonContent)

module.exports = {accessTickets: AccessTickets}

// var at = new AccessTickets('https://zccojdarez.zendesk.com/api/v2/tickets.json?per_page=25')
// at.myTickets()