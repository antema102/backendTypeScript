import mongoose from "mongoose";

const Schema=mongoose.Schema;

export const SchemaMessage =new Schema({
    send:{
      type:mongoose.Types.ObjectId,
      ref:'User'
    },
    recever:{
        type:mongoose.Types.ObjectId,
        ref:'User'
      }
    ,
    contenu:{
        type:String,
        require:true
    }
    ,
    created_Date: {
      type: Date,
      default: Date.now // Utilisation de Date.now pour définir la date par défaut
    }
})