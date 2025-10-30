import {Router} from "express";
import * as invoiceController from "../controllers/invoiceController.js";
import passport from "passport";
import uploadMiddleware from "../middlewares/uploadMiddleware.js";
const invoiceRouter = Router();


invoiceRouter.post("/invoices", passport.authenticate('jwt', {session: false}), uploadMiddleware, invoiceController.createInvoice);

export default invoiceRouter;

