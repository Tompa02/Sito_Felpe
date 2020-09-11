const confirm_order = function() {
    if (document.getElementById("confirm_id").value === '') { create_alert('Inserire una sequenza valida', 'info'); return 0 }
    fetch("/confirm_order_request", {
        method: "POST", 
        body: JSON.stringify({"id": document.getElementById("confirm_id").value}),
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    })
    .then(res => res.json())
    .then(res => {
        create_alert(res.msg, 'info')
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