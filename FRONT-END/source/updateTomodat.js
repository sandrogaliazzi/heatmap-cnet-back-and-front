import {sendApiReq} from "./handleApiRequests.js";

const updateBtn = document.querySelector("#updateFetchBtn");



async function updateDB() {
    try {
        await sendApiReq({
            endpoint: "updatefetch1",
            httpMethod: "GET"
        });
    
        location.reload();

    } catch(err) {
        console.error(`erro ao atualizar banco de dados. Erro: ${err.message}`);
    }
}

updateBtn.addEventListener("click", _ => updateDB());