import {Router} from "express";
import * as authController from "../controllers/authController.js";
import { rateLimiter } from "../middlewares/rateLimitMiddleware.js";
const authRouter = Router();


authRouter.post("/auth/register", rateLimiter({capacity: 5, refillRate: 1, refillInterval: 60, prefix: 'global'}), authController.registerUserPost);
authRouter.post("/auth/login", rateLimiter({capacity: 5, refillRate: 1, refillInterval: 60, prefix: 'global'}), authController.logInUserPost);
authRouter.get("/auth/log-out", rateLimiter({capacity: 5, refillRate: 1, refillInterval: 60, prefix: 'global'}), authController.handleLogout);
//authRouter.get("/auth/me", requireAuth, authController.getCurrentUser);
authRouter.post("/auth/google/receiver", rateLimiter({capacity: 5, refillRate: 1, refillInterval: 60, prefix: 'global'}), authController.handleGoogleAuth);

export default authRouter;
