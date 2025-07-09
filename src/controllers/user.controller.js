import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {

    // get user details from frontend
    // validation check - not empty
    // check if user already exists : by email / username
    // check for images, check for avatar
    // upload them to cloudinary, check for avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response


    // get user details from frontend...

    const {fullName, email, username, password} = req.body
    // console.log("email: ", email);

    // validation check...

    // if(fullName ==="") {
    //     throw new ApiError(400, "fullName is required");
    // }

    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // check if user already exists...

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // check for avatar...
    
    const avatarLocalPath = await req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = await req.files?.coverImage?.[0]?.path;

    // let coverImageLocalPath;
    // if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.lenght > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path;
    // }

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is Required");
    }

    // if(!coverImageLocalPath) {
    //     throw new ApiError(400, "Cover Image File is Required");
    // } else {
    //     console.log("cover image local path :", coverImageLocalPath);
    // }

    // upload them to cloudinary...
    
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);


    // check for avatar...

    // if(!coverImage) {
    //     throw new ApiError(400, "Cover Image File is Required");
    // }
    

    if(!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }

    // create user object...

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(), 
        password
    })

    // remove password and refresh token field from response...

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // check for user creation...

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }    

    // return response...

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )

})

const loginUser = asyncHandler( async (req, res) => {

})

export {
    registerUser,
    loginUser
};