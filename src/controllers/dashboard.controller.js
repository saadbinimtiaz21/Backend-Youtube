import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Video} from "../models/videos.model.js"
import {like} from "../models/like.model.js"
import {Subscription} from "../models/subscription.model.js"
import mongoose from "mongoose"

const getChannelStats = asyncHandler(async (req ,res)=>{

});

const getChannelVideos = asyncHandler(async(req, res)=>{

});

export{
            getChannelStats,
            getChannelVideos,
}