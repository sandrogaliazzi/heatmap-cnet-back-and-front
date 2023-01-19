
import tracking from "../models/trackingModel.js";

class TrakingController {


    static CadastrarTracking = (req, res, next) => {
    let trackings = new tracking(req.body);
    trackings.save((err) =>{
        if(err) {
            res.status(500).send({message: `${err.message} - falha ao cadastrar traking.`})
        } else{
            res.status(201).send("localização inserida do banco")
            return next()
        }
    })
}




}

export default TrakingController;