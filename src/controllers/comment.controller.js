import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {commment} from "../models/comment.model.js";
import mongoose from "mongoose";

const getVideoComments  = asyncHandler (async (req , res) => {
            const {videoId} = req.params
            const {page= 1 , limit = 10} = req.query

});

const addComment = asyncHandler(async (req , res) => {

});

const deleteComment = asyncHandler (async (req , res) => {
});

const updateComment = asyncHandler (async (req , res) => {

});

export {
addComment,
getVideoComments,         
deleteComment,
updateComment
}