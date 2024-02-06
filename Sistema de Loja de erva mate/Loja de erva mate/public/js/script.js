document.getElementById("quantidade").addEventListener("change", () => {
    const quantidade = parseInt(document.getElementById("quantidade").value);
    const precoProd = parseInt(document.getElementById("precoProd").value);
    const total = quantidade * precoProd;
    document.getElementById("total").value = "R$ " + total + ",00";
});
