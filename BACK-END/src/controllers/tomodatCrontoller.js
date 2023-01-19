import {fetchTomodat, getAllClientsByCto} from "../scripts/fetchApiTomodat.js";
import {getAllAcessPointsByCity} from "../scripts/fetchApiTomodat.js";
import {addClient} from "../scripts/fetchApiTomodat.js"

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

    }

 
    
    export default TomodatController
    