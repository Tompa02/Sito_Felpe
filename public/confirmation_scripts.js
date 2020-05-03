const confirm_order = function() {
  fetch("/confirm_order_request", {
    method: "POST",
    body: JSON.stringify({ id: document.getElementById("confirm_id").value }),
    headers: { "Content-Type": "application/json", Accept: "application/json" }
  })
    .then(res => res.json())
    .then(res => {
      alert(res.msg)
    })
}