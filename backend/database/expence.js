const mongoose=require('mongoose');
const userexpence=new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
      amount:{
        type:Number,
        required:true
    },  category:{
        type:String,
        required:true
    },
      currency:{
        type:String,
        default:'USD',
        enum:['USD','INR','EUR','GBP','JPY','AUD','CAD','SGD','AED','CNY']
    },
      done:{
        type:Boolean,
        default:false
    },
      userid:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
},
   { timestamps:true });
const userexpencemodel=mongoose.model('expence',userexpence);
module.exports=userexpencemodel;
