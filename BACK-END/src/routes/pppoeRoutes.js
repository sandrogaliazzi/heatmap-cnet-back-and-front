
import express  from "express";
import PppoeDataController from "../controllers/pppoeController.js";


const router = express.Router();

router
 .post("/pppoecadastro", PppoeDataController.CadastroPppoe) // salva no banco os dados do pppoe.
 .get("/pppoeget", PppoeDataController.ListarPppoe)// requisita do banco os dados.
 .get("/ppppoeonline", PppoeDataController.pppoeOnline) // verifica se esta online o pppoe.
 
 
 export default router;