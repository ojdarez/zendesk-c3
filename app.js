//IMPORTS
var { accessTickets } = require('./public/js/accessTickets.js')
var { processAuth, codeResult, authUrl } = require('./public/js/index.js')
const pages = require("./curr_tickets_page.json")
const ls = require('node-localstorage');
const express = require('express');
const path = require('path');

//USEFUL VARS & CONSTS
var jData;
var jTickets = "";
var tickets = [];
const PORT = 3000
const app = express()
const fs = require('fs');
const TICKET_URL_1 = 'https://zccojdarez.zendesk.com/api/v2/tickets.json?per_page=100'

const clientAuth = new processAuth()
const EventEmitter = require('events');
const eventsEmitter = new EventEmitter()

async function getTicketContent(apiUrl) {
    var at = new accessTickets(apiUrl)
    const ticketContent = new Promise((resolve, reject) => {
        at.myTickets().then(tickets_data => {
            fs.writeFileSync("./curr_tickets_page.json", "")
            fs.writeFileSync("./curr_tickets_page.json", tickets_data)
            var pages = fs.readFileSync('./curr_tickets_page.json', (err, data) => {
                if (err) { reject(err); throw err; };
            });
            return pages
        }).then(result => { 
            next = (JSON.parse(result.toString())).next_page
            jTickets = (JSON.parse(result.toString())).tickets
            for(var i = 0; i < jTickets.length; ++i){
                tickets.push(jTickets[i])
            }
            if(next != null) {
                //console.log(tickets)
                getTicketContent(next)
            }
            resolve(jData)
        })
    })
    return await ticketContent;
}

async function startTickers() {
    clientAuth.getAuthorization().then((authSuccess)=> {
        var task = "authorized" //Authorization succeeded
        if (!authSuccess) {    // Authorization denied || failed.
            task = "unAuthorized"
        } 
        console.log(authSuccess)
        return task
    }).then( task => {
        getTicketContent(TICKET_URL_1)
        // while(next!=null) {
        //     var ticketData = getTicketContent(next)
        //     console.log(ticketData)
        //     next = null;
        //     // tickets += ticketData.tickets
        //     // next = ticketData.next_page
        //     // console.log(next)
        // }
        return appRun(task)
    })
}

function appRun(task) {
    //RESTART SERVER FOR APP CONNECTION
    app.listen(PORT, () => console.info(`\nTickers listening on port: ${PORT}.\n`))
    
    app.use(express.urlencoded({extended: false}))
    app.set("view engine", "ejs")
    app.set("views", path.join(__dirname, "views"))
    app.use(express.static(path.join(__dirname, "public")))

    //AUTHORIZATION GRANTED
    eventsEmitter.on('authorized', async () => {    
        console.log(`Stay Zen 'n' Let's GO!!!`)
        
        var sites = ['/','/home','/home/tickets','/login']

        //PAGINATION FACTORS
        const firstPage = 1;
        let pages = (tickets.lengtth / 25) + (tickets.length % 25);
        let lastPage = pages == firstPage ? firstPage : pages
        try{
            app.get(`/`, (req, res) => {
                res.render("home")
            })

            app.get('/home', (req, res) => {
                res.render("home")
            })
            
            app.get("/home/tickets", async (req, res, next) => {
                res.render("page", {
                    currentPage: firstPage,
                    firstPage: firstPage,
                    lastPage: lastPage,
                    tickets: tickets,
                    pages: pages,
                    perPage: 25
                })
            })
        } catch (err) {
            throw new Error(err);
        }
    })

    //WHAT HAPPENS WHEN AUTHORIZATION IS NOT GRANTED
    eventsEmitter.on('unAuthorized', () => {

        console.log(`\nAccess Denied: To Err is human :/\nTickers is not authorized to access your account. Reload page to retry`)
        app.get('/?error=access_denied&error_description=The+end-user+or+authorization+server+denied+the+request.', (req, res) => {
            res.redirect('/err404')
        })

        app.get('/err404', (req, res) => {
            res.render("err404", {
                authDenied: true,
            })
        })
    })

    eventsEmitter.emit(task)
}

startTickers()
