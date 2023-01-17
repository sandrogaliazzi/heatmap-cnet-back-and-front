import express  from "express";
import fetchController from "../controllers/fetchController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router
 .get("/fetch", fetchController.ListarFetch)
 .get("/cadastrofetch", fetchController.CadastrarFetch)
 .get("/updatefetch", fetchController.UpdateFetch)
 
export default router;