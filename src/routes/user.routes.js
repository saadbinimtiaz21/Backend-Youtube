import {Router} from "express";
import { loginuser, logoutuser, registerUser ,refreshAccessToken } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

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
    
router.route("/login").post(
    loginuser)

// Secured routes
router.route("/logout").post(
    verifyJWT, 
    logoutuser)
router.route("/refresh-token").post(refreshAccessToken)
    
export default router