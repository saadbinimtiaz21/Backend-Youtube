import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {uploadOncloudinary} from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Video} from "../models/video.model.js";
import {User} from "../models/user.model.js";
import mongoose , {isValidObjectId} from "mongoose";
import { getWatchHistory } from "./user.controller.js";

const getAllVideo = asyncHandler (async (req , res) => {
const {page= 1 , limit = 10 , query, sortBy ,sortType, userId}= req.query  
 // console.log(userId)
                      // aggregation pipeline for search videos   
const pipeline = [];
if(query){
    pipeline.push({
       $search:{
            index: "videoSearchIndex",
            text:
            {
            query,
            path:["title" , "description"]
            }
       }     
            })
}
const matchstage = {
            isPublished: true
}

if(userId){
if(!isValidObjectId(userId)){
            throw new ApiError(400, "Invalid User Id")
}
matchstage.owner = new mongoose.Types.ObjectId(userId)
}
pipeline.push({
            $match: matchstage
})
                        // sorting stage
/*
logic is that if sortBy and sortType are provided then we will sort based
 on that
otherwise we will sort based on createdAt field in descending order
we can sort based on any field like title , duration etc 
and sortType can be ascending or descending
purpose of sorting is to sort the videos based on the user preference
and to optimize the search results for better user experience and lazy loading of videos
*/
// whitlist the sort so that user cannot sort based on any field and can only sort based on the allowed fields
const allowedSortFields = ["createdAt", "views", "likesCount"];

const sortField = allowedSortFields.includes(sortBy)
  ? sortBy
  : "createdAt";
const sortOrder = sortType === "asc" ? 1 : -1;

pipeline.push({
  $sort: { [sortField]: sortOrder }
});
pipeline.push({
            $lookup:{
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "ownerdetails",
            pipeline:[{
                        $project:{
                        username: 1,
                        avatar: "$avatar.secure_url"
                        }
            }]
            }    
},
{$unwind: "$ownerdetails"})

const videoAggregate = Video.aggregate(pipeline)

const options = {
            page: parseInt(page , 10),
            limit: parseInt(limit , 10)
}

const video =  await Video.aggregatePaginate(videoAggregate , options);
return res.status(200)
.json(new ApiResponse(200, video, "Videos Fetched Successfully"));  

});

const publishVideo = asyncHandler (async (req , res) => {
const {title , description} = req.body
if(!title || !description)
{
throw new ApiError(400 , "Fields Are Required")
}

const existingVideo = await Video.findOne({
            $or : [
                        {title : title},
                        {description : description}
            ]
})
if (existingVideo){
            throw new ApiError(409 , "Video with same title or description already exists")
}


const videofilelocalpath = req.files?.videofile[0]?.path;
const thumbnailpath =  req.files?.thumbnail?.[0]?.path;

console.log("VideoFiles Path : ", videofilelocalpath)
console.log("thumbnail Path : ", thumbnailpath)

if(!videofilelocalpath || !thumbnailpath){
            throw new ApiError(401, "video file is required")
}

const videofile  =await uploadOncloudinary(videofilelocalpath)
const thumbnail = await uploadOncloudinary(thumbnailpath)
if(!(videofile || thumbnail)){
            throw new ApiError(400 , "Error in uploading Video")
}

const Video = await Video.create({
            title,
            description,
            duration : videofile.duration,
            videofileurl: {
            secure_url: videofile.secure_url,
            public_id: videofile.public_id
},
            thumbnail: {
            secure_url: thumbnail.secure_url,
            public_id: thumbnail.public_id
            },
            owner: req.user._id,
            status: "processing",
            isPublished: false,
 
})

const createdVideo = await Video.populate("owner" , "name email")

if(!createdVideo){
            throw new ApiError(500 , "Something went wrong while creating video")
}
            return res.status(201)
            .json(new ApiResponse(201, createdVideo , "video created successfully"))
});


const getVideobyid = asyncHandler (async (req , res) => {
            const {videoId} = req.params
if(!isValidObjectId(videoId)){
            throw new ApiError(400 , "Invalid Video Id")
}
if(!isValidObjectId(req.user._id)){
            throw new ApiError(400 , "Invalid User Id")
}
const video = await Video.aggregate([
            {
                        $match:{
                                    _id: new mongoose.Types.ObjectId(videoId)
                        }
            },
            {
                        $lookup:{
                                    from: "users",
                                    localfield: "_id",
                                    foreignField:"video",
                                    as: "likes "
                        }
            },
            {
              $lookup:{
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline:[
                  {
                    $lookup:{
                      from: "subscription",
                      localField: "_id",
                      foreignField: "channel",
                      as: "subscribers"
                    }
                  },
                  {
                    $addFields:{
                      subscribercount:{
                        $size: "$subscribers"
                      },
                      isSubscribed:{
                        $cond:{
                          if:{
                            $in:[
                              req.user?._id,
                              "$subscribers.subscribe"
                            ]
                          },
                          then: true,
                          else: false
                        }

                      }
                    }
                  },
                  {
                    $project:{
                      username: 1,
                      "avatar.url": 1,
                      subscribercount:1,
                      isSubscribed:1
                    }
                  }
                ]
              }
            },
            {
              $addFields:{
                likesCount:{
                  $size: "$likes"
                },
                owner:{
                  $first:  "$owner"
                },
                $isliked:{
                  $cond:{
                    if:{$in:[req.user ?._id,"$likes.likedBy"]},
                    then: true,
                    else: false
                  }
                }
              }

            },
            {
              $projects:{
                "videoFile.url":1,
                title:1,
                description:1,
                views:1,
                createdat:1,
                duration:1,
                comments:1,
                owner:1,
                isliked:1,
                likesCount: 1

              }
            }
]);

if(!video){
  throw new ApiError(500,"failed to fetch video")
  
}
// after video fetched success get the views and increment 
await video.findbyIDandupdate(videoId,{
  $inc:{
    views:1
  }
}),
// add the video to user watch history   
await video.findbyIDandupdate(req.user?._id,{
  $addtoset:{
    WatchHistory: videoId
  }
});

return res.status (200)
.json (new ApiResponse(200, video[0] , "Video Fetched Successfully"))
});

const updateVideo = asyncHandler (async (req , res) => {
            const {videoId} = req.params
            const { title , description } = req.body

            if(!isValidObjectId(videoId)){
              throw new ApiError(400,"Invalid video Id")
            }

            if(!(title && description)){
              throw new ApiError(400,"Title and description is required")
            }

            const video = await Video.findbyID(videoId);
            
            if(!video){
              throw new ApiError(400,"Video not found")
            }

            if(video?.owner.toString() !== req.user?._id.toString()){
              throw new ApiError(400,"your are not previlged to edit as your are not owner")

            }

            // delete previous and replaced with new one thumbnail
            const thumbnailtoDelete = video.thumbnail.public_id;

            const thumbnaillocalpath = req.file?.path;

            if(!thumbnaillocalpath){
              throw new ApiError(400, "thumbnail is required")
            }

            const thumbnail = await uploadOncloudinary(thumbnaillocalpath);

            if(!thumbnail){
              throw new ApiError(400 , "thumbnail not found")
            }

            const updatedvideo = await video.findbyIDandupdate(
              videoId,
              {
                $set:{
                  title,
                  description,
                  thumbnail: {
                    public_id:thumbnail.public_id,
                    URL:thumbnail.url
                  }
                }

              },
              {new : true}
            );

            if(!updatedvideo){
              throw new ApiError(500,"failed to update try again");
              
            }

            if(updatedvideo){
              await  deleteOnCloudinary(thumbnailtoDelete); 
            }

            return res
            .status(200)
            .json(new ApiResponse(200, updatedvideo, "video Updated successfully"))


});

const deleteVideo = asyncHandler (async (req , res) => {
             const {videoId} = req.params

             if(!isValidObjectId(videoId)){
              throw new ApiError(400 , "invalid videoID");
             }

             const video = await Video.findbyID(videoId);

             if(!video){
              throw new ApiError(404, "video not found")
             }

             if(video?.owner.toString() !== req.user ?._id.toString()){
              throw new ApiError(400 ,"You are pervileged to delete video as you are not owner")

             }

             const videoDeleted = await video.findbyIDandupdate(video?._id);
             
             if(!videoDeleted){
              throw new ApiError(400 , "Failed to delete")
             }

             await deleteOnCloudinary(video.thumbnail.public_id);
             await deleteOnCloudinary(video.videofile.public_id ,"video")

             // option video likes 
             await like.deleteMany({
              video: videoId,
             })

             await Comment.deleteMany({
              video: videoId
             })

             return res
             .status(200)
             .json(new ApiResponse(200 , {} , "video Deleted successfully"))

});

const togglepublishStatus = asyncHandler (async (req , res) => {
             const {videoId} = req.params

             if(!isValidObjectId(videoId)){
              throw new ApiError(400 , "invalid Video ID") 
             }

             const video = await video.findbyID(videoId);

             if(!video){
              throw new ApiError(400 , "video not found")
             }

             if(video?.owner.toString() !== req.user?._id.toString()){
              throw new ApiError(400 , "YOur are not previlged to do as you are not owner")
             }

             const togglevideopublish = await video.findbyIDandupdate(
              videoId,
              {
                $set:{
                  isPublished: !video ?.isPublished
                }
              },
              {new : true}
             );
             
             if(!togglevideopublish){
              throw new ApiError(500 ,  "failed to toggle published video")
             }

             return res
             .status(200)
             .json( new ApiResponse(200 , 
              {
                isPublished: togglevideopublish.isPublished } ,
                "video toggle publish successfully"  
            ))

});

export {
getAllVideo,
publishVideo,
getVideobyid,
updateVideo,
deleteVideo,
togglepublishStatus
}