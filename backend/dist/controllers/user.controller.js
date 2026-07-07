import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { prisma } from "../lib/prisma.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { signInSchema, signUpSchema } from "../utils/schemas.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
export const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    const result = signUpSchema.safeParse(req.body);
    if (!result.success) {
        throw new ApiError(400, result.error.issues[0]?.message || "Invalid user data");
    }
    const existedUser = await prisma.user.findFirst({
        where: {
            OR: [{ username }, { email }]
        }
    });
    if (existedUser) {
        return res.status(401).json({ message: "user already exist with this email or username " });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const createdUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword
        },
        select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
        }
    });
    const payload = {
        id: createdUser.id
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    };
    return res
        .status(200)
        .cookie("token", token, options)
        .json(new ApiResponse(200, {
        user: createdUser,
        token,
    }, "user created successfully"));
});
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = signInSchema.safeParse(req.body);
    if (!result.success) {
        throw new ApiError(400, result.error.issues[0]?.message || "Invalid user data");
    }
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid user credentials");
    }
    const loggedInUser = await prisma.user.findFirst({
        where: {
            id: user.id
        },
        select: {
            id: true,
            email: true,
            username: true,
            avatar: true
        }
    });
    if (!loggedInUser) {
        throw new ApiError(404, "User not found");
    }
    const payload = {
        id: loggedInUser.id
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    };
    return res
        .status(200)
        .cookie("token", token, options)
        .json(new ApiResponse(200, {
        user: loggedInUser, token,
    }, "User logged In Successfully"));
});
export const checkAuth = asyncHandler(async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }
    const user = await prisma.user.findFirst({
        where: {
            id: userId
        },
        select: {
            id: true,
            email: true,
            username: true,
            avatar: true
        }
    });
    if (!user) {
        throw new ApiError(401, "User not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, {
        user
    }, "User is already logged in"));
});
export const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    };
    return res
        .status(200)
        .clearCookie("token", options)
        .json(new ApiResponse(200, {}, "User logged Out"));
});
export const updateAvatar = asyncHandler(async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }
    const avatarFile = req.file;
    if (!avatarFile) {
        throw new ApiError(400, "Please upload an avatar image");
    }
    const uploadResult = await uploadOnCloudinary(avatarFile.path);
    if (!uploadResult) {
        throw new ApiError(500, "Failed to upload avatar to Cloudinary");
    }
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            avatar: uploadResult.secure_url,
        },
        select: {
            id: true,
            email: true,
            username: true,
            avatar: true,
        },
    });
    return res
        .status(200)
        .json(new ApiResponse(200, { user: updatedUser }, "Avatar updated successfully"));
});
//# sourceMappingURL=user.controller.js.map