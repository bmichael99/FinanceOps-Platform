const { Router } = require("express");
const invoiceController = require("../controllers/invoiceController");
const invoiceRouter = Router();
const passport = require('passport');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })



invoiceRouter.post("/invoices", upload.array('files'), passport.authenticate('jwt', {session: false}), invoiceController.createInvoice);

module.exports = invoiceRouter;


