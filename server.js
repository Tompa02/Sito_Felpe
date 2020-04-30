const express = require('express')
const path = require('path')
const crypto = require('crypto')
const parser = require('body-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const server = express()

const csvWriter = createCsvWriter({
    path: './ordini.csv',
    header: [
        {id: 'nome', title: 'NOME'},
        {id: 'cognome', title: 'COGNOME'},
        {id: 'email', title: 'EMAIL'},
        {id: 'indirizzo', title: 'INDIRIZZO'},
        {id: 'comune', title: 'COMUNE'},
        {id: 'cap', title: 'CAP'},
        {id: 'sede', title: 'SEDE'},
        {id: 'sezione', title: 'SEZIONE'},
        {id: 'classe', title: 'CLASSE'},
        {id: 'id', title: 'ID'},
        {id: 'importo', title: 'IMPORTO'},
        {id: 'carrello', title: 'CARRELLO'}
    ]
});

const prezzi = {
    'Felpa Tradizionale': 20,
    'Maglietta': 15,
    'Annuario': 5,
    'Borraccia' : 0
}

const calcola_spesa = function (arr){
    let soldi_totali=0
    for(let i=0; i<arr.length; i++){
        soldi_totali+=prezzi[arr[i][0]]
    }
    soldi_totali+=2
    return soldi_totali
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
    req.body.cart = req.body.cart.split("; ").map(e => e.split(", "))
    const order = req.body
    if(order.Email==''||order.Nome==''||order.Cognome==''||
        order.Indirizzo==''||order.Comune==''||order.CAP==''){
            res.send({"status": 700, "error": "error"})
    } else {
        next()
    }
}

server.post('/register_order', verify, (req, res) => {
    const cost = calcola_spesa(req.body.cart)
    const id = crypto.createHash('md5').update(JSON.stringify(req.body)).digest("hex")
    const check = id
    const appends =[{
        nome:req.body.Nome,
        cognome:req.body.Cognome,
        email:req.body.Email,
        indirizzo:req.body.Indirizzo,
        comune:req.body.Comune,
        cap:req.body.CAP,
        sede:req.body.Sede,
        sezione:req.body.Sezione,
        classe:req.body.Classe,
        id:check,
        importo:cost,
        carrello:req.body.cart
    }]

    csvWriter.writeRecords(appends)
    .then(() => {
        console.log('...Done');
    });

    res.send({"status": 200, "cost": cost, "id": id})
})

server.listen(8080)