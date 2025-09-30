import {Router} from "express";
import * as invoiceController from "../controllers/invoiceController.js";
import passport from "passport";
import uploadMiddleware from "../middlewares/uploadMiddleware.js";
const invoiceRouter = Router();


invoiceRouter.post("/invoices", uploadMiddleware, passport.authenticate('jwt', {session: false}), invoiceController.createInvoice);

export default invoiceRouter;

