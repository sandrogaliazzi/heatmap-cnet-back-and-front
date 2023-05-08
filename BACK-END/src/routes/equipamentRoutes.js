import express  from "express";
import equipamentController from "../controllers/equipamentClientController.js";


const router = express.Router();

router
 .post("/equipamentcadastro", equipamentController.equipamenteSave) // salva no banco os dados do pppoe.
 .get("/equipamentget", equipamentController.FetchEquipament) // get all equipament data.
 .put("/equipamentatualizar", equipamentController.atualizarEquipament) // update equipamente, id no params e dados no body dados (name, ip category)
 .delete("/equipamentdelete", equipamentController.excluirEquipament) // deleta equipamento, id no params. 
 export default router;