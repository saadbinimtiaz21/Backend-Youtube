import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { UploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse} from "../utils/ApiResponse.js";
        //  logic building of Controllers

//  1- get user details from frontend
//  2- validation of user details-not empty
//  3- check if user already exists: username ,email
//  4- check if user already exists
//  5- check for images  ,check for avator
//  6- uplaod them to cloudinary
//  7- create an object for user and enter in db
//  8- remove password and refresh token field from response
//  9- check for user creation
//  10-Return if user creates 

                //  1- get user details from frontend
// Response for user registration sending ok message
// steps to implement user registration
const registerUser = asyncHandler(async (req, res) => {
  const { FullName, Email, username, Password } = req.body;
  console.log("Email : ", Email);
  // we may individual use if username to check for empty fields
  // but here we are using array some method to check for any empty field
  
  
                    // 2- validations check
  if (
    [FullName, Email, username, Password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are Required");
  }
                //3- check if user already exists
  const exiesteduser = User.findOne({
    $or: [{ username }, { Email }],
  });

  if (exiesteduser) {
    throw new ApiError(409, " User Already Exists");
  }

            //4- how to retrieve files from req object from multer middleware
  const avatorLocalPath = req.files?.Avator[0]?.path; // ?. means optional chaining
  const CoverimageLocalPath = req.files?.coverImage[0]?.path;
  // check if avator file is present
  if (!avatorLocalPath) {
    throw new ApiError(400, "Avator File is required");
  }
                //5- upload files to cloudinary
  const avator = await UploadOnCloudinary(avatorLocalPath);
  const CoverImage = await UploadOnCloudinary(CoverimageLocalPath);
  if(!avator){
    // before entering into cloudinary if any error occurs we have to remove the local file
    throw new ApiError(400 , "Error in uploading Avator Image")
  }

                //6- create user object and enter into database 
const user = await User.create({
    FullName,
    Avator: avator.url,
    coverImage: CoverImage?.url || "", // reason for "?" because cover image is optional
    Email,
    Password,
    username: username.toLowerCase(),
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
        new ApiResponse(200 , createduser, "User REgistered Successfully")
    )

});

export { registerUser };
