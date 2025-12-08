import mongoose, {Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true    
        },
        Email:{
            type: String,
            required: true,
            unique:true,
            lowercase: true,
            trim:true 
        },
        FullName:{
            type: String,
            required: true,
            trim:true,
            index: true
        },
        Avator:{
            type: String, // using cloudnry service to get link of image
             required: true
        },
        coverImage:{
            type: String, // using cloudanary to get link of image
            
        },
        WatchHistory:[
            {
                type: Schema.Types.objectId,
                ref: "Video"
            }
        ],

        Password:{
            type: String,
            required: [true , "Password is Required"],
            lowercase: true,
            uppercase: true,
            specialcharacter: true,
            length: { min: 8, max: 15 }
        },
        RefreshToken:{
            type: String
        }
        
},
{
    timestamps: true
}
)

// here we use function with callaback instead of arrow function to use 'this' keyword
// because we are refercing to only password field of userschema to encrypt it before saving to database 
userSchema.pre("save", async function(next){
   // check if password is modified or not
    if(!this.isModified("Password")) return next();
// encrypt the password using bcryptjs is changed.
    this.Password = await bcrypt.hash(this.Password , 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(Password){
// compare the plain password with hashed password in database
   return await bcrypt.compare(Password , this.Password)
}

userSchema.methods.generateAccessToken =  function (){
     return jwt.sign(
        {
        _id: this._id, // this use mongoose to get id of user
        email: this.email,
        username: this.username,
        FullName: this.FullName   
    },
    process.env.Access_Token_Secret,
    {
        expiresIn: process.env.Access_Token_Expiry  
    }
) 
}
userSchema.methods.generateRefreshToken = function(){
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