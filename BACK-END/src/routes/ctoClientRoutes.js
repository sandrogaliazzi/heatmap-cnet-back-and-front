import express  from "express";
import CtoClientController from "../controllers/ctoClientController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router
 .post("/ctoclient", CtoClientController.CadastrarCtoClient) // cadastra o cliente no banco
 .get("/ctoclient", CtoClientController.ListarCtoClient) //lista todos os clientes no banco
 .post("/ctoclientid", CtoClientController.ListarCtoClientById) //recebe cto_id e name e retorna link ou false
 .post("/updatectoclient", CtoClientController.UpdateCtoClientById) //recebe dados e atualiza no banco.
export default router;