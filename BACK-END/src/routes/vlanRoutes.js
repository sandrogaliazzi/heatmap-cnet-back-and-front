import express  from "express";
import VlanController from "../controllers/vlansController.js";


const router = express.Router();

router
 .post("/vlan", VlanController.vlanSave) // save vlan to mongo db.
 .get("/vlan", VlanController.ListVlans) // list the vlans already in db.
 
export default router;