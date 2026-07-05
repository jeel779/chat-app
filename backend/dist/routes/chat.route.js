import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllTheUsers, getConversations, sendMessage } from "../controllers/chat.controller.js";
const chatRouter = Router();
chatRouter.route("/").get(verifyJWT, getAllTheUsers);
chatRouter.route("/:id").get(verifyJWT, getConversations);
chatRouter.route("/:id").post(verifyJWT, sendMessage);
export default chatRouter;
//# sourceMappingURL=chat.route.js.map