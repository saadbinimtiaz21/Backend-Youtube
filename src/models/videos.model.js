import mongoose , {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        title:{
            type: String,
            required: [true , "Title is Required"]
        },
        VideoFile:{
            type: String, // using cloudnry service to get link of video
            required: [true , "Video File is Required"],            
        },
        Thumbnail:{
            type: String, // using cloudnry service to get link of video
            required: [true , "Video File is Required"], 
        },
        Description:{
            type: String,
            required: true
        },
        Duration:{
            type: Number,
            required: true
        },
         Views:{
            type: Number,
            default: 0
         },
         IsPublished:{
            type: Boolean,
            default: true
         },
         Owner:{
            type:  Schema.ObjectId,
            ref: "User"
         }
        


},
{
    timestamps: true
}
)

videoSchema.plugin(mongooseAggregatePaginate)
export const Video= mongoose.model("Video", videoSchema)
