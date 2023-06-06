import fetTomodat from "../models/fetchModel.js"
import { fetchTomodat } from "../scripts/fetchApiTomodat.js"
import mongoose from "mongoose";
import ctoClient from "../models/ctoClient.js"
import PppoeData from "../models/pppoeModel.js";


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
       res.status(200).send(result)
      }
  });    
}

static ListarFetchPppoeAndDelete = async (req, res) => {
  try {
    let fetchtomodatsModel = fetTomodat;
    let pppoeDataModel = PppoeData;

    // Step 1: Fetch all names from the clients field in the fetTomadat collection
    const fetTomadatClients = await fetchtomodatsModel.distinct('clients.name');

    // Step 2: Fetch all data from the pppoeData collection where the name does not exist in fetTomadatClients
    const pppoeData = await pppoeDataModel.find({ name: { $nin: fetTomadatClients } });

    // Step 3: Log the excluded pppoe data
    pppoeData.forEach(pppoe => {
      console.log(pppoe);
    });

    // Step 4: Filter the names using strict comparison
    const escapedNames = fetTomadatClients.map(name => escapeRegExp(name));
    const namesToDelete = escapedNames.map(escapedName => new RegExp(`^${escapedName}$`, 'i'));

    // Step 5: Remove the excluded documents from the pppoeData collection
    await pppoeDataModel.deleteMany({ name: { $nin: namesToDelete } });

    // Function to escape special characters in a string
    function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Step 6: Send a success response
    res.status(200).json({ message: 'Data filtered and deleted successfully' });
  } catch (error) {
    // Step 7: Log the error
    console.error('An error occurred:', error);

    // Step 8: Send an error response
    res.status(500).json({ error: 'Internal server error' });
  }
};








}

export default fetTomodatController;
