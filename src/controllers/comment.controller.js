import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {commment} from "../models/comment.model.js";
import mongoose from "mongoose";

const getVideoComments  = asyncHandler (async (req , res) => {
            const {videoId} = req.params
            const {page= 1 , limit = 10} = req.query

            const video = await video.findbyID(videoId);

            if(!video){
                        throw new ApiError(404,"video not found")
            }

const commentsAggregate = Comment.aggregate([
            {
             $match:{
           video: new mongoose.Types.ObjectId(videoId)
            }
            },
            {
                       $lookup:{
                        from:"users",
                        localField:"owner",
                         foreignField:"_id",
                         as:"owner",
                        }
                        },
                        {
            $addFields:{
                        likesCount:{
                        $size:"$likes"
                        },
                        owner:{
                        $first:"$owner",
                        },
                        isliked:{
                         $cond:{
                        $if:{$in:[req.user?._id,"likes.likedBy"]},
                        then: true,
                        else:false
                        }
            }
}
            },
            {
                        $sort:{
                                    createdAt: -1
                        }
            },
            {
                        $project:{
                                    content: 1,
                                    createdAt:1,
                                    likesCount:1,
                                    owner:{
                                                username:1,
                                                fullname:1,
                                                "avatar.url":1
                                    },
                                    isliked:1

                        }
            }
            ]);
            const options={
                        page: parseInt(page, 10),
                        limit: parseInt(page, 10)
            };
            
            const comments = await comments.aggregatePaginate(
                        commentsAggregate,
                        options
            );
            return res 
            .status(200)
            .json(new ApiResponse(200, comments,"comments fetched succesfully"))

});

const addComment = asyncHandler(async (req , res) => {
            const {videoId} = req.params;
            const {content} = req.body;

            if(!content){
                        throw new ApiError(400,"content is required")
            }

            const video = await video.findbyID(videoId);
            if(!video){
                        throw new ApiError(404,"Video not found")
            }

            const comment = await comment.create({
                        content,
                        video: videoId,
                        owner: req.user?._id
            });

            if(!comment){
                        throw new ApiError(500,"Failed to fetched")
            }

            return res
            .status(201)
            .json(new ApiResponse(201 , comment,"Fetched Succesfully"))

});


const updateComment = asyncHandler (async (req , res) => {
            const {commentId} = req.params;
            const content = req.body;

            if(!content){
                        throw new ApiError(400,"content is required")
            }

            const comment =  await Comment.findbyID(commentId);

            if(!comment){
                        throw new ApiError(404 , "comment not found")
            }

            if(comment?.owner.toSring() !== req.user?._id.toSring()){
                        throw new ApiError(400,"not previlged to edit owner comment")
            }

            const updatecommment =await Comment.findbyIDandUpdate(
                        comment?._id,
                        {
                                    $set:{
                                                content
                                    }
                        },
                        {new:true}
            );
            if(!updateComment){
                        throw new ApiError(500 , "failed to fetched comment")
            }
            return res
            .status(200)
            .json(new ApiResponse(200, updateComment , "fetched Successfully"))

});

const deleteComment = asyncHandler (async (req , res) => {
            const {commentId} = req.params;

            const comment = await Comment.findbyID();

            if(!comment){
                        throw new ApiError(404 , "Comment not found")
            }

            if(comment?.owner.toSring() !== req.user?.toSring()){
                        throw new ApiError(400, "you cant have previlged to delete owner comment")
            }

            await Comment.findbyIDandUpdate(commentId);

            await like.deleteMany({
                        comment: commentId,
                        likedBy: req.user
            });
            return res
            .status(200)
            .json(new ApiResponse(200 , {commentId} , "comment deleted Successfully"))

});

export {
addComment,
getVideoComments,         
deleteComment,
updateComment
}