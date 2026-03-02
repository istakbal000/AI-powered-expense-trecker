const mongoose =require('mongoose');
const dbconnection=async()=>{
    try{
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Istakbal:<db_password>@cluster0.8qevpcz.mongodb.net/?appName=Cluster0';
        await mongoose.connect(mongoURI);
        console.log('Database connected successfully');
    }
    catch(error){
        console.error('Database connection failed:',error);
    }
}
module.exports=dbconnection;