const express = require('express')
const path = require('path')
const parser = require('body-parser')
const server = express()

server.use(express.static(path.join(__dirname, 'public')));

server.use(parser.json())

server.use('/register_order', function(req, res, next) {
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
})

server.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(__dirname + '/public/index.html');
})

server.post('/register_order', (req, res) => {})

server.listen(8080)