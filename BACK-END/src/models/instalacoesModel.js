import mongoose, { Schema } from "mongoose";

const instalacoesFormSchema = new mongoose.Schema(
     {
       id: {type: String},
       name_client: {type: String, require: true},
       cto: {type: Object, require: true},
       sinal: {type: Object, require: true},
       mac_onu: {type: String, require: true},
       tecnico: {type: String, require: true}, 
       date_time: {type: String, require: true}
      }
);

const instalacoesForm= mongoose.model('instalacoesForm', instalacoesFormSchema);


export default instalacoesForm;