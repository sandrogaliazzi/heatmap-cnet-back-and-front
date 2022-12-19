import express from "express";
import cors from "cors";
import {getAllClientsByCto} from "./fetchApiTomodat.js";

const app = express()

app.use(cors({
    credentials: true,
  }));
// app.use(cors());
app.use(express.json());

app.get('/tomodat', (req, res) => {
    getAllClientsByCto().then(data =>{
        res.json(data);
    });
})

//server
export default app