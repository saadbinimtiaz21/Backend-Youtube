import mongoose,{Schema}  from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        title:{
            type: String,
            required: [true , "Title is Required"]
        },
        videoFile:{
            type: String, // using cloudnry service to get link of video
            required: [true , "Video File is Required"],            
        },
        thumbnail:{
            type: String, // using cloudnry service to get link of video
            required: [true , "Thumbnail is Required"], 
        },
        description:{
            type: String,
            required: true
        },
        duration:{
            type: Number,
            required: true
        },
         views:{
            type: Number,
            default: 0
         },
         isPublished:{
            type: Boolean,
            default: true
         },
         owner:{
            type: Schema.Types.ObjectId,
            ref: "User"
         }
        


},
{
    timestamps: true
}
)

videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video", videoSchema)
