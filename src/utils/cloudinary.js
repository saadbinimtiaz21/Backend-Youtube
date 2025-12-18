import {v2 as cloudinary} from "cloudinary";
import fs from "fs"; // fs is filesystem module and handling remove delete etc
console.log("CLOUD NAME : ", process.env.CLOUDINARY_CLOUD_NAME);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
    
});
 // function to upload file on cloudinary or a 
 // blueprint how to upload file on cloudinary
const uploadoncloudinary = async (filepath) =>
    {
    try {
        if(!filepath) 
            return null 
        // upload the file on cloudinary
        // hold it in variable called response 
        const response = await cloudinary.uploader.upload(filepath , 
            {resource_type: "auto" // auto detect the type of file whether its image video or else
            })
        // file has been upload successfully now we can remove it from local storage
        console.log("file uploaded successfully on cloudinary", response.url) ;
        fs.unlinkSync(filepath)    
        return response ;
    }
    catch (error) {
        fs.unlinkSync(filepath) // remove the file from local storage if any error occurs
            return null;
        }
    }

    export { uploadoncloudinary }