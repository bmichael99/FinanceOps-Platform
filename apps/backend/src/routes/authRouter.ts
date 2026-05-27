import {Router} from "express";
import * as authController from "../controllers/authController.js";
import { rateLimiter } from "../middlewares/rateLimitMiddleware.js";
const authRouter = Router();


authRouter.post("/auth/register", rateLimiter({capacity: 10, refillRate: 1, refillInterval: 60, prefix: 'auth'}), authController.registerUserPost);
authRouter.post("/auth/login", rateLimiter({capacity: 10, refillRate: 1, refillInterval: 60, prefix: 'auth'}), authController.logInUserPost);
authRouter.get("/auth/log-out", rateLimiter({capacity: 10, refillRate: 1, refillInterval: 60, prefix: 'auth'}), authController.handleLogout);
//authRouter.get("/auth/me", requireAuth, authController.getCurrentUser);
authRouter.post("/auth/google/receiver", rateLimiter({capacity: 10, refillRate: 1, refillInterval: 60, prefix: 'auth'}), authController.handleGoogleAuth);

export default authRouter;
