const express = require('express')
const path = require('path')
const crypto = require('crypto')
const parser = require('body-parser')
const server = express()

const prezzi = {
    'felpa': 20,
    'maglia': 15,
    'annuario': 5,
    'borraccia' : 0
}


server.use(express.static(path.join(__dirname, 'public')));

server.use(parser.json())

server.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(__dirname + '/public/index.html');
})

server.get('/form', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(__dirname + '/public/form.html');
})

const verify = function(req, res, next) {
    const order = req.body
    if(order.Email==''||order.Nome==''||order.Cognome==''||
        order.Indirizzo==''||order.Comune==''||order.CAP==''){
            res.status(700)
            res.send('error')
    } else {
        next()
    }
}

server.post('/register_order', verify, (req, res) => {
    req.body.cost = 0
    const id = crypto.createHash('md5').update(JSON.stringify(req.body)).digest("hex")
    res.send({"cost": req.body.cost, "id": id})
})

server.listen(8080)