import mongoose, { Schema } from "mongoose";

const equipamentClientSchema = new mongoose.Schema(
     {
       id: {type: String},
       name: {type: String, require: true}, 
       ip: {type: String, require: true}
      }
);

const equipament= mongoose.model('equipament', equipamentClientSchema);


export default equipament;