import express  from "express";
import VlanController from "../controllers/vlansController.js";


const router = express.Router();

router
 .post("/vlan", VlanController.vlanSave) // salva a vlan no banco.
 .get("/vlan", VlanController.ListVlans) // lista as vlans no banco.
 
export default router;