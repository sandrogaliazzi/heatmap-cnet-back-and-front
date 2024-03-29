
import express  from "express";
import PppoeDataController from "../controllers/pppoeController.js";
import auth from "../middleware/auth.js";


const router = express.Router();

router
 .post("/pppoecadastro", auth, PppoeDataController.CadastroPppoe) // salva no banco os dados do pppoe.
 .get("/pppoeget", PppoeDataController.ListarPppoe) // requisita do banco os dados.
 .post("/pppoeonline", auth, PppoeDataController.pppoeOnline) // verifica se esta online o pppoe.
 .get("/getallpppoeonline", auth, PppoeDataController.findAllPppoeOnline) // verifica no concentrador quais estão online e retorna para o front.
 .patch("/pppoealterar/:id", PppoeDataController.atualizarPppoe) // recebe no param o id do item, e no body os items a serem mudados.
 .delete("/pppoedeletar/:id", PppoeDataController.deletarPppoe) // recebe o id no param e deleta.
  export default router;