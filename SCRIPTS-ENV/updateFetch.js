import needle from "needle";
import fetTomodat from "../BACK-END/src/models/fetchModel.js"
import { fetchTomodat } from "../BACK-END/src/scripts/fetchApiTomodat.js"
import db from "../BACK-END/src/config/dbConnect.js"
import dotenv from 'dotenv';
dotenv.config()


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
//     //   JSON.stringify(element)
//       let dados = element
//     //  let name = element.name
//     //  let coord = element.coord
//     //  let clients = element.clients
//     //  let city = element.city
//     //  let percentage_free = element.percentage_free
//      let id = element.id
//     //  let dados = {
//     //     name, 
//     //     coord,
//     //     clients,
//     //     city,
//     //     percentage_free
//     //  }
//     // //  console.log(id, dados)
//       fetTomodat.findOneAndUpdate({"id": id}, {$set: dados}, (err) => {
//                 if(!err) {
//                     console.log(`Fetch send to Db: ${now}`)
//                 } else {
//                  console.log({message: err.message})
//           }})
//     });
    
// })
// } 


// setInterval( ()=>{
//     updateFetch()
//     let now = new Date().toLocaleString("PT-br")
//     console.log(`Fetch Update send to Db: ${now}`)
// }, 900000) // setinterval = 15m (900000)
// //   updateFetch();

// // cadastroFetch()

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
                         console.log(`Fetch send to Db: ${now}`)
                    } else {
                        console.log({message: err.message})
              }})
        });
    })
    console.log(`Fetch send to Db: ${now}`)
    } 
 updateFetch();
}

function loop() {
  for (let i = 1; i <= 1; i++) {
    let now = new Date().toLocaleString("PT-br");
    console.log(`iniciando loop em ${now} `)
    runScript();
}
  
  
  setTimeout(loop, 300000); // Restart loop after 5 min
}

loop(); // Start loop