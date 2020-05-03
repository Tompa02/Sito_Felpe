let numofrow = 1
const magliette = 0

const Aggiungi = function (name, costo = 10, section = 0) {
  const row = document.createElement("div")
  const thing = document.createElement("div")
  const cost = document.createElement("div")
  const remover = document.createElement("div")
  const butt = document.createElement("button")

  if (name[0] === "F" || name === "Maglietta"){ // controlla solo la prima lettera così funziona per tutti i tipi di felpa
    row.setAttribute("class", "row")
    row.setAttribute("id", numofrow)
    thing.setAttribute("class", "col-7")
    cost.setAttribute("class", "col-3")
    remover.setAttribute("class", "col")
    butt.setAttribute("class", "btn btn-outline-danger btn-sm fas fa-trash-alt")
    butt.setAttribute("onclick", "Remove(" + numofrow + ")")
    if (numofrow === 1){
      row.setAttribute("style", "border:1px solid #ffa052;")
    } else {
      row.setAttribute("style", "border-bottom : 1px solid #ffa052; border-left : 1px solid #ffa052; border-right : 1px solid #ffa052;")
    }

    let taglia = ""
    let color = ""
    
    name[0] === "F" ? taglia = document.getElementById("TagliaF").value : taglia = document.getElementById("TagliaM").value
    name[0] === "F" ? color = document.getElementById("trad_" + section).src : color = document.getElementById("maglia").src

    const text = document.createTextNode(name + " " + taglia + " " + GetColor(color))
    //  dalla riga 32 alla 45 è identico ad un'altro pezzo del codice (intorno alla riga 71)
    const num = document.createTextNode(costo)
    const mess = document.createTextNode("")

    butt.appendChild(mess)
    thing.appendChild(text)
    cost.appendChild(num)
    remover.appendChild(butt)

    row.appendChild(thing)
    row.appendChild(cost)
    row.appendChild(remover)

    const element = document.getElementById("carrello")
    element.appendChild(row)

    final.cart.push([name, GetColor(color), taglia])
    numofrow += 1
    if (name[0] === "F") {
      $("#notifica_felpa").toast("show") 
    } else {
      $("#notifica_maglia").toast("show") 
    }
  }

  if (name === "Borraccia" || name === "Annuario"){
    //  è una cosa stra ripetitiva (tutto ciò che è nell'if)
    row.setAttribute("class", "row")
    row.setAttribute("id", numofrow)
    thing.setAttribute("class", "col-7")
    cost.setAttribute("class", "col-3")
    remover.setAttribute("class", "col")
    butt.setAttribute("class", "btn btn-outline-danger btn-sm fas fa-trash-alt")
    butt.setAttribute("onclick", "Remove(" + numofrow + ")")
    if (numofrow === 1){
      row.setAttribute("style", "border:1px solid #ffa052;")
    } else {
      row.setAttribute("style", "border-bottom : 1px solid #ffa052; border-left : 1px solid #ffa052; border-right : 1px solid #ffa052;")
    }

    const text = document.createTextNode(name)
    const num = document.createTextNode(costo)
    const mess = document.createTextNode("")

    butt.appendChild(mess)
    thing.appendChild(text)
    cost.appendChild(num)
    remover.appendChild(butt)

    row.appendChild(thing)
    row.appendChild(cost)
    row.appendChild(remover)

    const element = document.getElementById("carrello")
    element.appendChild(row)

    final.cart.push([name])
    numofrow += 1
    if (name === "Borraccia") {
      $("#notifica_borraccia").toast("show") 
    } else {
      $("#notifica_annuario").toast("show") 
    }
  }

  update_id()
}

function download(content, fileName, contentType) {
  //  var!!!!!
  var a = document.createElement("a")
  var file = new Blob([content], { type: contentType })
  a.href = URL.createObjectURL(file)
  a.download = fileName
  a.click()
}

const SEND = function (){
  //  ripetitivo
  final.Email = document.getElementById("Email").value
  final.Nome = document.getElementById("Nome").value
  final.Cognome = document.getElementById("Cognome").value
  final.Indirizzo = document.getElementById("Indirizzo").value
  final.Comune = document.getElementById("Comune").value
  final.CAP = document.getElementById("CAP").value
  final.Sede = document.getElementById("Sede").value
  final.Sezione = document.getElementById("Sezione").value
  final.Classe = document.getElementById("Classe").value
  final.cart = localStorage.getItem("cart")
  fetch("/register_order", {
    method: "POST", 
    body: JSON.stringify(final),
    headers: { "Content-Type": "application/json", Accept: "application/json" }
  })
    .then(res => res.json())
    .then(res => {
      //  destruttura res!!
      if (res.status == 200) {
        alert("L'ordine è stato registrato con successo")
        localStorage.setItem("cart", "")
      } else if (res.status == 700) {
        alert(res.error)
      }
    })
}

const SAVE = function (i){
  if (!final.cart.join()) {
    alert("Il carrello è vuoto")
    return null
  }
  localStorage.setItem("cart", final.cart.map(e => e.length > 1 ? `${e[0]}, ${e.flatMap((e, i) => i ? e : "").filter(e => {
    if (e) {
      return e
    }
  }).join(", ")}` : e.toString()).join("; "))
  const but = document.getElementById("goform_" + i)
  but.href = "/form"
}

const CambiaColore = function (newimage, name){
  const pic = document.getElementById(name)
  pic.src = newimage
}

const Remove = function (i){
  const torem = document.getElementById("carrello").children[i]
  if (i - 1 > -1) {
    final.cart.splice(i - 1, 1)
  }
  document.getElementById("carrello").removeChild(torem)
  update_id()
}

const final = {
  cart : []
}


const GetColor = function (color) {
  const arrcolo = ["BLACK", "GREEN", "WHITE", "RED", "GREY", "BLUE"]
  for (let i = 0; i < arrcolo.length; i++){
    if (color.indexOf(arrcolo[i]) > 0){
      return arrcolo[i]
    }
  }
}


const update_id = function() {
  //  detruttura children!!!
  const children = document.getElementById("carrello").children
  let num_borracce = 0
  let num_felpe = 0
  const borracce = []
  for (let i = 1; i < children.length; i++) {
    children[i].id = i
    children[i].children[2].children[0].setAttribute("onclick", "Remove(" + i + ")")
    // di solito si assegna una classe non un'attributo style
    if (i === 1){
      children[i].setAttribute("style", "border:1px solid #ffa052;")
    } else {
      children[i].setAttribute("style", "border-bottom : 1px solid #ffa052; border-left : 1px solid #ffa052; border-right : 1px solid #ffa052;")
    }
    if (children[i].children[0].innerText === "Borraccia") {
      children[i].children[1].innerText = "Gratis"
      num_borracce += 1
      borracce.push(children[i].children[1])
    }
    if (children[i].children[0].innerText[0] === "F") {
      num_felpe += 1
    }
  }
  const delta = num_borracce - num_felpe
  if (delta > 0){
    for (let y = 0; y < delta; y++) {
      borracce[y].innerText = 3
    }
  }
}


const delete_order = function() {
  fetch("/delete_order_request", {
    method: "POST", 
    body: JSON.stringify({ id: document.getElementById("delete_id").value }),
    headers: { "Content-Type": "application/json", Accept: "application/json" }
  })
    .then(res => res.json())
    .then(res => {
      //  destruttura res
      alert(res.msg)
    })
}


const render_carrello = function() {
  const carrello = localStorage.getItem("cart").split("; ").map(e => e.split(", "))
  //  const graphic forse
  graphic = document.getElementById("carrello")
  carrello.forEach((val, i) => {
    const element = document.createElement("div")
    element.setAttribute("class", "card card-body")
    if (i === 0){
      element.setAttribute("style", "border:1px solid #ffa052; margin-top: 10px;")
    } else {
      element.setAttribute("style", "border-bottom : 1px solid #ffa052; border-left : 1px solid #ffa052; border-right : 1px solid #ffa052;")
    }
    element.innerHTML = val[0]
    //  graphic is not defined
    graphic.appendChild(element)
  })
}