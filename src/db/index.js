 import mongoose from "mongoose"
import { saad_DB } from "../constants.js"

const connect_DB = async () => {
    try{
        // we may use by initializing a variable or without that no problem
      const connectionInstance =  await mongoose.connect(`${process.env.MONGO_URI}/${saad_DB}`)
    console.log(`MONGODB connected !! DB HOST: ${connectionInstance.connection.host}`)
    }
    catch(error){
        console.log("MONGODB connection Failed !! Here might be issue ",error)
        // process refer to current node process
        process.exit(1)

    }
}
export default connect_DB;