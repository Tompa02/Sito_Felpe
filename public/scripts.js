let numofrow = 1
let felpe = 0
let borracce = 0
let magliette = 0

const Aggiungi = function (name, costo = 10) {
    let row = document.createElement("div")
    let thing = document.createElement("div")
    let cost = document.createElement("div")
    let remover = document.createElement("div")
    let butt = document.createElement("button")

    if(name==='Felpa Tradizionale'){
        felpe+=1
    }

    if(name==='Borraccia'){
        borracce+=1
    }


    row.setAttribute('class', 'row')
    row.setAttribute('id', numofrow)
    thing.setAttribute('class', 'col-9')
    cost.setAttribute('class', 'col')
    remover.setAttribute('class', 'col')
    butt.setAttribute('class', 'btn btn-danger')
    butt.setAttribute('onclick', 'Remove('+numofrow+','+costo+','+'\''+name+'\''+')')

    let taglia = document.getElementById('Taglia').value 

    let text = document.createTextNode(name+" "+taglia)
    let num = document.createTextNode(costo)
    let mess= document.createTextNode("ELIMINA")

    butt.appendChild(mess)
    thing.appendChild(text)
    cost.appendChild(num)
    remover.appendChild(butt)

    row.appendChild(thing)
    row.appendChild(cost)
    row.appendChild(remover)

    let element = document.getElementById("carrello")
    element.appendChild(row)

    let color = document.getElementById('trad').src

    final.cart.push([name, GetColor(color), taglia])
    final.cost += costo
    numofrow+=1
    console.log(final.cart)

}


function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}


const SEND = function (){
    final.Email = document.getElementById("Email").value
    final.Nome = document.getElementById("Nome").value
    final.Cognome = document.getElementById("Cognome").value
    final.Indirizzo = document.getElementById("Indirizzo").value
    final.Comune = document.getElementById("Comune").value
    final.CAP = document.getElementById("CAP").value
    final.Sede = document.getElementById("Sede").value
    final.Sezione = document.getElementById("Sezione").value
    final.Classe = document.getElementById("Classe").value
    
    let jsonData = JSON.stringify(final)
    final.id = md5(jsonData)
    jsonData = JSON.stringify(final)

    let scontrino = {
        id : final.id,
        Nome: final.Nome,
        Cognome : final.Cognome,
        cart : final.cart,
        cost : final.cost
    }

    fetch("/register_order", {
        method: "POST", 
        body: JSON.stringify(final),
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    }).then(res => {
        if (res.status == 200) {
            alert('L\'ordine è stato registrato con successo')
            download(JSON.stringify(scontrino), 'scontrino.txt', 'text/plain')
        } else if (res.status == 700) {
            alert('C\'è stato un errore durante la registrazione dell \'ordine')
        }
    })
}


const SAVE = function (){
    if(!(controllo())){
        alert("Hai preso troppe borracce")
        return 0
    }
    let but = document.getElementById('goform')
    but.href = './form.html'
    final.cost+=2
}

const RESTORE = function(){
}

const CambiaColore = function (newimage, name){
    let pic = document.getElementById(name)
    pic.src = newimage
}


const Remove = function (num, costo, name){
    let torem = document.getElementById(num)
    const index = num-1

    if(name==='Felpa Tradizionale'){
        felpe-=1
    }

    if(name==='Borraccia'){
        borracce-=1
    }

    if (index > -1) {
        final.cart.splice(index, 1);
    }

    final.cost-=costo
    torem.parentNode.removeChild(torem)
}


const final = {
    cart : [],
    cost : 0   
}


const controllo = function (){
    if(borracce>felpe){
        return false
    }
    return true
}


const GetColor = function (color) {
    const arrcolo = ['BLACK', 'GREEN', 'WHITE', 'RED', 'GREY', 'BLUE']
    for(let i=0; i<arrcolo.length; i++){
        if(color.indexOf(arrcolo[i])>0){
            return arrcolo[i]
        }
    }

}