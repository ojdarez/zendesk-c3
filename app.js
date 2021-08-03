//imPORTs
var { accessTickets } = require('./public/js/accessTickets.js')
const cp = require('child_process')
const ls = require('node-localstorage');
const express = require('express');
const { URL } = require("url");
const path = require('path');
const http = require("http");
const open = require("open");

var ticket_data
var isAuthorized = false;

const PORT = 3000
const app = express()
const C_ID = "test_tickers"
const SUBDOMAIN = "zccojdarez"
const SCOPE = "tickets:read write"
const TICKET_URL_1 = 'https://zccojdarez.zendesk.com/api/v2/tickets.json?per_page=25';
const REDIRECT_URL = 'http://localhost:3000/' //'https://ojdarez.github.io/zendesk-c3/' 
const z_AUTH_ROOT_URL = new URL(`https://${SUBDOMAIN}.zendesk.com/oauth/authorizations/new`);

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = ls.LocalStorage;
    var localStorage = new LocalStorage('./scratch');
}

app.use(express.urlencoded({extended: false}))


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
        
        var redirUrl = req.url
        var authCodeUrl = new URL(`${REDIRECT_URL}` + redirUrl)
        var isCode = authCodeUrl.searchParams.get('code')
        
        if (res.statusCode == 200 && isCode != null) {
            
            //UPDATE LOCAL STORAGE DATA
            if(localStorage['code']) {localStorage.removeItem('code')}
            localStorage.setItem('code', isCode)

            //CLOSE SERVER AND NOTIFY USER OF SUCCESS
            isAuthorized = true
            res.end(`<h1>Welcome to Zendesk Tickers</h1>
                <a id="pageAnchor" class="btn" href="home/tickets">
                    <img src="https://media.giphy.com/media/ka6loLNrqm0ao7LLbl/giphy.gif" alt="this slowpoke moves" width="250" />
                </a>
            `);
        } else {
            var isErr = authCodeUrl.searchParams.get('error')
            console.log(isErr)
            isAuthorized = false
            res.end("Request Denied.")
        } 

        req.socket.end();
        req.socket.destroy();
        server.close()

        //ONCE AUTH CONNECTION IS CLOSED: DO THIS
        if (res.writableFinished) {
            //RESTART SERVER FOR APP CONNECTION
            app.listen(PORT, () => console.info(`Let's GO! \nTickers on port: ${PORT} here to serve you`))
            eventsEmitter.emit('clientAuthorized', redirUrl)

            //LOAD TICKETS JSON
            var at = new accessTickets(TICKET_URL_1)
            ticket_data = await at.myTickets()
        } else {
            //CLOSING BEFORE http.IncomingMessage IS RECEIVED.
            console.error('The connection was terminated while the message was still being sent');
        }
    }).listen(PORT, () => console.log('Listening for authorization on PORT ' + PORT)).on("error", err => {
        console.log("Error: " + err.message);
        return err.statusCode;
    });
    if (!isAuthorized) {await open(zAuthCodeUrl)}
}

const EventEmitter = require('events');
const eventsEmitter = new EventEmitter()

eventsEmitter.on('clientAuthorized', async sentTo => {    

    app.get('/', (req, res) => {
        isAuthorized ? res.redirect('/home') : res.redirect('/login')
    })

    app.get(`/home`, (req, res) => {
        res.send(`<h1>Welcome to Zendesk Tickers</h1>
            <a id="pageAnchor" class="btn" href="home/tickets">
                <img src="https://media.giphy.com/media/ka6loLNrqm0ao7LLbl/giphy.gif" alt="this slowpoke moves" width="250" />
            </a>
        `)
    })
    
    app.get("/home/tickets", (req, res) => {
        //if getAuth != error
        //TODO
        //else
        //TODO 
        res.send("Display number of tickets!")
    })
    
    app.get('/login', (req, res) => {
        //getAuthorization()
        //TODO
        //Gif Display.
        //Display click to view tickets.
    })

    app.use(function(req, res, next) {
        if (req.originalUrl == sentTo) {
            res.redirect('/home')
        } else {
            res.status(404).send(`
            <img src="https://cdn.glitch.com/0e4d1ff3-5897-47c5-9711-d026c01539b8%2Fbddfd6e4434f42662b009295c9bab86e.gif?v=1573157191712" width="404" />
            <a href="/home><span>Sorry, that route doesn't exist :)</span></a>
            `)
        }
    })

})

getAuthorization().then(()=> {
    //eventsEmitter.emit('clientAuthorized')
})
