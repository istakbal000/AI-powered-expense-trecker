const user=require('../database/user');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const registerUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({error:"All fields are required"});
        }
        const existingUser=await user.findOne({email});
        if(existingUser){
            return res.status(400).json({error:"User already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=new user({name,email,password:hashedPassword});
        await newUser.save();
        res.status(201).json({message:"User registered successfully"});
    }catch(error){
        res.status(500).json({error:error.message});
    }
}
const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({error:"All fields are required"});
        }
        const existingUser=await user.findOne({email});
        if(!existingUser){
            return res.status(400).json({error:"User not found"});
        }
        const isMatch=await bcrypt.compare(password,existingUser.password);
        if(!isMatch){
            return res.status(400).json({error:"Invalid credentials"});
        }
        const token=jwt.sign({id:existingUser._id},process.env.SECRET_JWT,{expiresIn:'1d'});
        return res.status(200).cookie("token",token,{httpOnly:true}).json({message:"User logged in successfully"});
    }catch(error){
        res.status(500).json({error:error.message});
    }
}
const logoutUser=async(req,res)=>{
    try{
        res.status(200).cookie("token",null,{httpOnly:true}).json({message:"User logged out successfully"});
    }catch(error){
        res.status(500).json({error:error.message});
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};
