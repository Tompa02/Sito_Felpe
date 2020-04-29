const express = require('express')
const path = require('path')
const server = express()

server.use(express.static(path.join(__dirname, 'public')));

server.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(__dirname + '/public/index.html');
})

server.post('/register_order', (req, res) => {if(final.Email===null||final.Nome===null||final.Cognome===null||
        final.Indirizzo===null||final.Comune===null||
        final.CAP===null||final.Sede===null||
        final.Sezione===null||final.Classe===null||
        final.cart===null||final.cost===null){console.log("sei un coglione")}})
        
server.listen(8080)