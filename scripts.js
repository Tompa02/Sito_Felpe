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
}

const cart = {
    
}