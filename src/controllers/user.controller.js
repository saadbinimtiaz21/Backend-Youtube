import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOncloudinary } from "../utils/cloudinary.js";
import { ApiResponse} from "../utils/ApiResponse.js";
import { ref } from "process";
  

const generateAccessandrefreshToken = async (userID) => {
  try {
    const user= await User.findOne(userID)
   const AccessToken = user.generateAccessToken();
   const RefreshToken =  user.generateRefreshToken();
      // save in mongo db refresh token for user
   user.RefreshToken = RefreshToken;
  await user.save({validateBeforeSave: false});
  
  return {AccessToken , RefreshToken};
  
  //  console.log("Generating tokens for userID:", userID);
  } 
  catch (error) {
    throw new ApiError(500, "Error in generating token")
  }
}


        //  logic building of Controllers

//  1- get user details from frontend
//  2- validation of user details-not empty
//  3- check if user already exists: username ,email
//  4- check if user already exists
//  5- check for images  ,check for avatar
//  6- uplaod them to cloudinary
//  7- create an object for user and enter in db
//  8- remove password and refresh token field from response
//  9- check for user creation
//  10-Return if user creates 

                //  1- get user details from frontend
// Response for user registration sending ok message
// steps to implement user registration
const registerUser = asyncHandler(async (req, res) => {
  const { FullName, Email, username, Password } = req.body
//   console.log("Email : ", Email); for testing purpose
  console.log("REQ.FILES =>", req.files);
  
                    // 2- validations check
    
  // we may individual use if username to check for empty fields
  // but here we are using array some method to check for any empty field
                  
  if (
    [FullName, Email, username, Password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are Required ");
  }
                //3- check if user already exists
  const exiesteduser = await User.findOne({
    $or: [{ username }, { Email }],
  });   

  if (exiesteduser) {
    throw new ApiError(409, " User Already Exists");
  }

          //4- how to retrieve files from req object from multer middleware
const avatarlocalpath = req.files ?. avatar[0] ?. path;
const coverImagelocalpath = req.files ?. coverImage ?. [0] ?. path;
  
console.log("Avatar path : ", avatarlocalpath);
console.log("CoverImage path : ", coverImagelocalpath)
  // check if avatar file is present
  if (!avatarlocalpath) {
    throw new ApiError(400, "avatar File is required");
  }
                //5- upload files to cloudinary
  const avatar = await uploadOncloudinary(avatarlocalpath);
  const coverImage = await uploadOncloudinary(coverImagelocalpath);
  
  if(!avatar)
    {
    // before entering into cloudinary if any error occurs we have to remove the local file
    throw new ApiError(400, "Error in uploading avatar Image");
  }

                //6- create user object and enter into database 
const user = await User.create({
    FullName,
    avatar: avatar.secure_url , // incase avatar url is not present then set default avatar
    coverImage: coverImage?.secure_url || "", // reason for "?" because cover image is optional
    Email,
    Password,
    username 
})
                //7- remove password and refresh token from response
// extra call to database to get user details without password and refresh token
const createduser = await User.findById(user._id).select(
    "-Password -RefreshToken"
)
                //8- check for user creation
 if(!createduser){
    throw new ApiError(500 , "Something Went Wrong in Creating User")
 }
                    //  10-Return if user creates 
   return res.status(201).json(
        new ApiResponse(200 , createduser, "User Registered Successfully")
    )
});

                // Login User Controller

const loginuser = asyncHandler(async(req, res)=>{
  const {Email  , username , Password} = req.body
        // 2- validations check
  if(!Email || !username){
   throw new ApiError (400 , "Email or Username is required")
  }
             // 3- check if user exists    
  const user=await User.findOne({
    $or:[{username} , {Email} ]
  })

  if(!user){
    throw new ApiError(404, "User or Email not found!!")
  }
            // 4- check for password validation
  const isPasswordvalid =await user.isPasswordCorrect(Password)

  if(!isPasswordvalid){
    throw new ApiError(401, "Invalid Passwords")
  }
      //  5- generate access token and refresh token
 const {AccessToken , RefreshToken} =await generateAccessandrefreshToken(user._id)

 // 6- remove password and refresh token from response(optional)
 const loggedinuser = await User.findById(user._id).select
 ("-Password -RefreshToken")
        
        //7- how to use cookies adn where to use them
 const options = {
    httponly: true, // only modified on server side {using both}
    secure: true, // only modified on frontend 
 }
// single code break statement for my ease
 return res.status(200).cookie
 ("AccessToken", AccessToken , options)
 .cookie("RefreshToken",RefreshToken, options)
 .json(new ApiResponse(200,
    {
      // best practie to include only for user to save it into local storage otherwise there is no need.
      user: loggedinuser, AccessToken, RefreshToken 
    },
    "User logged in Successfully"
  )
)

});
      // logout User
  const logoutuser = asyncHandler(async(req , res) => {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          RefreshToken: undefined
        } 
      },
      {
          new: true
        }
    )

    const options = {
      httponly: true, 
      secure: true
    }
    return res
    .status(200)
    .clearCookie("AccessToken" , AccessToken)
    .clearCookie("RefreshToken" , RefreshToken)
    .json(new ApiResponse(200 , {} , "User Logged Out "))
  })  

export { registerUser,
  loginuser,
  logoutuser
 };
