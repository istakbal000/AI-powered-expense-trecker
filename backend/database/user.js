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
        required: function() {
            // Password is required only for non-Google users
            return !this.googleId;
        }
    },
    googleId:{
        type:String,
        unique:true,
        sparse:true // Allows multiple null values
    },
    authMethod:{
        type:String,
        enum: ['local', 'google'],
        default: 'local'
    },
    avatar:{
        type:String
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
    }
}, {
    timestamps: true
});
const usermodel=mongoose.model('User',userschema);
module.exports=usermodel;
