import mongoose , { Schema, SchemaType} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const CommentSchema = new Schema({
            content:{
              type : String,
              required: true          
            },
            video:{
               type: Schema.Types.ObjectId ,
               ref: "Video"         
            },
            owner:{
            type: Schema.Types.ObjectId ,
            ref: "User"
            }
},{
            timestamps:true
})
CommentSchema.plugin(mongoosePaginate);
export const Comment = mongoose.model("Comment",CommentSchema);