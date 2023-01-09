import express  from "express";
import UserController from "../controllers/usersController.js";


const router = express.Router();

router
 .get("/users", UserController.ListarUsers)
 .post("/users", UserController.CadastrarUser)
 .post("/registrar", UserController.RegisterUser)

export default router;