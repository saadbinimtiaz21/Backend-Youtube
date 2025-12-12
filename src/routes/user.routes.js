import {Router} from "express";
import { registerUser } from "../controllers/user.controller.js";

const router =  Router()

// here we define the route for user registration
// when a post request is made to /register endpoint
// the RegisterUser controller function is called to handle the request
// and send back the appropriate response
router.route("/register").post(registerUser)
    
export default router