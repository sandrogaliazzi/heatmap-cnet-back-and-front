import logCtoClient from "../models/logsCtoClient.js"


class LogClientController {

static ListarLogCtoClient = (req, res) => {
    logCtoClient.find((err, logCtoClient)=>{
    res.status(200).json(logCtoClient)
})
}

static CadastrarLogCtoClient = (req, res) => {
    let logCtoClient = new logCtoClient(req.body);
    logCtoClient.save((err) =>{
        if(err) {
            res.status(500).send({message: `${err.message} - falha ao cadastrar user.`})
        } else{
            res.status(201).send(logCtoClient.toJSON())
        }
    })
}

}

export default LogClientController;

