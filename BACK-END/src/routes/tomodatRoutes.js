import express  from "express";
import TomodatController from "../controllers/tomodatCrontoller.js";
import LogClientController from "../controllers/logsController.js";

const router = express.Router();

router
 .get("/tomodat", TomodatController.ListarClients)
 .get("/ctos", TomodatController.ListarCtos)
 .post("/client", TomodatController.CadastrarClient)
.post("/client", )
export default router;