import express  from "express";
import equipamentController from "../controllers/equipamentClientController.js";


const router = express.Router();

router
 .post("/equipamentcadastro", equipamentController.equipamenteSave) // salva no banco os dados do pppoe.
 .get("/equipamentget", equipamentController.FetchEquipament) // get all equipament data.
 export default router;