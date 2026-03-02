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

const googleAuth=async(req,res)=>{
    try{
        const {code}=req.body;
        
        if(!code){
            return res.status(400).json({error:"Authorization code is required"});
        }

        // Exchange authorization code for tokens
        const {OAuth2Client}=require('google-auth-library');
        const googleClient=new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'http://localhost:5173/auth/callback'
        );

        const {tokens}=await googleClient.getToken(code);
        
        // Verify ID token and get user info
        const ticket=await googleClient.verifyIdToken({
            idToken:tokens.id_token,
            audience:process.env.GOOGLE_CLIENT_ID
        });
        
        const payload=ticket.getPayload();

        // Check if user exists
        let existingUser=await user.findOne({email:payload.email});
        
        if(existingUser){
            // User exists, check if they have Google ID
            if(existingUser.googleId && existingUser.googleId !== payload.sub){
                return res.status(400).json({error:"Account already linked to different Google account"});
            }
            
            // Update Google ID if not present
            if(!existingUser.googleId){
                existingUser.googleId=payload.sub;
                existingUser.avatar=payload.picture;
                await existingUser.save();
            }
        }else{
            // Create new user with Google auth
            const newUser=new user({
                name:payload.name,
                email:payload.email,
                googleId:payload.sub,
                password:'', // No password for Google users
                authMethod:'google',
                avatar:payload.picture
            });
            await newUser.save();
            existingUser=newUser;
        }

        const token=jwt.sign({id:existingUser._id},process.env.SECRET_JWT,{expiresIn:'1d'});
        return res.status(200).cookie("token",token,{httpOnly:true}).json({message:"Google authentication successful",user:existingUser});

    }catch(error){
        console.error('Google auth error:',error);
        res.status(500).json({error:"Google authentication failed: "+error.message});
    }
}

const updateProfile=async(req,res)=>{
    try{
        const userId=req.user.id;
        const {name,email,currency,timezone,notifications,weeklyReports,aiInsights}=req.body;

        const updateData={
            name,
            email,
            profile:{
                currency:currency || 'USD',
                timezone:timezone || 'UTC'
            },
            preferences:{
                budgetAlerts:notifications,
                weeklyReports,
                aiInsights
            }
        };

        const updatedUser=await user.findByIdAndUpdate(userId,updateData,{new:true});
        res.status(200).json({message:"Profile updated successfully",user:updatedUser});
    }catch(error){
        res.status(500).json({error:error.message});
    }
}

const updatePassword=async(req,res)=>{
    try{
        const userId=req.user.id;
        const {currentPassword,newPassword}=req.body;

        const existingUser=await user.findById(userId);
        if(!existingUser){
            return res.status(404).json({error:"User not found"});
        }

        const isMatch=await bcrypt.compare(currentPassword,existingUser.password);
        if(!isMatch){
            return res.status(400).json({error:"Current password is incorrect"});
        }

        const hashedPassword=await bcrypt.hash(newPassword,10);
        await user.findByIdAndUpdate(userId,{password:hashedPassword});

        res.status(200).json({message:"Password updated successfully"});
    }catch(error){
        res.status(500).json({error:error.message});
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    googleAuth,
    updateProfile,
    updatePassword
};
