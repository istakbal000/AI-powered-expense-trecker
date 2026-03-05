const mongoose=require('mongoose');
const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profile:{
        currency:{
            type:String,
            default: 'USD'
        },
        timezone:{
            type:String,
            default: 'UTC'
        }
    },
    preferences:{
        budgetAlerts:{
            type:Boolean,
            default: true
        },
        weeklyReports:{
            type:Boolean,
            default: true
        },
        aiInsights:{
            type:Boolean,
            default: true
        }
    }
}, {
    timestamps: true
});
const usermodel=mongoose.model('User',userschema);
module.exports=usermodel;
