import ctoClientLog from "../models/ctoClientLogModel.js"




class CtoClientLogController {

    static CadastrarCtoClientLogN = (req, res, next) => {
        let CtoClientLogs = new ctoClientLog(req.body);
            CtoClientLogs.save((err) =>{
            if(err) {
                res.status(500).send({message: `${err.message} - falha ao cadastrar cliente a CTO.`})
            } else {
                return next();
            }
        })
    };

//     static ListarCtoClient = (req, res) => {
//     ctoClientLog.find((err, ctoClient)=>{
//     res.status(200).send(ctoClient)
// }).sort({_id: -1}) //sort id -1 retorna as adições mais novas no banco
// };

// static deleteCtoClientLog = (req, res) => {
//     let id = req.params.id
//     ctoClientLog.findByIdAndDelete(id, (err) => {
//         if(err) {
//             res.status(500).send({message: `${err.message} - falha ao deletar log.`})
//         } else {
//             res.status(201).send({message: `log deletado com sucesso`})
//         }
//     })
// }
   
  
};




export default CtoClientLogController;