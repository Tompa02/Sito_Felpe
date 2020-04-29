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
    console.log(req.body)
    const order = req.body
    if(order.Email===null||order.Nome===null||order.Cognome===null||
        order.Indirizzo===null||order.Comune===null||
        order.CAP===null||order.Sede===null||
        order.Sezione===null||order.Classe===null||
        order.cart===null||order.cost===null){
            //
        }
    next()
}

server.post('/register_order', verify, (req, res) => {
    res.send('POST request for order')
})

server.listen(8080)