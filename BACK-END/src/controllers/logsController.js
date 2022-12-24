import logCtoClient from "../models/logsCtoClient.js"




class LogClientController {

    static CadastrarLog = (req, res) => {
        let logCtoClients = new logCtoClient(req.body);
        logCtoClients.save((err) =>{
            if(err) {
                res.status(500).send({message: `${err.message} - falha ao cadastrar user.`})
            } else{
                res.status(201).send({DbLogCtoClient: `${logCtoClients.date_time}: Cliente ${logCtoClients.name} cadastrado com sucesso na cto ${logCtoClients.cto_name} pelo usuario: ${logCtoClients.user}.`})
            }
        })
    };



    static ListarLogCtoClient = (req, res) => {
    logCtoClient.find((err, logCtoClient)=>{
    res.status(200).json(logCtoClient)
})
};



}

export default LogClientController;
