import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../lib/prisma.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { io, onlineUsers } from "../socket/socket.js";
export const getAllTheUsers = asyncHandler(async (req, res) => {
    const curruntUserId = req.userId;
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
        .json(new ApiResponse(201, {
        users
    }, "users fetched successfully"));
});
export const getConversations = asyncHandler(async (req, res) => {
    const otherPersonId = req.params.id;
    const curruntUserId = req.userId;
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
    });
    return res
        .status(200)
        .json(new ApiResponse(200, {
        chats
    }, "chats fetched successfully"));
});
export const sendMessage = asyncHandler(async (req, res) => {
    const { content } = req.body;
    if (!content?.trim()) {
        throw new ApiError(400, "Message cannot be empty");
    }
    const receiverId = req.params.id;
    const senderId = req.userId;
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
    const message = await prisma.message.create({
        data: {
            content,
            receiverId,
            senderId
        }
    });
    const receiverSocketId = onlineUsers.get(receiverId);
    console.log(`[Socket] Sending message to receiver ${receiverId}. Socket ID: ${receiverSocketId}`);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("new-message", message);
        console.log(`[Socket] Successfully emitted new-message to Socket ID: ${receiverSocketId}`);
    }
    else {
        console.log(`[Socket] Receiver ${receiverId} is offline or not mapped in onlineUsers. Current online users keys:`, Array.from(onlineUsers.keys()));
    }
    return res
        .status(200)
        .json(new ApiResponse(200, {
        message
    }, "message send successfully"));
});
//# sourceMappingURL=chat.controller.js.map