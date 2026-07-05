import { Router } from "express";
import { checkAuth, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const userRouter = Router();
userRouter.route("/signup").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(logoutUser);
userRouter.route("/check-auth").get(verifyJWT, checkAuth);
export default userRouter;
//# sourceMappingURL=user.route.js.map