import fetTomodat from "../models/fetchModel.js"
import { fetchTomodat } from "../scripts/fetchApiTomodat.js"



class fetTomodatController {

    static CadastrarFetch = (req, res) => {
        fetchTomodat().then(data => {
            data.forEach(element => {
              JSON.stringify(element)
              let fet = new fetTomodat(element);
              fet.save((err) =>{
                if(err) {
                    console.log({message: `${err.message} - falha ao cadastrar.`})
                } else{
                  console.log({message: `elemento do fetch cadastrado com sucesso`})
                }
            });
            });
            res.send({message: "fetch cadastrado com sucesso"});
          });
          
    };

    static UpdateFetch = (req, res)=> {
      let now = new Date()  
      fetchTomodat().then(data => {
            data.forEach(element => {
              JSON.stringify(element)
              let dados = element
              let id = dados.id
              fetTomodat.findOneAndUpdate({"id": id}, {$set: dados}, (err) => {
                        if(!err) {
                            console.log({message: `Fetch atualizado com susesso. ${now}`})
                        } else {
                            console.log({message: err.message})
                  }})
            });
            res.send({message: "fetch atualizado com sucesso"});
          });
    }
            

    static ListarFetch = (req, res) => {
      fetTomodat.find((err, fetTomodats)=>{
    res.status(200).json(fetTomodats)
})
};

 static UpdateFetchCtoCLient = (req, res, next) => {
  let idCto = req.body.cto_id;
  let name = req.body.name
  let lat = req.body.lat
  let lng = req.body.lng
  let id = 999999994
  let dadosCliente = {name, id}
  let newClient = dadosCliente;
  console.log(newClient)
  fetTomodat.findOneAndUpdate({"cto_id": idCto}, { $push: { "clients": newClient } }, (err) =>{
    if(err){
      console.log(err)
    } else {
      return next();
    }
  })   
}
}

export default fetTomodatController;
