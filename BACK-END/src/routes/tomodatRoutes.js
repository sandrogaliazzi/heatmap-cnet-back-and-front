import express  from "express";
import TomodatController from "../controllers/tomodatCrontoller.js";

const router = express.Router();

router
 .get("/tomodat", TomodatController.ListarClients)
 .get("/ctos", TomodatController.ListarCtos)
 .post("/client", TomodatController.CadastrarClient)

export default router;