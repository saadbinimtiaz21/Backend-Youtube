// how to define and use multer middleware for file uploads
import multer from "multer"

const Storage = multer.diskStorage(
    {
        destination : function (req, file, cb){
            cb(null,"./public/temp")
        },
        filename: function(req , file , cb){
           // this is specifically for .pnga and .jpg 
           // files you name them uniquely

            // const uniquesuffix = Date.now() + '-' + Math.round
            // (Math.random() * 1E9)
           // cb(null , file.fieldname + '-' + uniquesuffix)

           cb(null , file.originalname)

        }

    }
)

export const upload = multer({
     Storage,
    })
