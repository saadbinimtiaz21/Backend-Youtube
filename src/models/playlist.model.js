import mongoose,{Schema} from "mongoose";
// import mongoosePaginate from "mongoose-paginate-v2";

const PlaylistSchema = new Schema({
   name:{
            type: String,
            required: true
   },
   description:{
            type:String,
            required:false
   },      
   videos:[{
            type: Schema.Types.ObjectId,
            ref: "Video"
   }],
   owner:{
            type: Schema.Types.ObjectId,
            ref: "User"
   }   

},{timestamps:true})

// PlaylistSchema.plugin(mongoosePaginate);
export const Playlist = mongoose.model("Playlist",PlaylistSchema);