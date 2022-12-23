import express  from "express";
import TomodatController from "../controllers/tomodatCrontoller.js";

const router = express.Router();

router
 .get("/tomodat", TomodatController.ListarClients)
 .get("/ctos", TomodatController.ListarCtos)

export default router;