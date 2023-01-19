import mongoose, { Schema } from "mongoose";

const TrackingSchema = new mongoose.Schema(
     {
       id: {type: String},
       name: {type: String, require: true, unique: true}, 
       lat: {type: String },
       lng: {type: String }
      }
);

const tracking = mongoose.model('tracking', TrackingSchema);


export default tracking;