import mongoose, { Schema } from "mongoose";

const CameraSchema = new mongoose.Schema(
     {
       id: {type: String},
       clientName: {type: String, require: true},
       serialNumber: {type: String, require: true},
       filePath:{type: String, require: true},
       registerDate: {type: String, require: true}
      }
);

const cameraClient= mongoose.model('cameraClient', CameraSchema);


export default cameraClient;