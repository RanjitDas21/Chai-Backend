import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {

    // get video details from user
    // validation check - is empty or not
    // collect the videoFile and thumbnail local path
    // check for videoFile and thumbnail local path
    // upload them to cloudinary and check again 
    // create video object
    // check for video creation 
    // return response

    // get video details from user...
    const { title, description} = req.body

    // validation check...
    if(
        [title, description].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "all fields are required")
    }

    // collect the videoFile and thumbnail local path...
    const videoFileLocalPath = await req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = await req.files?.thumbnail?.[0]?.path;

    // console.log("videoFile Local Path: ", videoFileLocalPath);

    // check for videoFile and thumbnail local path...
    if(
        [videoFileLocalPath, thumbnailLocalPath].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "all files are required")
    }

    // upload them to cloudinary and check again
    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    // console.log("video File : ", videoFile.url);

    if(!videoFile) {
        throw new ApiError(400, "video file is required")
    }

    if(!thumbnail) {
        throw new ApiError(400, "thumbnail is required")
    }

    // create video object...
    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration,
        views: 0,
        isPublished: true,
        owner: req.user._id
    })

    // check for video creation ...
    const createdVideo = await Video.findById(video?._id);

    if(!createdVideo) {
        throw new ApiError(500, "something went wrong while uploading the video")
    }

    // return the response...
    return res
    .status(200)
    .json(
        new ApiResponse(200, createdVideo, "Video uploaded successfully")
    )
    
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}