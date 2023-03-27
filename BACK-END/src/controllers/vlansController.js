import vlan from "../models/vlansModel.js";


class VlanController  {
    static vlanSave = (req, res) => {
        let vlans = new vlan(req.body)
        vlans.save((err) =>{
            if(err) {
                res.status(500).send({message: `${err.message} - falha ao cadastrar vlan.`})
            } else{
                 res.status(201).send({message: `VLAN cadastrada com sucesso.`})
                }
        })
    }
}

export default VlanController;