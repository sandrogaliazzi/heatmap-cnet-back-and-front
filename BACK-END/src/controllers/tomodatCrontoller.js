import {getAllClientsByCto} from "../fetchApiTomodat.js";
import {getAllAcessPointsByCity} from "../fetchApiTomodat.js";

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
    }
    
    }

 
    
    export default TomodatController
    