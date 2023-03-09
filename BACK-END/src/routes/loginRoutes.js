import express  from "express";
import LoginController from "../controllers/loginController.js"


const router = express.Router();

router
 .get("/dadoslogin", LoginController.ListarLogin) // cadastra o tracking no banco

 
export default router;