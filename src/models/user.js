import mongoose from "mongoose";

const Schema=mongoose.Schema;

export const SchemaUser =new Schema({
    username:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    newPassword:{
        type:String,
        require:false
    }
})