import {Router} from "express";
import * as invoiceController from "../controllers/invoiceController";
import passport from "passport";
import multer from "multer";
const upload = multer({ dest: 'uploads/' })
const invoiceRouter = Router();

invoiceRouter.post("/invoices", upload.array('files'), passport.authenticate('jwt', {session: false}), invoiceController.createInvoice);

export default invoiceRouter;

