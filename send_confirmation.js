const fs = require('fs')
const nodemailer = require('nodemailer')
const ejs = require('ejs')

const chain_mails = function() {
    let mail_array = []
    let ordini = fs.readFileSync('ordini.csv', 'utf8').split('\n').slice(1).map(line=>line.split(','))
    let ordini_cancellati = fs.readFileSync('ordini_rimossi.csv', 'utf8').split('\n').slice(1)
    mail_array = ordini.filter(line=>!ordini_cancellati.includes(line[0])).map(line=>line[3]) // prendo tutte le mail associate ad ordini il cui id non appare in ordini_rimossi.csv
    console.log(mail_array)
    return mail_array
}

const send_confirmation_request = function () {
    let mails = chain_mails() // mail a cui chiedere conferma
    if (!mails) {
        return 0
    }
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'felpe.las@gmail.com',
          pass: 'ALPHAbetaCharlie30'
        }
    })

    mails.forEach(val => {
        const mailOptions = {
            from: 'felpe.las@gmail.com',
            to: val,
            subject: "Richiesta di conferma ordine",
            html : ejs.render(fs.readFileSync(__dirname + "/public/redirect.html", 'utf-8'))
        };
    
        transporter.sendMail(mailOptions, function(error, info){
            console.log(error, info)
        })
    })
}

send_confirmation_request()