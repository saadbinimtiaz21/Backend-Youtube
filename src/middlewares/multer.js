// how to define and use multer middleware for file uploads
import multer from "multer";

const storage = multer.diskStorage({
        destination: function(req, file, cb){
            cb(null,'./Public/Uploads')
        },
        filename: function (req, file , cb){
           cb(null , file.originalname)
        }
    });

export const upload = multer({storage,})
