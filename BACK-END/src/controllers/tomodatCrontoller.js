import {getAllClientsByCto} from "../fetchApiTomodat.js";
import {getAllAcessPointsByCity} from "../fetchApiTomodat.js";
import {addClient} from "../fetchApiTomodat.js"

class TomodatController {

    static ListarClients = (req, res) => {
        getAllClientsByCto().then(data =>{
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

    }

 
    
    export default TomodatController
    