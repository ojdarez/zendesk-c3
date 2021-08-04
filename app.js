//IMPORTS
var { accessTickets } = require('./public/js/accessTickets.js')
var { processAuth } = require('./public/js/index.js')
var config = require('./ticket_request.json');
const ls = require('node-localstorage');
const express = require('express');
const path = require('path');

//USEFUL VARS & CONSTS
const PORT = 3000
var ticket_data = ""
const app = express()
const fs = require('fs');
const router = express.Router()
const TICKET_URL_1 = 'https://zccojdarez.zendesk.com/api/v2/tickets.json?per_page=100'

const EventEmitter = require('events');
const eventsEmitter = new EventEmitter()

const clientAuth = new processAuth()

clientAuth.getAuthorization().then((authSuccess)=> {
    var task = "authorized" //Authorization succeeded
    if (!authSuccess) {    // Authorization denied || failed.
        task = "unAuthorized"
    } 

    //RESTART SERVER FOR APP CONNECTION
    app.listen(PORT, () => console.info(`\nTickers listening on port: ${PORT}.\n`))
    return task
}).then( task => {
    eventsEmitter.emit(task)
    console.log(task)
})

app.use(express.urlencoded({extended: false}))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))


eventsEmitter.on('authorized', async (sentTo) => {    
    console.log(`Stay Zen 'n' Let's GO!!!`)

//     var confirmedRedir = `${sentTo}`
//     var sites = ['/','/home','/home/tickets','/login']

//     //const lastPage = Math.ceil(config.count / 25);
    try{
//         app.use(function (req, res, next) {
//             if (req.originalUrl == confirmedRedir) {
//                 res.redirect('/home')
//             } else if (req.originalUrl in sites) {
//                 res.redirect(req.originalUrl)
//             } else {
//                 res.status(404).redirect('/err404')
//             }
//             res.on('error', (e)=> {
//                 console.log(e + `${req.originalUrl} generated error`)
//             })
//             next()
//         })

//         app.get(`/${sentTo}`, (req, res) => {
//             res.on('error', (err)=>{console.error(err);})
//             isAuthorized ? res.redirect('/home') : res.redirect('/err404')
//         })

//         app.get(`/home`, (req, res) => {
//             res.render("home", {ticket_count: config.count})
//             res.on('error', (err)=>{console.error(err);})
//         })
        
        app.get("/home/tickets", (req, res) => {
            let currentPage = req.query.page || 1;
            res.render("page", {
                tickets: config.tickets,
                currentPage: currentPage,
                totalItems: config.count,
                //lastPage: lastPage
            })
            res.on('error', (err)=>{console.error(err);})
        })
        
        app.get('/err404', (req, res) => {
            res.render("err404")
            res.on('error', (err)=>{console.error(err);})
        })
    } catch (err) {
        throw new Error(err);
    }
})

//LOAD TICKETS JSON
// var at = new accessTickets(TICKET_URL_1)
// ticket_data = await at.myTickets()


eventsEmitter.on('unAuthorized', () => {    
    console.log(`To Err is human :/`)
})