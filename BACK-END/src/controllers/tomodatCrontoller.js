import {fetchTomodat} from "../scripts/fetchApiTomodat.js";
import {getAllAcessPointsByCity} from "../scripts/fetchApiTomodat.js";
import {addClient} from "../scripts/fetchApiTomodat.js"
//import { deleteTomodat } from "../scripts/fetchApiTomodat.js";
import fetch from "node-fetch";

const reqConfig = {
    method: "DELETE",
    
    headers: {
      "Authorization": "6f1abca83548d1d58a92e6562ed7e118358cc7ba",
      "Content-Type": "application/json",
      "Accept-encoding": "application/json",
      "Access-Control-Allow-Origin": '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE'
    }
  }

class TomodatController {

    static ListarClients = (req, res) => {
        fetchTomodat().then(data =>{
            res.json(data);
        });
    
    };

    static ListarCtos = (req, res) => {
        getAllAcessPointsByCity().then(data =>{
            res.json(data);
        })
    };
    
    static CadastrarClient = (req, res) => {
        addClient(req, res);
    };

    static  DeleteClient = async (req, res) => {
     let id = req.params.id
     try {
      const response = await fetch(`https://sp.tomodat.com.br/tomodat/api/clients/${id}`, reqConfig)
      
      console.log(`resposta do servidor do tomodat: ${response}`)
      if(response.ok) {
        res.status(201).send({ ApiTomodatDeleteOk: `deletado com sucesso ${id}` })
      } else {
        res.status(201).send({erro: "erro ao deletar cliente"})
      }
     } catch(err){
      console.error("erro"+err)
     }
    }
}
   
export default TomodatController
    