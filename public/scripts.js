let numofrow = 1
let magliette = 0
let is_order_done = false

const Aggiungi = function (name, costo = 10, section=0) {
    let row = document.createElement("div")
    let thing = document.createElement("div")
    let cost = document.createElement("div")
    let remover = document.createElement("div")
    let butt = document.createElement("button")

    if(name[0]==='F' || name==="Maglietta"){ // controlla solo la prima lettera così funziona per tutti i tipi di felpa
        row.setAttribute('class', 'row')
        row.setAttribute('id', numofrow)
        thing.setAttribute('class', 'col-7')
        cost.setAttribute('class', 'col-3')
        remover.setAttribute('class', 'col')
        butt.setAttribute('class', 'btn btn-outline-danger btn-sm fas fa-trash-alt')
        butt.setAttribute('onclick', 'Remove('+numofrow+')')
        if(numofrow===1){
            row.setAttribute('style', 'border:1px solid #ffa052;')
        }else{
            row.setAttribute('style', 'border-bottom : 1px solid #ffa052; border-left : 1px solid #ffa052; border-right : 1px solid #ffa052;')
        }

        let taglia = ""
        let color = ""

        name[0] === 'F' ? taglia = document.getElementById('TagliaF').value : taglia = document.getElementById('TagliaM').value
        name[0] === 'F' ? color = document.getElementById('trad_'+section).src : color = document.getElementById('maglia').src

        let text = document.createTextNode(name+" "+taglia+" "+GetColor(color))
        let num = document.createTextNode(costo)
        let mess= document.createTextNode("")

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
        thing.setAttribute('class', 'col-7')
        cost.setAttribute('class', 'col-3')
        remover.setAttribute('class', 'col')
        butt.setAttribute('class', 'btn btn-outline-danger btn-sm fas fa-trash-alt')
        butt.setAttribute('onclick', 'Remove('+numofrow+')')
        if(numofrow===1){
            row.setAttribute('style', 'border:1px solid #ffa052;')
        }else{
            row.setAttribute('style', 'border-bottom : 1px solid #ffa052; border-left : 1px solid #ffa052; border-right : 1px solid #ffa052;')
        }

        let text = document.createTextNode(name)
        let num = document.createTextNode(costo)
        let mess= document.createTextNode("")

        butt.appendChild(mess)
        thing.appendChild(text)
        cost.appendChild(num)
        remover.appendChild(butt)

        row.appendChild(thing)
        row.appendChild(cost)
        row.appendChild(remover)

        let element = document.getElementById("carrello")
        element.appendChild(row)

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
    fetch("/register_order", {
        method: "POST", 
        body: JSON.stringify(final),
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    })
    .then(res => res.json())
    .then(res => {
        if (res.status == 200) {
            create_alert('L\'ordine è stato registrato con successo.\nRiceverai una mail all\'indirizzo fornito con incluso un codice da conservare: ti servirà per confermare in seguito l\'acquisto o nel caso volessi cancellare il tuo ordine.', 'success')
            is_order_done = true
            localStorage.setItem("cart", "")
        } else if (res.status == 700) {
            create_alert(res.error, 'danger')
        }
    })
}

const SAVE = function (){
    let but = document.getElementById("goform")
    but.removeAttribute('href')
    if (!final.cart.join() || !final.cart) {
        create_alert("Il carrello è vuoto", 'warning')
        return null
    }
    localStorage.setItem("cart", final.cart.map(e => e.length > 1? `${e[0]}, ${e.flatMap((e,i) => i? e: "").filter(e => {if (e) return e}).join(", ")}`: e.toString() ).join("; "));
    but.href = "/form"
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
        if(i===1){
            children[i].setAttribute('style', 'border:1px solid #ffa052;')
        }else{
            children[i].setAttribute('style', 'border-bottom : 1px solid #ffa052; border-left : 1px solid #ffa052; border-right : 1px solid #ffa052;')
        }
        if (children[i].children[0].innerText === "Borraccia") {
            children[i].children[1].innerText = "Gratis"
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
        create_alert(res.msg, 'info')
    })
}


const render_carrello = function() {
    const carrello = localStorage.getItem('cart').split("; ").map(e => e.split(", "))
    graphic = document.getElementById('carrello')
    carrello.forEach((val, i) => {
        const element = document.createElement('div');
        element.setAttribute('class', 'card card-body')
        if(i===0){
            element.setAttribute('style', 'border:1px solid #ffa052; margin-top: 10px;')
        }else{
            element.setAttribute('style', 'border-bottom : 1px solid #ffa052; border-left : 1px solid #ffa052; border-right : 1px solid #ffa052;')
        }
        element.innerHTML = val[0]
        graphic.appendChild(element)
    })
}


const create_alert = function(text, type) {
    let alert = null
    const root_div = document.getElementById('alert_root')
    ready_alerts = root_div.children

    for (let i = 0; i < ready_alerts.length; i++) {
        if (ready_alerts[i].value === text) {
            alert = ready_alerts[i]
            break
        }
    }

    if (!alert) {
        const alert = document.createElement("div")
        alert.className = "alert alert-" + type + " alert-dismissible fade show"
        alert.setAttribute('style', 'position: fixed; top: 0; right: 0;')
        alert.setAttribute("value", text)
        alert.innerHTML = text + '<button type="button" class="close" data-dismiss="alert">&times;</button></div>'
        root_div.appendChild(alert)
    } else {
        alert.alert()
    }
    
}