import multer, { FileFilterCallback } from "multer";
import {Request} from "express";
import crypto from "crypto";
import path from "path";
import {config} from "../config/config";

const INVOICE_LIMIT = Number(process.env.INVOICE_LIMIT ?? 5);

function fileFailed(req : Request, file: Express.Multer.File, reason: string){
  console.error("File filtered by multer: ", file.originalname);
  req.failedInvoiceUploads ??= [];
  req.failedInvoiceUploads.push({fieldname: file.fieldname, filename: file.filename, originalname: file.originalname, reason});
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, config.UPLOADS_DIR)
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + crypto.randomUUID();
    cb(null, uniqueSuffix + "." + file.originalname.split(".")[file.originalname.split(".").length -1]);
  },
})

const fileFilter = (req : Request, file : Express.Multer.File, cb : FileFilterCallback) => {
  req.currentInvoiceCount ??= 0;

  console.log("fieldname: ", file.fieldname);
  //check for invalid field name, should be in the format of my clientID which is: files_UUID, here we check for the "files_" part of the fieldname.
  if(file.fieldname.slice(0,6) != "files_"){
    //reject the entire request, this shouldn't happen unless via a malicious request.
    return cb(new Error(`Unexpected fieldname: ${file.fieldname}`));
  }

  //check if we're past invoice_limit now, initial check is in invoiceMiddleware.ts which checks if we're at limit at time of request
  if(req.user!.role !== "ADMIN" && req.currentInvoiceCount >= INVOICE_LIMIT){
    fileFailed(req,file,"quota");
    return cb(null,false);
  }
  
  if(file.mimetype !== "application/pdf"){
    //todo: add an invalidfiles object to req so u can add filtered out files to failes in the createInvoice controller funciton.
    //fine for now since we know front-end has this same error-checking.
    fileFailed(req,file,"mimetype");
    return cb(null, false);
  }

  req.currentInvoiceCount++;
  return cb(null, true);
}

const limits : multer.Options["limits"] = { 
  fileSize: 4000000,
  files: 5,
  fields: 20,
  parts: 25,
}

const upload = multer({fileFilter: fileFilter , storage: storage, limits: limits})

const uploadMiddleware = upload.any();

export default uploadMiddleware;