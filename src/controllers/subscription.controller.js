import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {subscription} from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler (async (req , res) => {

});

const getUserChannelSubscriptions = asyncHandler (async (req , res) => {

});

const getSubscribedChannelsVideos = asyncHandler (async (req , res) => {
});

export {
    toggleSubscription,
    getUserChannelSubscriptions,
    getSubscribedChannelsVideos
}