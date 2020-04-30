let numofrow = 1
let magliette = 0

const Aggiungi = function (name, costo = 10) {
    let row = document.createElement("div")
    let thing = document.createElement("div")
    let cost = document.createElement("div")
    let remover = document.createElement("div")
    let butt = document.createElement("button")

    if(name[0 ]==='F' || name==="Maglietta"){ // controlla solo la prima lettera così funziona per tutti i tipi di felpa
        row.setAttribute('class', 'row')
        row.setAttribute('id', numofrow)
        thing.setAttribute('class', 'col-9')
        cost.setAttribute('class', 'col')
        remover.setAttribute('class', 'col')
        butt.setAttribute('class', 'btn btn-danger')
        butt.setAttribute('onclick', 'Remove('+numofrow+')')

        let taglia = ""
        let color = ""

        name[0] === 'F' ? taglia = document.getElementById('TagliaF').value : taglia = document.getElementById('TagliaM').value
        name[0] === 'F' ? color = document.getElementById('trad').src : color = document.getElementById('maglia').src

        let text = document.createTextNode(name+" "+taglia+" "+GetColor(color))
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

        final.cart.push([name, GetColor(color), taglia])
        numofrow+=1
        if (name[0] === 'F') { $('#notifica_felpa').toast('show') }
        else { $('#notifica_maglia').toast('show') }
    }

    if(name==='Borraccia' || name==="Annuario"){
        row.setAttribute('class', 'row')
        row.setAttribute('id', numofrow)
        thing.setAttribute('class', 'col-9')
        cost.setAttribute('class', 'col')
        remover.setAttribute('class', 'col')
        butt.setAttribute('class', 'btn btn-danger')
        butt.setAttribute('onclick', 'Remove('+numofrow+')')

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

        final.cart.push([name])
        numofrow+=1
        if (name === 'Borraccia') { $('#notifica_borraccia').toast('show') }
        else { $('#notifica_annuario').toast('show') }
    }

    update_id()
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
    final.cart = localStorage.getItem('cart')
    if (!final.cart) {
        alert("Il carrello è vuoto")
        return null
    }
    fetch("/register_order", {
        method: "POST", 
        body: JSON.stringify(final),
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    })
    .then(res => res.json())
    .then(res => {
        if (res.status == 200) {
            alert('L\'ordine è stato registrato con successo')
            const output = new jsPDF()
            output.text(`Intestatario: ${final.Cognome} ${final.Nome} ${final.Classe}${final.Sezione} ${final.Sede}\nEmail: ${final.Email}\nIndirizzo: ${final.Indirizzo} ${final.Comune} ${final.CAP}\nId: ${res.id}\nSpesa: ${res.cost} euro\nCarrello: \n   -${final.cart.replace(/; /g, '\n   -')}`, 10, 10)
            output.save(`ricevuta_${final.Cognome}_${final.Nome}.pdf`)
            localStorage.setItem("cart", "")
        } else if (res.status == 700) {
            alert(res.error)
        }
    })
}

const SAVE = function (){
    localStorage.setItem("cart", final.cart.map(e => e.length > 1? `${e[0]}, ${e.flatMap((e,i) => i? e: "").filter(e => {if (e) return e}).join(", ")}`: e.toString() ).join("; "));
    let but = document.getElementById("goform")
    but.href = "./form"
}

const CambiaColore = function (newimage, name){
    let pic = document.getElementById(name)
    pic.src = newimage
}

const Remove = function (i){
    let torem = document.getElementById("carrello").children[i]
    if (i-1 > -1) {
        final.cart.splice(i-1, 1);
    }
    document.getElementById("carrello").removeChild(torem)
    update_id()
}

const final = {
    cart : []
}


const GetColor = function (color) {
    const arrcolo = ['BLACK', 'GREEN', 'WHITE', 'RED', 'GREY', 'BLUE']
    for(let i=0; i<arrcolo.length; i++){
        if(color.indexOf(arrcolo[i])>0){
            return arrcolo[i]
        }
    }
}


const update_id = function() {
    const children = document.getElementById("carrello").children
    let num_borracce = 0
    let num_felpe = 0
    const borracce = []
    for (let i = 1; i < children.length; i++) {
        children[i].id = i
        children[i].children[2].children[0].setAttribute('onclick', 'Remove('+i+')')
        if (children[i].children[0].innerText === "Borraccia") {
            children[i].children[1].innerText = "gratis"
            num_borracce += 1
            borracce.push(children[i].children[1])
        }
        if (children[i].children[0].innerText[0] === 'F') {
            num_felpe += 1
        }
    }
    let delta = num_borracce - num_felpe
    if (delta > 0){
        for (let y = 0; y < delta; y++) {
            borracce[y].innerText = 3
        }
    }
}


const delete_order = function() {
    fetch("/delete_order_request", {
        method: "POST", 
        body: JSON.stringify({"id": document.getElementById("delete_id").value}),
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    })
    .then(res => res.json())
    .then(res => {
        alert(res.msg)
    })
}