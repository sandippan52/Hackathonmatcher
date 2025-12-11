import mongoose from "mongoose";

const CoderDataSchema = mongoose.Schema({
    username : {type: String, required: true, unique: true},
    email : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    skills :  {type : String },
    college : {type : String},
    course :{type: String},
    year : {type : Number}
})
export const Coder = mongoose.model("Coder", CoderDataSchema) 