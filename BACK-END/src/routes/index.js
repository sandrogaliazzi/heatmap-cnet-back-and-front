import  express from "express";
import users from "./userRoutes.js";
import tomodat from "./tomodatRoutes.js";
import token from "./tokenRoutes.js";
import fetch from "./fetchRoutes.js";
import cto from "./ctoClientRoutes.js"
import tracking from "./trackingRoutes.js";
import login from "./loginRoutes.js";
import instalacoes from "./instalacoesRoutes.js"

const routes = (app) => {
    app.route('/').get((req, res) => {
        res.status(200).send({message: "Estte é o servidor BACKEND da aplicação da Conectnet Telecomunicações"})
    })


   app.use(
     express.json(),
     users,
     tomodat,
     token,
     fetch,
     cto,
     tracking,
     login,
     instalacoes
     )
}

export default routes;