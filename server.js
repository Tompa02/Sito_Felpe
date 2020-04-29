const express = require('express')
const path = require('path')
const cors_enabler = require('cors')
const parser = require('body-parser')
const server = express()

server.use(express.static(path.join(__dirname, 'public')));

server.use(parser.json())

server.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(__dirname + '/public/index.html');
})

const verify = function(req, res, next) {
    const order = req.body
    console.log(order)
    if(order.Email==''||order.Nome==''||order.Cognome==''||
        order.Indirizzo==''||order.Comune==''||order.CAP==''){
            res.status(700);
            res.send('error')
    } else {
        next()
    }
}

server.post('/register_order', verify, (req, res) => {res.send('jj')})

server.listen(8080)