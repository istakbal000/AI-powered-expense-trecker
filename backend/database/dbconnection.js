const mongoose =require('mongoose');
const dbconnection=async()=>{
    try{
        await mongoose.connect('mongodb://localhost:27017/expensetracker');
        console.log('Database connected successfully');
    }
    catch(error){
        console.error('Database connection failed:',error);
    }
}
module.exports=dbconnection;