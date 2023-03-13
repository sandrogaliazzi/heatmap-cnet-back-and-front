import express  from "express";
import InstalacoesController from "../controllers/instalacoesController.js";


const router = express.Router();

router
 .post("/instalacoes", InstalacoesController.SaveInstalacao) // salva no banco os dados da instalação.
 .get("/instalacoesget", InstalacoesController.FetchInstalacao)// requisita do banco os dados
 
 
 export default router;