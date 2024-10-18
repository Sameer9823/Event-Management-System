import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { deleteFromCloudinary } from "../utils/imagedelete.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessandRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

} catch (err){
    throw new ApiError(500, "Something went wrong while generating tokens");
}
}

const register = asyncHandler(async(req, res) => {

    const {name, email, password, role} = req.body;

    if([name, email, password, role].some((f) => f?.trim() === "")){
        throw new ApiError(400, "All fields are required");
    }

    const existUser = await User.findOne({
        $or: [{name}, {email}]
    })

    if(existUser){
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar){
        throw new ApiError(500, "Something went wrong while uploading avatar");
    }

    const user = await User.create({
        name: name.toLowerCase(),
        email,
        password,
        role,
        avatar: avatar.url
    })

    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createUser){
        throw new ApiError(500, "Something went wrong while creating user");
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, createUser, "User created successfully")
    )

})

//login user

const login = asyncHandler(async(req, res) => {

    const {email, password} = req.body

    if(!email && !password){
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({

        $or: [{email}]

    })

    if(!user){
        throw new ApiError(404, "User not found");
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(400, "Password is incorrect");
    }
    const {accessToken, refreshToken} = await generateAccessandRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, loggedInUser, "User logged in successfully")
    )
})


//logout user

const logout = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged out successfully")
    );

})

//refresh token
const refreshToken = asyncHandler(async(req, res) => {

    


})




export {
    register,
    login,
    logout

}