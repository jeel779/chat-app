import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../lib/prisma.js";
import type { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { io, onlineUsers } from "../socket/socket.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
export const getAllTheUsers = asyncHandler(async (req: Request, res: Response) => {
    const curruntUserId = req.userId as string
    const users = await prisma.user.findMany({
        where: {
            NOT: {
                id: curruntUserId,
            },
        },
        select: {
            id: true,
            username: true,
            avatar: true
        },
    });
    return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                {
                    users
                },
                "users fetched successfully"
            )
        )
})
export const getConversations = asyncHandler(async (req: Request, res: Response) => {
    const otherPersonId = req.params.id as string
    const curruntUserId = req.userId as string
    const chats = await prisma.message.findMany({
        where: {
            OR: [
                {
                    senderId: curruntUserId,
                    receiverId: otherPersonId
                },
                {
                    senderId: otherPersonId,
                    receiverId: curruntUserId
                }
            ]
        },
        orderBy: {
            createdAt: "asc",
        },
    })
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    chats
                },
                "chats fetched successfully"
            )
        )
})
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const { content } = req.body as { content?: string }
    const imageFile = req.file;

    if (!content?.trim() && !imageFile) {
        throw new ApiError(400, "Message cannot be empty");
    }
    const receiverId = req.params.id as string
    const senderId = req.userId as string
    const receiver = await prisma.user.findUnique({
        where: {
            id: receiverId
        }
    });

    if (!receiver) {
        throw new ApiError(404, "User not found");
    }
    if (senderId === receiverId) {
        throw new ApiError(400, "You cannot message yourself");
    }

    let imageUrl: string | undefined = undefined;
    if (imageFile) {
        const uploadResult = await uploadOnCloudinary(imageFile.path);
        if (!uploadResult) {
            throw new ApiError(500, "Failed to upload image to Cloudinary");
        }
        imageUrl = uploadResult.secure_url;
    }

    const message = await prisma.message.create({
        data: {
            content: content?.trim() || null,
            image: imageUrl || null,
            receiverId,
            senderId
        }
    });

    const receiverSocketId = onlineUsers.get(receiverId);
    console.log(`[Socket] Sending message to receiver ${receiverId}. Socket ID: ${receiverSocketId}`);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("new-message", message);
        console.log(`[Socket] Successfully emitted new-message to Socket ID: ${receiverSocketId}`);
    } else {
        console.log(`[Socket] Receiver ${receiverId} is offline or not mapped in onlineUsers. Current online users keys:`, Array.from(onlineUsers.keys()));
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    message
                },
                "message send successfully"
            )
        )
})