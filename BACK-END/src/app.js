import express from "express";
import cors from "cors";
import {getAllClientsByCto} from "./fetchApiTomodat.js";
import { getAllAcessPointsByCity } from "./fetchApiTomodat.js";
import routes from "./routes/index.js";
import db from "./config/dbConnect.js"
import user from "./models/users.js"

const app = express()

db.on("error", console.log.bind(console, 'erro de conexão'))
db.once('open', () => {
    console.log('conexão com o banco')
})

app.use(cors({
    credentials: true,
  }));
// app.use(cors());
app.use(express.json());

routes(app);

export default app