import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {uploadOncloudinary} from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Video} from "../models/video.model.js";
import {User} from "../models/user.model.js";
import mongoose , {isValidObjectId} from "mongoose";

const getAllVideo = asyncHandler (async (req , res) => {

const {page= 1 , limt = 10 , query, sortBy , userId}= req.query       

});

const publishVideo = asyncHandler (async (req , res) => {
            const {title , description} = req.body

});

const getVideobyid = asyncHandler (async (req , res) => {
            const {videoId} = req.params

});

const updateVideo = asyncHandler (async (req , res) => {
});

const deleteVideo = asyncHandler (async (req , res) => {

});

const togglepublishStatus = asyncHandler (async (req , res) => {

});

export {
            getAllVideo,
            publishVideo,
            getVideobyid,
            updateVideo,
            deleteVideo,
            togglepublishStatus
}