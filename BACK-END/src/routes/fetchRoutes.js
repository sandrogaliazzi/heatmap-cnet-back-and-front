import express  from "express";
import fetchController from "../controllers/fetchController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router
 .get("/fetch", fetchController.ListarFetch) // lista o fetch do banco
 //.get("/cadastrofetch", fetchController.CadastrarFetch) // executa o fetch no tomodat e cadastra no banco
 //.get("/updatefetch1", fetchController.UpdateFetch) // executa o fetch no tomodat e atualiza as info no banco
 .get("/fetchwithctoclient", fetchController.FetchWithCtoCLient) // pega o fetch no banco e agrega com as localizações já cadastradas dos clientes
 .get("/testepppoe",fetchController.ListarFetchPppoeAndDelete)
 export default router;