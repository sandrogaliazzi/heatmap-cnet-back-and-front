import express  from "express";
import TomodatController from "../controllers/tomodatCrontoller.js";
import LogClientController from "../controllers/logsController.js";
import CtoClientController from "../controllers/ctoClientController.js";
import auth from "../middleware/auth.js";
import fetTomodatController from "../controllers/fetchController.js";
import PppoeDataController from "../controllers/pppoeController.js";

const router = express.Router();

router
 .get("/tomodat", TomodatController.ListarClients) // fetch direto do tomodat (60 segundos)
 .post("/client", auth, LogClientController.CadastrarLog, PppoeDataController.CadastroPppoe, CtoClientController.CadastrarCtoClientN, TomodatController.CadastrarClient) // add cliente no db, log e tomodat.
 .get("/logctoclient", auth, LogClientController.ListarLogCtoClient) // lista os logs de clientes cadastrados nas ctos.
 .delete("/deleteclientfromtomodat/:id", auth, TomodatController.DeleteClient) //deleta cliente no servido do tomodat
 .get("/getalltomodat", TomodatController.ListarCabos) //lista tomodat completo
 .post("/rotasave", TomodatController.SalvarRota) // salva rota no banco
 export default router;