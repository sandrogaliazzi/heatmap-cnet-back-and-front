import PppoeData from "../models/pppoeModel.js";
import { Client } from 'ssh2';
import dotenv from 'dotenv';
import fs from "fs";
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
      const config = {
        host: process.env.HUAWEY_HOST,
        username: process.env.HUAWEY_USERNAME,
        password: `#${process.env.HUAWEY_PASSWORD}`,
      };
    
      const commands = ['screen-length 0 temporary', 'display access-user brief'];
    
      const conn = new Client();
      conn.on('ready', () => {
        console.log('SSH connection established');
        conn.shell((err, stream) => {
          if (err) throw err;
          let pppoeList = [];
          stream.on('close', () => {
            console.log('Stream closed');
            conn.end();
            if (pppoeList.length) {
              // save to file
                fs.writeFile('output.txt', pppoeList.join('\n'), (err) => {
                if (err) throw err;
                console.log('Output saved to file');
                res.status(200).json({ pppoes: pppoeList });
              });
            } else {
              res.status(404).json({ message: 'No PPPoE sessions found' });
            }
          }).on('data', (data) => {
            console.log(`Terminal data: ${data}`);
            let dataNew = data.toString();
            let dataLines = dataNew.split('\n');
            for (let i = 0; i < dataLines.length; i++) {
              let line = dataLines[i].trim();
              if (line.startsWith('------')) {
                continue;
              } else if (line.startsWith('No.')) {
                continue;
              } else if (line.startsWith('Total')) {
                continue;
              } else if (line) {
                let pppoeFields = line.split(/\s+/);
                let pppoeName = pppoeFields[1];
                pppoeList.push(pppoeName);
              }
            }
          });
          for (const cmd of commands) {
            stream.write(`${cmd}\n`);
          }
          stream.end();
        });
      }).connect(config);
    };
    

}    
    
    
    

    
    
    export default PppoeDataController;