const Aggiungi = function (name, costo) {
    let row = document.createElement("div")
    let thing = document.createElement("div")
    let cost = document.createElement("div")

    row.setAttribute('class', 'row')
    thing.setAttribute('class', 'col-10')
    cost.setAttribute('class', 'col')



    let text = document.createTextNode(name)
    let num = document.createTextNode(costo)

    thing.appendChild(text)
    cost.appendChild(num)

    row.appendChild(thing)
    row.appendChild(cost)

    let element = document.getElementById("carrello")
    element.appendChild(row)

    final.cart.push(name)
    final.cost += costo
}

const final = {
    cart : [],
    cost: 0
}

const SEND  = function (){
    final.Email = document.getElementById("Email").value
    final.Nome = document.getElementById("Nome").value
    final.Cognome = document.getElementById("Cognome").value
    final.Indirizzo = document.getElementById("Indirizzo").value
    final.Comune = document.getElementById("Comune").value
    final.Sede = document.getElementById("Sede").value
    final.Sezione = document.getElementById("Sezione").value

    
    let jsonData = JSON.stringify(final)

    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
    download(jsonData, 'json.txt', 'text/plain');
}
