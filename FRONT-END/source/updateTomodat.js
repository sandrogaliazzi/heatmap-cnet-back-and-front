// import {sendApiReq} from "./handleApiRequests.js";

// function converToMiliseconds(time) {
//     return time * 3600000
// }


// async function updateDB() {
//     try {
//         const update = await sendApiReq({
//             endpoint: "updatefetch",
//             httpMethod: "GET"
//         });
    
//         console.log(update.data.message);
//         console.log(`Atualizado em ${new Date().toLocaleString("pt-BR", {timeZone: "UTC"})}`);
//     } catch(err) {
//         console.error(`erro ao atualizar banco de dados. Erro: ${err.message}`);
//     }
// }

// setInterval(() => {
//     updateDB().then(console.log)
// }, converToMiliseconds(2));