import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {like} from "../models/like.model.js";
import mongoose , {isValidObjectId} from "mongoose";


const toggleVideoLike = asyncHandler (async (req , res) => {

});

const toggleCommentLike = asyncHandler (async (req , res) => {

});

const toggleTweetLike = asyncHandler (async (req , res) => {

});

const getLikedVideos = asyncHandler (async (req , res) => {

});


export{
            toggleVideoLike,
            toggleCommentLike,
            toggleTweetLike,
            getLikedVideos,
}