
import express  from "express";
import PppoeDataController from "../controllers/pppoeController.js";
import auth from "../middleware/auth.js";


const router = express.Router();

router
 .post("/pppoecadastro", auth, PppoeDataController.CadastroPppoe) // salva no banco os dados do pppoe.
 .get("/pppoeget", PppoeDataController.ListarPppoe)// requisita do banco os dados.
 .post("/pppoeonline", auth, PppoeDataController.pppoeOnline) // verifica se esta online o pppoe.
//  .post("/saveallpppoeonline", auth, PppoeDataController.SavePppoeOnline) // save all pppoe
 .get("/getallpppoeonline", auth, PppoeDataController.findAllPppoeOnline) // find all pppoe
 
 
 export default router;