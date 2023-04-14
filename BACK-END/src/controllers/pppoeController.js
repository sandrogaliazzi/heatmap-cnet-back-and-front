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
    
    
    static findAllPppoeOnline = () => {
      return new Promise((resolve, reject) => {
        // Connect to SSH server
        const sshClient = new Client();
        sshClient.on('error', (err) => {
          console.error(`SSH error: ${err.message}`);
          reject(err);
        });
        sshClient.on('ready', () => {
          console.log(`Connected to SSH server at ${process.env.HUAWEI_HOST}`);
    
          // Retrieve list of PPPoE sessions that are currently online
          sshClient.exec('display access-user all', (err, stream) => {
            if (err) {
              console.error(`Error retrieving PPPoE data: ${err.message}`);
              reject(err);
            } else {
              let pppoeList = '';
              stream.on('data', (data) => {
                pppoeList += data;
              });
              stream.on('end', () => {
                // Parse PPPoE data and filter online sessions
                const onlinePppoes = pppoeList
                  .trim()
                  .split(/\n+/)
                  .slice(2)
                  .filter((line) => line.includes('PPPoE'))
                  .filter((line) => line.includes('online'))
                  .map((line) => line.split(/\s+/)[2]);
    
                // Format online PPPoE sessions as JSON response
                const responseJson = {
                  onlinePppoes,
                  count: onlinePppoes.length,
                };
    
                // Close SSH connection and return response
                sshClient.end();
                console.log(`Retrieved online PPPoE sessions: ${onlinePppoes}`);
                console.log(JSON.stringify(responseJson, null, 2));
                resolve(responseJson);
              });
            }
          });
        });
    
        sshClient.connect({
          host: process.env.HUAWEY_HOST,
          username: process.env.HUAWEY_USERNAME,
          password: `#${process.env.HUAWEY_PASSWORD}`,
         });
      });
    };
    
    
    
    }

    
    
    export default PppoeDataController;