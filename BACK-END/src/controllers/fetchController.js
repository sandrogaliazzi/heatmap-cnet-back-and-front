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
        fetchTomodat().then(data => {
            data.forEach(element => {
              JSON.stringify(element)
              let dados = element
              let id = dados.id
              fetTomodat.findOneAndUpdate({"id": id}, {$set: dados}, (err) => {
                        if(!err) {
                            console.log({message: `Alteração realizada com sucesso,`})
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



}

export default fetTomodatController;
