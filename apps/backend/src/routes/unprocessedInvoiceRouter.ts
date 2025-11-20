import { Router } from "express";
import * as unprocessedInvoiceController from "../controllers/unprocessedInvoiceController";
import passport from "passport";
import uploadMiddleware from "../middlewares/uploadMiddleware.js";

const unprocessedInvoiceRouter = Router();

unprocessedInvoiceRouter.post("/unprocessed-invoices", passport.authenticate('jwt', {session: false}), uploadMiddleware, unprocessedInvoiceController.createUnprocessedInvoice);
unprocessedInvoiceRouter.get("/unprocessed-invoices", passport.authenticate('jwt', {session: false}), unprocessedInvoiceController.getUnprocessedInvoices);
unprocessedInvoiceRouter.get("/unprocessed-invoices/status", passport.authenticate('jwt', {session: false}), unprocessedInvoiceController.unprocessedInvoiceEvents);
unprocessedInvoiceRouter.get("/unprocessed-invoices/:invoiceId/signed-url", passport.authenticate('jwt', {session: false}), unprocessedInvoiceController.getS3SignedURL);
unprocessedInvoiceRouter.get("/unprocessed-invoices/:invoiceId", passport.authenticate('jwt', {session: false}), unprocessedInvoiceController.getUnprocessedInvoice);

export default unprocessedInvoiceRouter;