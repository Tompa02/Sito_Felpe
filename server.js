const express = require('express')
const path = require('path')
const server = express()

server.use(express.static(path.join(__dirname, 'public')));

server.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(__dirname + '/public/index.html');
})

server.post('/register_order', (req, res) => {})

server.listen(8080)