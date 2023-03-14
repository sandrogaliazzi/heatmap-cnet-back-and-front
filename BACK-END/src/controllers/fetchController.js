import fetTomodat from "../models/fetchModel.js"
import { fetchTomodat } from "../scripts/fetchApiTomodat.js"
import mongoose from "mongoose";
import ctoClient from "../models/ctoClient.js"


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

static FetchWithCtoCLient = (req, res) => {
  let fetchtomodatsModel = fetTomodat;  
  let ctoclients = ctoClient;
  const pipeline = [
    {
      $lookup: {
        from: "ctoclients",
        let: { cto_id: "$id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$cto_id", "$$cto_id"] } } },
          {
            $project: {
              id: 1,
              name: 1,
              lat: 1,
              lng: 1,
              cto_id: 1,
              user: 1,
              date_time: 1
            }
          }
        ],
        as: "cto_clients_loc"
      }
    }
  ];
    
  fetchtomodatsModel.aggregate(pipeline).exec((err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      let retorno = JSON.stringify(result, null, 2)
      res.status(200).send(result)
      // do something with the result, such as rendering it in a web page or sending it in a response
    }
  });    
}
}

export default fetTomodatController;
