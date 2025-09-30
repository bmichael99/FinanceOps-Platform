import {Router} from "express";
import  * as refreshTokenController from "../controllers/refreshTokenController";
const refreshRouter = Router();


refreshRouter.get("/refresh", refreshTokenController.handleRefreshToken);

export default refreshRouter;
