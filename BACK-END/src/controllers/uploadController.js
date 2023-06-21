import fs from 'fs';
import path from "path";
import cameraClient from '../models/cameraModel.js';

class UploadController {
  static uploadImg = async (req, res) => {
    const { clientCameraName, serialNumber } = req.body;
    const { originalname, path } = req.file;
    const fileExtension = originalname.split('.').pop();
    const newFileName = `${clientCameraName}-${serialNumber}.${fileExtension}`;
    const newPath = `/./CAMERAS/uploads/${newFileName}`;
    let now = new Date().toLocaleString("PT-br");
    let registerDate = now;
    let filePath = newPath;
    let cameraData = {clientCameraName, serialNumber, registerDate, filePath}

    
    
    try {
      await fs.promises.rename(path, newPath);
      let cameraClientNew = new cameraClient(cameraData)
      cameraClientNew.save((err) =>{
        if(err) {
            console.log({message: `${err.message} - falha ao cadastrar camera cliente.`})
        } else{
            console.log({message: `tudo certo ao cadastrar camera do cliente.`})
        }
    }) 

      console.log(`CAMERA DO CLIENTE: ${clientCameraName} cadastrada com sucesso.`)
      res.status(200).send({message: 'Upload completed'});
    } catch (err) {
      console.error(err);
      res.status(500).send({message:'Failed to rename the file.'});
    }
  };

  

static sendImg = (req, res) => {
    const id = req.params.id;
    console.log("chegou na função de enviar");
    cameraClient.findById(id, (err, camera) => {
        if (!err && camera) {
            const filePath = camera.filePath;
            const absolutePath = path.resolve(filePath);
            res.sendFile(absolutePath);
        } else {
            console.error(err);
            res.status(500).send('Failed to retrieve the image.');
        }
    });
}

static getCamerasimgs = (req, res) => {
    cameraClient.find((err, cameraClient)=>{
        res.status(200).send(cameraClient)
    }).sort({_id: -1})
}


}

export default UploadController;
