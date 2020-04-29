let numofrow = 1
let felpe = 0
let borracce = 0
let magliette = 0

const Aggiungi = function (name, costo) {
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

    let text = document.createTextNode(name)
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

    final.cart.push([name, color])
    final.cost += costo
    numofrow+=1
    console.log(final.cost)
}


const SEND  = function (){
    final.Email = document.getElementById("Email").value
    final.Nome = document.getElementById("Nome").value
    final.Cognome = document.getElementById("Cognome").value
    final.Indirizzo = document.getElementById("Indirizzo").value
    final.Comune = document.getElementById("Comune").value
    final.CAP = document.getElementById("CAP").value
    final.Sede = document.getElementById("Sede").value
    final.Sezione = document.getElementById("Sezione").value
    final.Classe = document.getElementById("Classe").value
    final.cart = []
    final.cost = 0

    for(let i = 1; i<numofrow; i++){
        let item = document.getElementById(i)
        let val = item.getElementsByClassName('col-9').outertext
        final.cart.push(val)
    }

    
    let jsonData = JSON.stringify(final)
    let hash = md5(jsonData)

    let scontrino = {
        id : hash,
        Nome: final.Nome,
        Cognome : final.Cognome,
        cart : final.cart,
        cost : final. cost
    }

    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
    download(JSON.stringify(scontrino), 'scontrino.txt', 'text/plain');
    fetch("/register_order", {
        method: "POST", 
        body: JSON.stringify(data)
      }).then(res => {
        // visualizza errori o tutto ok
      });
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