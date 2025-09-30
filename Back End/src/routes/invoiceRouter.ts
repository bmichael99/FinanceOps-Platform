import {Router} from "express";
import * as invoiceController from "../controllers/invoiceController.js";
import passport from "passport";
import multer from "multer";
const invoiceRouter = Router();
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, './uploads')
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + crypto.randomUUID();
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})
const upload = multer({ storage: storage })

invoiceRouter.post("/invoices", upload.array('files', 5), passport.authenticate('jwt', {session: false}), invoiceController.createInvoice);

export default invoiceRouter;

