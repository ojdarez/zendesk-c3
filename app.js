//imports
const express = require('express')
const path = require('path');
const app = express()
const port = process.env.PORT || 3000

//Static files...
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + '/public/js'));


//Set Views
app.set('views', './views')

app.get('', (req, res) => {
    res.render('\index')
})

//C:\Users\JOJ_MSFT\Documents\Code\ZENDESK_PROJ\views\index.html

//Listen on port 3000
app.listen(port, () => console.info(`Let's GO!\nListening on port ${port}`))