import express  from "express";
import CtoClientController from "../controllers/ctoClientController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router
 .post("/ctoclient", CtoClientController.CadastrarCtoClient)
 .get("/ctoclient", CtoClientController.ListarCtoClient)
 .post("/ctoclientid", CtoClientController.ListarCtoClientById)

export default router;