import PppoeData from "../models/pppoeModel.js";

class PppoeDataController {

    static ListarPppoe = (req, res) => {
        PppoeData.find((err, user)=>{
        res.status(200).json(user)
        }).sort({_id: -1})
    }

    static CadastroPppoe = (req, res, next) => {
        let { name, lat, lng, cto_id, cto_name, pppoe } = req.body;
        let cadastro = { name, lat, lng, cto_id, cto_name, pppoe };
        let pppoeCadastro = new PppoeData(cadastro);
        pppoeCadastro.save((err) =>{
            if(err) {
                res.status(500).send({message: `${err.message} - falha ao cadastrar pppoe.`})
            } else {
                res.status(201).send({DbLogPPPoE: `PPPoE ${pppoe} Cadastrado no banco com sucesso.`});
                return next();
            }
        })
    }
        
    }
    
    export default PppoeDataController;