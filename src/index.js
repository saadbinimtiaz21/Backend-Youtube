import dotenv from "dotenv";
import connect_DB from "./db/index.js";

dotenv.config({
   path: "./.env"
});

connect_DB()
.then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`server is running on port : ${process.env.PORT}`)
    } )
})
.catch((error)=>{
    console.log("MONGODB connection  Failed !!",error)
})  



// 1st approch to connect db and start server
// professional and better approach but to uch polluted the index.js file
/*
import express from "express";
const app = express();
// better approch to initilize the db connection
(async() =>{
    try {
      await mongoose.connect(`${process.env.MONGO_URI}/${saad_DB}`); 
      app.on("error",(error)=>{
        console.log("ERROR IN CONNECTION :" ,error); 
        throw error;    
      })

      app.listen(process.env.PORT,()=>{
        console.log(`SERVER IS RUNNING ON PORT ${process.env.PORT}`);
      })
    } catch (error) {
       console.error("ERROR:", error);
       throw error;     
    }
})()
*/


// DB Connection this method is ok
// function coneectdb(){}
// connectdb();