const express = require('express')
const path = require('path')
const crypto = require('crypto')
const parser = require('body-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs')
const server = express()

const csvWriter = createCsvWriter({
    path: './ordini.csv',
    header: [
        {id: 'id', title: 'ID'},
        {id: 'nome', title: 'NOME'},
        {id: 'cognome', title: 'COGNOME'},
        {id: 'email', title: 'EMAIL'},
        {id: 'indirizzo', title: 'INDIRIZZO'},
        {id: 'comune', title: 'COMUNE'},
        {id: 'cap', title: 'CAP'},
        {id: 'sede', title: 'SEDE'},
        {id: 'sezione', title: 'SEZIONE'},
        {id: 'classe', title: 'CLASSE'},
        {id: 'importo', title: 'IMPORTO'},
        {id: 'carrello', title: 'CARRELLO'}
    ]
})

const ordi = createCsvWriter({
    path: './oggetti.csv',
    header: [
        {id: 'id', title: 'ID'},
        {id: 'nome', title: 'NOME'},
        {id: 'cognome', title: 'COGNOME'},
        {id: 'oggetto', title: 'OGGETTO'},
    ]
})

const removed = createCsvWriter({
    path : './ordini_rimossi.csv',
    header : [
        {id:'id', title:'ID'}
    ]
})

const prezzi = {
    'Felpa Tradizionale -1-': 20,
    'Felpa Tradizionale -2-': 20,
    'Felpa Tradizionale -3-': 20,
    'Felpa Tradizionale -4-': 20,
    'Maglietta': 10,
    'Annuario': 10,
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

server.get('/delete_order', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(__dirname + '/public/delete_order.html');
})

server.get('*', (req, res) => {
    res.writeHead(404, {"Content-Type": "text/html"})
    res.end('<a href=\'\/\' title=\'spoiler: era questo il link che cercavi pirla\'>Forse era questo il link che cercavi?</a>');
})

const verify = function(req, res, next) {
    if (!req.body.cart) {
        res.send({"status": 700, "error": "Il carrello è vuoto"})
    }
    req.body.cart = req.body.cart.split("; ").map(e => e.split(", "))
    const order = req.body
    if(order.Email==''||order.Nome==''||order.Cognome==''||
        order.Indirizzo==''||order.Comune==''||order.CAP==''){
            res.send({"status": 700, "error": "Controllare che tutti i campi siano validi"})
    } else {
        next()
    }
}

server.post('/register_order', verify, (req, res) => {
    let cost = calcola_spesa(req.body.cart)
    const id = crypto.createHash('md5').update(JSON.stringify(req.body)).digest("hex")
    const check = id
    let borr = 0
    let felpe = 0
    req.body.cart.forEach(e => e[0]==='Borraccia' ? borr+=1 : borr=borr)
    req.body.cart.forEach(e => e[0]==='Felpa Tradizionale' ? felpe+=1 : borr=borr)
    borr>felpe ? cost+=((borr-felpe)*3) : cost=cost
    const appends =[{
        id:check,
        nome:req.body.Nome,
        cognome:req.body.Cognome,
        email:req.body.Email,
        indirizzo:req.body.Indirizzo,
        comune:req.body.Comune,
        cap:req.body.CAP,
        sede:req.body.Sede,
        sezione:req.body.Sezione,
        classe:req.body.Classe,
        importo:cost,
        carrello:req.body.cart
    }]
    csvWriter.writeRecords(appends)

    let ogg = []

    req.body.cart.forEach(e =>{
        ogg.push({
            id : check,
            nome : req.body.Nome,
            cognome : req.body.Cognome,
            oggetto : e
        })
    })
    ordi.writeRecords(ogg)
    
    res.send({"status": 200, "cost": cost, "id": id})
})


function filterDeletedOrder(req, res, next) {
    let permission = true
    fs.readFile('ordini_rimossi.csv', 'utf8', function(err, data){
        if (data == undefined) {
            return 0
        }
        let lines = data.split('\n').slice(1)
        for (let i = 0; i < lines.length; i++) {
            if (lines[i] == req.body.id) {
                res.send({"status": 700, "msg": "L\'ordine è già stato cancellato"})
                permission = false
                break
            }
        }
        if (permission) {
            next()
        }
    })
}

server.post('/delete_order_request', filterDeletedOrder, (req, res) => {
    fs.readFile('ordini.csv', 'utf8', function(err, data){
        let linesExceptFirst = data.split('\n').slice(1); //fa un array con tutte le stringhe
        let linesArr = linesExceptFirst.map(line=>line.split(',')); //divide le righe in array diverse
        let result = AddRowToDelete(linesArr, req.body.id)
        if (result) {
            res.send({"status": 200, "msg": "L\'ordine è stato rimosso con successo"})
        } else {
            res.send({"status": 700, "msg": "Non è stato trovato nessun ordine corrispondente all\'id fornito.\nControlla di aver inserito correttamente il codice fornito nello scontrino"})
        }
    })
})


function AddRowToDelete(records, id) {
    for (let i = 0, l = records.length; i < l; i++) {
        if (records[i][0]===id){
            removed.writeRecords([{"id" : id}])
            return true;
        }
    }
    return false   
}


server.listen(80)