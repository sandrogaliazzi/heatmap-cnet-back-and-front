import PppoeData from "../models/pppoeModel.js";
import { Client } from 'ssh2';
import dotenv from 'dotenv';
dotenv.config()

class PppoeDataController {

    static ListarPppoe = (req, res) => {
        PppoeData.find((err, user)=>{
        res.status(200).json(user)
        }).sort({_id: -1})
    }

    static CadastroPppoe = (req, res, next) => {
        let { name, lat, lng, cto_id, cto_name, pppoe } = req.body;
        let cadastro = { name, lat, lng, cto_id, cto_name, pppoe };
        let pppoeCadastro = new PppoeData(cadastro);
        pppoeCadastro.save((err) =>{
            if(err) {
                res.status(500).send({message: `${err.message} - falha ao cadastrar pppoe.`})
            } else {
                res.status(201).send({DbLogPPPoE: `PPPoE ${pppoe} Cadastrado no banco com sucesso.`});
                return next();
            }
        })
    }
    static pppoeOnline = (req, res) => {
     let pppoe = req.body.pppoe;
     const sshClient = new Client();
     sshClient.connect({
      host: process.env.HUAWEY_HOST,
      username: process.env.HUAWEY_USERNAME,
      password: `#${process.env.HUAWEY_PASSWORD}`,
     });

     sshClient.on('ready', () => {
     sshClient.exec(`display access-user username ${pppoe}`, (err, stream) => {
      if (err) throw err;
      let output = '';
      stream.on('data', (data) => {
        output += data.toString();
      });
      stream.on('close', () => {
        if (output.includes('PPPoE')) {
          res.status(201).send({message:'PPPoE is online.'});
        } else {
          res.status(500).send({message: 'PPPoE is offline or not exist.'});
        }
        sshClient.end();
        });
       stream.stderr.on('data', (data) => {
       console.error(data.toString());
       });
       });
       });  
      sshClient.on('error', (err) => {
      console.error(err);
       });
  
     sshClient.on('close', () => {
     console.log('SSH connection closed.');
     });    
    }
    }
    
    export default PppoeDataController;