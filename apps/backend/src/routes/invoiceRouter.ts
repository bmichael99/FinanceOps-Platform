import {Router} from "express";
import passport from "passport";
import * as invoiceController from "../controllers/invoiceController.js";
import uploadMiddleware from "../middlewares/uploadMiddleware.js";
import { checkInvoiceLimits } from "../middlewares/invoiceMiddleware.js";
const invoiceRouter = Router();

invoiceRouter.get("/invoices/table-data", passport.authenticate('jwt', {session: false}), invoiceController.getInvoiceTableData);
invoiceRouter.delete("/invoices/:invoiceId", passport.authenticate('jwt', {session: false}), invoiceController.deleteInvoice);
// invoiceRouter.delete("/invoices", passport.authenticate('jwt', {session: false}), invoiceController.deleteManyInvoices);

invoiceRouter.post("/invoices", passport.authenticate('jwt', {session: false}), checkInvoiceLimits, uploadMiddleware, invoiceController.createInvoice);
invoiceRouter.get("/invoices", passport.authenticate('jwt', {session: false}), invoiceController.getInvoices);
invoiceRouter.get("/invoices/count", passport.authenticate('jwt', {session: false}), invoiceController.getInvoiceCount);
invoiceRouter.get("/invoices/status", passport.authenticate('jwt', {session: false}), invoiceController.invoiceEvents);
invoiceRouter.get("/invoices/:invoiceId/signed-url", passport.authenticate('jwt', {session: false}), invoiceController.getS3SignedURL);
invoiceRouter.get("/invoices/:invoiceId", passport.authenticate('jwt', {session: false}), invoiceController.getInvoice);
invoiceRouter.post("/invoices/:invoiceId/verify", passport.authenticate('jwt', {session: false}), invoiceController.verifyInvoice);

invoiceRouter.get("/invoices/dashboard/summary", passport.authenticate('jwt', {session: false}), invoiceController.getInvoiceDashboardSummary);

export default invoiceRouter;

