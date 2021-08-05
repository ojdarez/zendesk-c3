//IMPORTS
var { accessTickets } = require('./public/js/accessTickets.js')
var { processAuth, codeResult, authUrl } = require('./public/js/index.js')
const curr_page = require("./curr_tickets_page.json")
const next_page = require("./next_ticket_page.json")
const prev_page = require("./prev_ticket_page.json")
const ls = require('node-localstorage');
const express = require('express');
const path = require('path');

//USEFUL VARS & CONSTS
var jData;
const PORT = 3000
const app = express()
const fs = require('fs');
const TICKET_URL_1 = 'https://zccojdarez.zendesk.com/api/v2/tickets.json?per_page=25'

const clientAuth = new processAuth()
const EventEmitter = require('events');
const eventsEmitter = new EventEmitter()

async function startTickers() {
    clientAuth.getAuthorization().then((authSuccess)=> {
        var task = "authorized" //Authorization succeeded
        if (!authSuccess) {    // Authorization denied || failed.
            task = "unAuthorized"
        } 
        return task
    }).then( task => {
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

        //const lastPage = Math.ceil(config.count / 25);
        try{

            app.get(`/?code=${codeResult}`, (req, res) => {
                res.render("home")
            })

            app.get('/home', (req, res) => {
                res.render("home")
            })
            
            app.get("/home/tickets", async (req, res, next) => {
                let currentPage = req.query.page || 1;

                var at = new accessTickets(TICKET_URL_1)
                await at.myTickets().then(tickets_data => {
                    fs.writeFileSync("./curr_tickets_page.json", "")
                    fs.writeFileSync("./curr_tickets_page.json", tickets_data)
                    var curr_page = fs.readFileSync('./curr_tickets_page.json', (err, data) => {
                        if (err) throw err;
                    });
                    return curr_page
                }).then(result => { 
                    jData = JSON.parse(result.toString())
                    return jData
                }).then(

                )
                
                
                res.render("page")
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
                authUrl: authUrl
            })
            console.log(authUrl)
        })
    })

    eventsEmitter.emit(task)
}

startTickers()

// {
//     // tickets: config.tickets,
//     // currentPage: currentPage,
//     // totalItems: config.count,
//     // lastPage: lastPage
// }

// <!-- <h1>Tickets</h1>
//     <% tickets.forEach(ticket => { %>
//         <div class="tab">
//             <button class="tablinks" id="(<%ticket.id%>)" onclick="openTicket(event, '<%(ticket.id)%>')">
//                 <li>
//                     <h><%= ticket.id %></h3> 
//                     (<%= ticket.subject %>)
//                 </li>
//             </button>
//         </div>
//         <div id="(<%ticket.id%>)" class="tabcontent">
//             <h3><strong>Hi</strong></h3>
//             <p><%= ticket.description%></p>
//         </div>
//     <% }) %> -->