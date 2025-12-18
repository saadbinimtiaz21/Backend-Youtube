import {Router} from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.js"

const router =  Router()

// here we define the route for user registration
// when a post request is made to /register endpoint
// the RegisterUser controller function is called to handle the request
// and send back the appropriate response
router.route("/register").post(
    // use middleware to handle file
    upload.fields([
       {
        name: "avatar",
        maxCount: 1

       },{
        name: "coverImage",
        maxCount: 1
       } 
    ]),
    registerUser)
    
export default router