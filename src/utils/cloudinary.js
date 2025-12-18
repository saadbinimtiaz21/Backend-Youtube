// import {v2 as cloudinary} from "cloudinary"
// import fs from "fs"; 
// console.log("CLOUD NAME : ", process.env.CLOUDINARY_CLOUD_NAME);

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
    
// });
//  // function to upload file on cloudinary or a 
//  // blueprint how to upload file on cloudinary
// const uploadoncloudinary = async (filepath) => {
//     try {
//         if(!filepath)  return null 

//         const absolutePath = path.resolve(localFilePath);
//         console.log("Uploading file to Cloudinary:", absolutePath);

//         // upload the file on cloudinary
//         // hold it in variable called response 
//         const response = await cloudinary.uploader.upload(absolutePath,
//             {resource_type: "auto",// auto detect the type of file whether its image video or else
//             folder:"Public/Uploads" // folder name on cloudinary where files will be stored
//             })
//         // file has been upload successfully now we can remove it from local storage
//         console.log("file uploaded successfully on cloudinary", response.url) ;
//        if( fs.existsSync(absolutePath) ) fs.unlinkSync(filepath)    
//         return response ;
//     }
//     catch (error) {
//         fs.unlinkSync(filepath) // remove the file from local storage if any error occurs
//             return null;
//         }
//     }

//     export { uploadoncloudinary }


import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path"; // ✅ you need to import this

// console.log("CLOUD NAME :", process.env.CLOUDINARY_CLOUD_NAME);

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET_KEY,
// });

// Function to upload file to Cloudinary
const uploadOncloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("No file path provided");
      return null;
    }

    // Use absolute path for safety
    const absolutePath = path.resolve(localFilePath);
    console.log("Uploading file to Cloudinary:", absolutePath);

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(absolutePath, {
      resource_type: "auto",          // auto detect image/video
      folder: "Public/uploads",       // folder in Cloudinary
    });

    console.log("File uploaded successfully:", response.secure_url);

    // Remove local file after successful upload
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log("Local file deleted:", absolutePath);
    }

    return response;

  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Remove local file even if upload fails (optional)
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log("Local file deleted after error:", localFilePath);
    }

    return null;
  }
};

export { uploadOncloudinary };