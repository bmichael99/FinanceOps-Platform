import {Router} from "express";
import * as indexController from "../controllers/indexController.js";
const  indexRouter = Router();

indexRouter.get("/health", indexController.healthCheck);

export default indexRouter;