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
     console.log(req.body)
     const sshClient = new Client();
     console.log(process.env.HUAWEY_USERNAME);
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
          console.log(output)
          console.log(`este é o ${pppoe}`)
          res.status(201).send({message:'PPPoE is online.'});
        } else {
          console.log(output)
          console.log(`este é o ${pppoe}`)
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

    static findAllPppoe = async (req, res) => {
      try {
        const docs = await PppoeData.find({}, { _id: 0, pppoe: 1 }).exec();
        const pppoeFields = docs.map(doc => doc.pppoe);
        console.log(pppoeFields);
      } catch (error) {
        console.error(error);
      }
    };
    
    
    static findAllPppoeOnline = (req, res) => {
      // Step 1: Get all PPPoE from the DB
      PppoeData.find({}, { pppoe: 1 })
        .lean()
        .then((pppoeDocs) => {
          const pppoeFields = pppoeDocs.map((doc) => doc.pppoe);
          const onlinePppoes = [];
          const offlinePppoes = [];
    
          // Step 2: Connect to SSH server and check PPPoE status for each PPPoE
          const sshClient = new Client();
          sshClient.on('error', (err) => {
            console.error(`SSH error: ${err.message}`);
            res.status(500).send({ message: 'Error checking PPPoE data' });
          });
          sshClient.on('close', () => {
            console.log('SSH connection closed.');
            res.status(200).json({ onlinePppoes, offlinePppoes });
          });
          console.log(`Connecting to SSH server at ${process.env.HUAWEI_HOST}...`);
          sshClient.connect({
            host: process.env.HUAWEY_HOST,
            username: process.env.HUAWEY_USERNAME,
            password: `#${process.env.HUAWEY_PASSWORD}`,
           });
    
          sshClient.on('ready', () => {
            let count = 0;
            pppoeFields.forEach((pppoe) => {
              sshClient.exec(`display access-user username ${pppoe}`, (err, stream) => {
                if (err) {
                  console.error(`Error checking PPPoE ${pppoe}: ${err.message}`);
                  offlinePppoes.push(pppoe);
                } else {
                  let output = '';
                  stream.on('data', (data) => {
                    output += data.toString();
                  });
                  stream.on('close', () => {
                    const regex = new RegExp(`PPPoE +${pppoe} +[A-Z]+`, 'i');
                    const isOnline = regex.test(output);
                    console.log(`PPPoE ${pppoe} is ${isOnline ? 'online' : 'offline'}`);
                    if (isOnline) {
                      onlinePppoes.push(pppoe);
                    } else {
                      offlinePppoes.push(pppoe);
                    }
                    count++;
                    if (count === pppoeFields.length) {
                      sshClient.end();
                    }
                  });
                  stream.on('error', (err) => {
                    console.error(`Error checking PPPoE ${pppoe}: ${err.message}`);
                    offlinePppoes.push(pppoe);
                    count++;
                    if (count === pppoeFields.length) {
                      sshClient.end();
                    }
                  });
                }
              });
            });
          });
        })
        .catch((error) => {
          console.error(`Error getting PPPoE data: ${error.message}`);
          res.status(500).send({ message: 'Error getting PPPoE data' });
        });
    };
    
    
    
    }

    
    
    export default PppoeDataController;