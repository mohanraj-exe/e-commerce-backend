// To connect with your mongoDB database
const mongoose = require("mongoose");
// Connecting to database

module.exports =  async () =>{
      try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('connected to database')

      }catch(err){
        console.log({error: err})
      }
      
}