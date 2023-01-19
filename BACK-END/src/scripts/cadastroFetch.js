import needle from "needle";

function cadastroFetch() {
    let now = new Date();
    needle.get("https://api.heatmap.conectnet.net/cadastrofetch")
    console.log(`Fetch send to Db: ${now}`)
}

setInterval(cadastroFetch, 21600000) // setinterval = 6h (21600000)
