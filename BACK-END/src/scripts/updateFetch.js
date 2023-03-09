import needle from "needle";
import fetTomodat from "../models/fetchModel.js"
import { fetchTomodat } from "../scripts/fetchApiTomodat.js"
import db from "../config/dbConnect.js"


db.on("error", console.log.bind(console, 'erro de conexão'))
db.once('open', () => {
    let now = new Date().toLocaleString("PT-br");
    console.log(`conexão com o banco em: ${now}`)
})

// function cadastroFetch() {
//     let now = new Date();
//     needle.get("https://api.heatmap.conectnet.net/updatefetch")
//     console.log(`Fetch send to Db: ${now}`)
// }

// function updateFetch(){
//     let now = new Date().toLocaleString("PT-br");
//     fetchTomodat().then(data => {
//     data.forEach(element => {
//       JSON.stringify(element)
//       let dados = element
//       let id = dados.id
//       fetTomodat.findOneAndUpdate({"id": id}, {$set: dados}, (err) => {
//                 if(!err) {
//                     console.log(`Fetch send to Db: ${now}`)
//                 } else {
//                     console.log({message: err.message})
//           }})
//     });
// })
// console.log(`Fetch send to Db: ${now}`)
// } 


// setInterval(updateFetch, 900000) // setinterval = 15m (900000)
// updateFetch()

// cadastroFetch()

function runScript() {
    function updateFetch(){
        let now = new Date().toLocaleString("PT-br");
        fetchTomodat().then(data => {
        data.forEach(element => {
          JSON.stringify(element)
          let dados = element
          let id = dados.id
          fetTomodat.findOneAndUpdate({"id": id}, {$set: dados}, (err) => {
                    if(!err) {
                        // console.log(`Fetch send to Db: ${now}`)
                    } else {
                        console.log({message: err.message})
              }})
        });
    })
    console.log(`Fetch send to Db: ${now}`)
    } 
}

function loop() {
  for (let i = 1; i <= 10; i++) {
    setTimeout(runScript, 3 * 100000); // Delay execution by i seconds
    let now = new Date().toLocaleString("PT-br");
    console.log(`loop iniciado em ${now}`)
}
  
  
  setTimeout(loop, 10000); // Restart loop after 10 seconds
}

loop(); // Start loop