import {Router} from "express";
import * as authController from "../controllers/authController";
const authRouter = Router();


authRouter.post("/auth/register", authController.registerUserPost);
authRouter.post("/auth/login", authController.logInUserPost);
authRouter.get("/auth/log-out", authController.handleLogout);
//authRouter.get("/auth/me", requireAuth, authController.getCurrentUser);

export default authRouter;
