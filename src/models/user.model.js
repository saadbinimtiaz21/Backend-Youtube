import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,    
        },
        Email:{
            type: String,
            required: true,
            unique:true,
            lowercase: true,
            trim:true, 
        },
        FullName:{
            type: String,
            required: true,
            trim:true,
            index: true,
        },
        avatar:{
            type: String, // using cloudnry service to get link of image
             required: true,
        },
        coverImage:{
            type: String, // using cloudanary to get link of image
            
        },
        WatchHistory:[
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            }
        ],

        Password:{
            type: String,
            required: [true , "Password is Required"],
            // Keep password case and characters as provided — do not transform.
            // Validation (length/special chars) can be handled at the application layer.
        },
        refreshToken:{
            type: String ,
        }       
},
{
    timestamps: true
}
)

// here we use function with callaback instead of arrow function to use 'this' keyword
// because we are refercing to only password field of userschema to encrypt it before saving to database 
userSchema.pre("save", async function (next) {
   // check if password is modified or not
    if(!this.isModified("password")) 
         return next();
// encrypt the password using bcryptjs is changed.
    this.Password = await bcrypt.hash(this.Password , 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(Password){
// compare the plain password with hashed password in database
   return await bcrypt.compare(Password , this.Password)
}

userSchema.methods.generateAccessToken = function (){
     return jwt.sign(
        {
        _id: this._id, // this use mongoose to get id of user
        Email: this.Email,
        username: this.username,
        FullName: this.FullName   
    },
    process.env.Access_Token_Secret,
    {
        expiresIn: process.env.Access_Token_Expiry  
    }
) 
}
userSchema.methods.generaterefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id

        },
        process.env.Refresh_Token_Secret,
        {
            expiresIn: process.env.Refresh_Token_Expiry
        }
    )
}
// ACCESS TOKEN AND REFRESH ROKEN SECRET WILL BE SELF STUDIES LATER.
export const User = mongoose.model("User", userSchema)