import { Router } from "express";
import { checkAuth, loginUser, logoutUser, registerUser, updateAvatar } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const userRouter=Router()
userRouter.route("/signup").post(registerUser)
userRouter.route("/login").post(loginUser)
userRouter.route("/logout").post(logoutUser)
userRouter.route("/check-auth").get(verifyJWT, checkAuth);
userRouter.route("/update-avatar").put(verifyJWT, upload.single("avatar"), updateAvatar);
export default userRouter