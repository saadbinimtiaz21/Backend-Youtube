import {asyncHandler} from '../utils/asyncHandler.js';

// Response for user registration sending ok message

// steps to implement user registration
const registerUser = asyncHandler ( async (req, res) => {
    return res.status(200).json(
        {
        success: true,
        message: "User registration successful"
    }
)
            //  logic building
    //get user details from frontend
    // validation of user details-not empty
    //check if user already exists: username ,email
    // check if user already exists
    // check for images  ,check for avator 
    // uplaod them to cloudinary
    // create an object for user - create entry in db 
    // remove password and refersh token field from response
    //check for user creation 
    // if create return

})

export {registerUser ,};