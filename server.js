// TODO: fate un file dove mettete tutte le funzioni che vi servono(esportandole). Poi importatele qua
// c'è troppo casino nel codice (dichiarate una funzione dopo averla già richiamata)

// Le variabili sono dichiarate in modo diverso usare sempre lo stesso formato.
// o "ciaoMario" o "ciao_mario", ma decidetevi

// path è inutile per joinare delle stringe usate il "+"
// o il templating delle stringe
const path = require("path")

const crypto = require("crypto")

const { createObjectCsvWriter : createCsvWriter } = require("csv-writer")
const fs = require("fs")

const nodemailer = require("nodemailer")

const express = require("express")
const server = express()

// Lo rifarei in mono meno ripetitivo e più versatile
const csvWriter = createCsvWriter({
  path: "./ordini.csv",
  header: [
    { id: "id", title: "ID" },
    { id: "nome", title: "NOME" },
    { id: "cognome", title: "COGNOME" },
    { id: "email", title: "EMAIL" },
    { id: "indirizzo", title: "INDIRIZZO" },
    { id: "comune", title: "COMUNE" },
    { id: "cap", title: "CAP" },
    { id: "sede", title: "SEDE" },
    { id: "sezione", title: "SEZIONE" },
    { id: "classe", title: "CLASSE" },
    { id: "importo", title: "IMPORTO" },
    { id: "carrello", title: "CARRELLO" }
  ]
})
// Stessa cosa di quello sopra
const ordi = createCsvWriter({
  path: "./oggetti.csv",
  header: [
    { id: "id", title: "ID" },
    { id: "nome", title: "NOME" },
    { id: "cognome", title: "COGNOME" },
    { id: "oggetto", title: "OGGETTO" }
  ]
})

// removed e confirmed sono assimilabili
// ed è possibile farlo in modo meno ripetitivo
const removed = createCsvWriter({
  path : "./ordini_rimossi.csv",
  header : [
    { id:"id", title:"ID" }
  ]
})

const confirmed = createCsvWriter({
  path : "./ordini_confermati.csv",
  header : [
    { id:"id", title:"ID" }
  ]
})

const prezzi = {
  "Felpa Tradizionale -1-": 20,
  "Felpa Tradizionale -2-": 20,
  "Felpa Tradizionale -3-": 20,
  "Felpa Tradizionale -4-": 20,
  Maglietta: 10,
  Annuario: 10,
  Borraccia : 0
}

// si poteva fare con un reduce e senza usare variabili intermedie
// per poi ritornarle
const calcola_spesa = function (arr) {
  let soldi_totali = 0
  for (let i = 0; i < arr.length; i++){
    soldi_totali += prezzi[arr[i][0]]
  }
  soldi_totali += 2
  return soldi_totali
}

server.use(express.static(path.join(__dirname, "public")))

// è più sbrigativo e pulito così
server.use(require("body-parser").json())

// evitare sempre la ripetitività quando possibile
;["h", "form", "delete_order", "confirm_order"].forEach(endpoint =>{
  server.get(`/${endpoint}`, (req, res) => {
    res.sendFile(`${__dirname}/public/${endpoint === "h" ? "index" : endpoint}.html`)
  })
})

// server.get("/h", (req, res) => {
//   res.setHeader("Content-Type", "text/html")
//   res.sendFile(__dirname + "/public/index.html")
// })
//
// server.get("/form", (req, res) => {
//   res.setHeader("Content-Type", "text/html")
//   res.sendFile(__dirname + "/public/form.html")
// })
//
// server.get("/delete_order", (req, res) => {
//   res.setHeader("Content-Type", "text/html")
//   res.sendFile(__dirname + "/public/delete_order.html")
// })
//
// server.get("/confirm_order", (req, res) => {
//   res.setHeader("Content-Type", "text/html")
//   res.sendFile(__dirname + "/public/confirmation.html")
// })

// questo si mette sempre come ultimo endpoint perchè potrebbe far si che quelli successivi vengano ignorati
server.get("*", (req, res) => {
  res.writeHead(404, { "Content-Type": "text/html" })
  res.end("<body style=\"background: #f2e4d8\"><div style=\"text-align:center; font-size:30px;\"><a href='\/' title='spoiler: era questo il link che cercavi pirla'>Forse era questo il link che cercavi?</a></div><div style=\"text-align:center;\"><img src=\"https://i.kym-cdn.com/entries/icons/original/000/032/379/Screen_Shot_2020-01-09_at_2.22.56_PM.png\"></div></body>")
})

// destruttare req!! è inutile portarsi dietro tutto l'oggetto se ne servono solo alcuni pezzi
const verify = function(req, res, next) {
  if (!req.body.cart) {
    res.send({ status: 700, error: "Il carrello è vuoto" })
  }
  // aggiungi un else se no potrebbe crashare tutto visto che
  // questo spezzone di codice potrebbe comunque eseguirlo
  req.body.cart = req.body.cart.split("; ").map(e => e.split(", "))
  const order = req.body
  // e se  io mando un carrello senza chiave cosa succede?
  if (order.Email == "" || order.Nome == "" || order.Cognome == "" ||
    order.Indirizzo == "" || order.Comune == "" || order.CAP == ""){
    res.send({ status: 700, error: "Controllare che tutti i campi siano validi" })
  } else {
    next()
  }
}

// destruttare req!! è inutile portarsi dietro tutto l'oggetto se ne servono solo alcuni pezzi
server.post("/register_order", verify, (req, res) => {
  let cost = calcola_spesa(req.body.cart)
  const id = crypto.createHash("md5").update(JSON.stringify(req.body)).digest("hex")
  
  // questa cosa non ho capito perchè l'abbiate fatta
  const check = id
  
  let borr = 0
  let felpe = 0
  // è inutile scrivere un'operazione ternaria in questo modo( valido per le successive 3 righe)
  // piuttosto usa un if senza parentesi
  // if (condizione) borr += 1
  req.body.cart.forEach(e => e[0] === "Borraccia" ? borr += 1 : borr = borr)
  req.body.cart.forEach(e => e[0][0] === "F" ? felpe += 1 : borr = borr)
  borr > felpe ? cost += ((borr - felpe) * 3) : cost = cost
  
  // usate il forEach e date dei nomi sensati alle variabili così da non ripetere chiave valore
  // "const a = { id }"  è la stessa cosa che scrivere "const a = { id: id }"
  const appends = [{
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
  
  const ogg = []
  // stessa cosa dell'oggetto sopra
  req.body.cart.forEach(e =>{
    ogg.push({
      id : check,
      nome : req.body.Nome,
      cognome : req.body.Cognome,
      oggetto : e
    })
  })
  
  ordi.writeRecords(ogg)
  
  const scontrino = req.body
  scontrino.id = check
  scontrino.cost = cost
  
  sender(scontrino)
  
  res.send({ status: 200, cost, id })
})
// DESTRUTTURARE REQ!!
function filterDeletedOrder(req, res, next) {
  let permission = true
  fs.readFile("ordini_rimossi.csv", "utf8", function(err, data){
    if (data == undefined) {
      return 0
    }
    const lines = data.split("\n").slice(1)
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] == req.body.id) {
        res.send({ status: 700, msg: "L\'ordine è già stato cancellato" })
        permission = false
        break
      }
    }
    if (permission) {
      next()
    }
  })
}

server.post("/delete_order_request", filterDeletedOrder, (req, res) => {
  fs.readFile("ordini.csv", "utf8", function(err, data){
    
    // si può fare senza l'utilizzo di un'altra varibile (linesArr)
    const linesExceptFirst = data.split("\n").slice(1) //fa un array con tutte le stringhe
    const linesArr = linesExceptFirst.map(line=>line.split(",")) //divide le righe in array diverse
    
    const result = AddRowToDelete(linesArr, req.body.id)
    
    if (result) {
      res.send({ status: 200, msg: "L\'ordine è stato rimosso con successo" })
    } else {
      res.send({ status: 700, msg: "Non è stato trovato nessun ordine corrispondente all\'id fornito.\nControlla di aver inserito correttamente il codice fornito nello scontrino" })
    }
  })
})

function AddRowToDelete(records, id) {
  for (let i = 0, l = records.length; i < l; i++) {
    if (records[i][0] === id){
      removed.writeRecords([{ id }])
      return true
    }
  }
  return false
}

// DESTRUTTURARE REQ!!
function filterNonExistantOrder(req, res, next) {
  const id_disponibili = fs.readFileSync("ordini.csv", "utf8").split("\n").slice(1).map(line=>line.split(",")).map(line=>line[0]) // elenca gli id di tutti gli ordini
  const id_already_confirmed = fs.readFileSync("ordini_confermati.csv", "utf8").split("\n").slice(1)
  // l'if con i vari else se volete potete farlo senza parenesi, così è più stringato e leggibilee
  if (!id_disponibili.includes(req.body.id)) {
    res.send({ status: 700, msg: "Non è stato trovato nessun ordine con il codice fornito" })
  } else if (id_already_confirmed.includes(req.body.id)) {
    res.send({ status: 700, msg: "Il tuo ordine è già stato confermato, stai tranquillo" })
  } else {
    next()
  }
}

server.post("/confirm_order_request", filterNonExistantOrder, (req, res) => {
  confirmed.writeRecords([{ id: req.body.id }])
  res.send({ status: 200, msg: "Il tuo ordine è stato confermato con successo!" })
})

// DESTRUTTURARE SCONTRINO!!
const sender = async function (scontrino) {
  // MAI hardcodare delle password
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "felpe.las@gmail.com",
      pass: "ALPHAbetaCharlie30"
    }
  })
  
  let finale = ""
  // potevate usare un reduce
  scontrino.cart.forEach(e => {
    finale += (e + "\n    ")
  })
  
  // la creazione della chiave text è ripetitiva e poco maneggevole in caso di cambiamento di alcuni parametri
  const mailOptions = {
    from: "felpe.las@gmail.com",
    to: scontrino.Email,
    subject: "Ricevuta Acquisto",
    text : `Intestatario: ${scontrino.Cognome} ${scontrino.Nome} ${scontrino.Classe}${scontrino.Sezione} ${scontrino.Sede}\nIndirizzo: ${scontrino.Indirizzo} ${scontrino.Comune} ${scontrino.CAP}\nCodice: ${scontrino.id}\nSpesa: ${scontrino.cost} euro\nCarrello: \n    ${finale}`
  }
  // non so cosa faccia e a cosa serve quella callback ma è inutile
  transporter.sendMail(mailOptions, function(error, info){})
}

// Questa è una marocchinata
// di solito si fa il port forwarding quando si mette sull'ec2
server.listen(80)