import { Router } from "express";
import * as unprocessedInvoiceController from "../controllers/unprocessedInvoiceController";
import passport from "passport";
import uploadMiddleware from "../middlewares/uploadMiddleware.js";

const unprocessedInvoiceRouter = Router();

unprocessedInvoiceRouter.post("/unprocessed-invoices", passport.authenticate('jwt', {session: false}), uploadMiddleware, unprocessedInvoiceController.createUnprocessedInvoice);
unprocessedInvoiceRouter.get("/unprocessed-invoices", passport.authenticate('jwt', {session: false}), unprocessedInvoiceController.getUnprocessedInvoices);
unprocessedInvoiceRouter.get("/unprocessed-invoices/status", passport.authenticate('jwt', {session: false}), unprocessedInvoiceController.unprocessedInvoiceEvents);

export default unprocessedInvoiceRouter;