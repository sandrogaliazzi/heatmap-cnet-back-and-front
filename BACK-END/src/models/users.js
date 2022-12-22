import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
     {
       id: {type: String},
       nome: {type: String, require: true}, 
       senha: {type: String, require: true}
        }
);

const user= mongoose.model('user', UserSchema);


export default user;

