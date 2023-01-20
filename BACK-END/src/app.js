import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import db from "./config/dbConnect.js"


const app = express()

db.on("error", console.log.bind(console, 'erro de conexão'))
db.once('open', () => {
   let now = new Date().toLocaleString("PT-br");
    console.log(`conexão com o banco em: ${now}`)
})

app.use(cors({
    credentials: true,
  }));
// app.use(cors());
app.use(express.json({limit: '50mb'})); //add {limit: '50mb'} referente ao erro PayloadTooLargeError: request entity too large

routes(app);

export default app