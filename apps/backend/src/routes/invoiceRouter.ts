import {Router} from "express";
import passport from "passport";
import * as invoiceController from "../controllers/invoiceController.js";
// import passport from "passport";
// import uploadMiddleware from "../middlewares/uploadMiddleware.js";
const invoiceRouter = Router();

invoiceRouter.get("/invoices/table-data", passport.authenticate('jwt', {session: false}), invoiceController.getInvoiceTableData);
invoiceRouter.delete("/invoices/:invoiceId", passport.authenticate('jwt', {session: false}), invoiceController.deleteInvoice);
invoiceRouter.delete("/invoices", passport.authenticate('jwt', {session: false}), invoiceController.deleteManyInvoices);

export default invoiceRouter;

