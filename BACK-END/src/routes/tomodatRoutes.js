import express  from "express";
import TomodatController from "../controllers/tomodatCrontoller.js";
import LogClientController from "../controllers/logsController.js";
import CtoClientController from "../controllers/ctoClientController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router
 .get("/tomodat", TomodatController.ListarClients) // fetch direto do tomodat 30segundos
//  .get("/ctos", TomodatController.ListarCtos)
 .post("/client", auth, LogClientController.CadastrarLog, CtoClientController.CadastrarCtoClientN, TomodatController.CadastrarClient)
//  .post("/logctoclient", auth, LogClientController.CadastrarLog)
 .get("/logctoclient", auth, LogClientController.ListarLogCtoClient)
//  .post("/teste", LogClientController.CadastrarLog, TomodatController.CadastrarClient)
export default router;