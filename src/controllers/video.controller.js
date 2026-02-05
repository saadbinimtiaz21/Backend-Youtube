import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {uploadOncloudinary} from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Video} from "../models/video.model.js";
import {User} from "../models/user.model.js";
import mongoose , {isValidObjectId} from "mongoose";

const publishVideo = asyncHandler (async (req , res) => {
const {title , description} = req.body
if(!title || !description)
{
throw new ApiError(400 , "Field Are Required")
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
const Thumbnailpath =  req.files?.Thumbnail?.[0]?.path;

console.log("VideoFiles Path : ", videofilelocalpath)
console.log("Thumbnail Path : ", Thumbnailpath)

if(!videofilelocalpath || !Thumbnailpath){
            throw new ApiError(401, "video file is required")
}

const videofile  =await uploadOncloudinary(videofilelocalpath)
const Thumbnail = await uploadOncloudinary(Thumbnailpath)
if(!(videofile || Thumbnail)){
            throw new ApiError(400 , "Error in uploading Video")
}

const Video = await Video.create({
            title,
            description,
            VideoFileurl: videofile.secure_url,
            Thumbnail: Thumbnail.secure_url ,
            owner: req.user._id
 
})

const createdVideo = await Video.findById(Video._id)
.populate("owner" , "username", "FullName" , "Email")

if(!createdVideo){
            throw new ApiError(500 , "Something went wrong while creating video")
}
            return res.status(201)
            .json(new ApiResponse(201, createdVideo , "video file is Published"))
});

const getAllVideo = asyncHandler (async (req , res) => {

const {page= 1 , limit = 10 , query, sortBy ,sortType, userId}= req.query  

const filter = {
            isPublished : true,
            limit: parseInt(limit),
            page: parseInt(page)
}

const sort = {
            [sortBy] : sortType === "asc" ? 1 : -1
            
}
const videofilter = query ? {
            title : {$regex : query , $options : "i"}
} : {}
const userfilter = userId && isValidObjectId(userId) ? {
            owner : userId
} : {}

});


const getVideobyid = asyncHandler (async (req , res) => {
            const {videoId} = req.params
if(!isValidObjectId(videoId)){
            throw new ApiError(400 , "Invalid Video Id")
}

const video = await Video.findById(videoId)
if(!video){
            throw new ApiError(404 , "Video Not Found")
}
const videoOwner = await User.findById(video.owner)
if(!videoOwner){
            throw new ApiError(404 , "Video Owner Not Found")
}

return res.status (200)
.json (new ApiResponse(200, {video, videoOwner} , "Video Fetched Successfully"))
});

const updateVideo = asyncHandler (async (req , res) => {
            const {videoId} = req.params
});

const deleteVideo = asyncHandler (async (req , res) => {
             const {videoId} = req.params
});

const togglepublishStatus = asyncHandler (async (req , res) => {
             const {videoId} = req.params
});

export {
getAllVideo,
publishVideo,
getVideobyid,
updateVideo,
deleteVideo,
togglepublishStatus
}