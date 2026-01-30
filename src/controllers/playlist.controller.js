import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Playlist} from "../models/playlist.model.js";
import mongoose,{isValidObjectId} from "mongoose";


const createPlaylist = asyncHandler (async (req , res) => {
 const {name , description} = req.body
});

const getUserPlaylist = asyncHandler (async (req , res) => {

});      

const getPlaylistById = asyncHandler (async (req , res) => {

});

const addVideoToPlaylist = asyncHandler (async (req , res) => {

});


const removeVideoFromPlaylist = asyncHandler (async (req , res) => {

});

const deletePlaylist = asyncHandler (async (req , res) => {

});

const updatePlaylist = asyncHandler (async (req , res) => {

});


export {
 createPlaylist,
 getUserPlaylist,
 getPlaylistById,
 addVideoToPlaylist,
 removeVideoFromPlaylist,
 deletePlaylist,
 updatePlaylist,
}