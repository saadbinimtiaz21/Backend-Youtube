import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";


export const verifyJWT = asyncHandler(async (req, res ,next)=>{
try {
    const token = 
        req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer", "")
    
        if(!token){
            throw new ApiError(401 , "Unauthorized request")
        }
    
        const decodeinfo= jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    
          const user =  await User.findById(decodeinfo?._id)
            .select("-Password -RefreshToken")
        if(!user){
            throw new ApiError(401 , "Invalid Acces Token")
        }
    
        req.user = user;
        next()
} catch (error) {
   throw new ApiError(401 , error?.message || "Invalid Access Token") 
}

})


// create new middleware(self/own) for Logging out user
// reason to create is to reuse the code as we can do that in user.controller.js file
// if we have to check only for once than there is no need to create this file