import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOncloudinary } from "../utils/cloudinary.js";
import { ApiResponse} from "../utils/ApiResponse.js";
  

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
    avatar: avatar.url , // incase avatar url is not present then set default avatar
    coverImage: coverImage?.url || "", // reason for "?" because cover image is optional
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

export { registerUser };
