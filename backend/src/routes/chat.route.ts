import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllTheUsers, getConversations, sendMessage } from "../controllers/chat.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const chatRouter=Router()

chatRouter.route("/").get(verifyJWT,getAllTheUsers)
chatRouter.route("/:id").get(verifyJWT,getConversations)
chatRouter.route("/:id").post(verifyJWT, upload.single("image"), sendMessage)

export default chatRouter