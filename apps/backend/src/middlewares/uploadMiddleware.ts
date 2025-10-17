import multer, { FileFilterCallback } from "multer";
import {Request} from "express";


const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, './uploads')
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + crypto.randomUUID();
    cb(null, file.fieldname + '-' + uniqueSuffix + "." + file.originalname.split(".")[file.originalname.split(".").length -1]);
  },
})

const fileFilter = (_req : Request, file : Express.Multer.File, cb : FileFilterCallback) => {
  // To accept the file pass `true`, like so:
  if(file.mimetype == "application/pdf"){
    cb(null, true)
  } else {
    cb(new Error('Invalid mime type. Must be pdf.'))
    cb(null, false)
  } 
}

const limits : multer.Options["limits"] = { 
  fileSize: 4000000,
  files: 5,
  fields: 20,
  parts: 25,
}

const upload = multer({fileFilter: fileFilter , storage: storage, limits: limits})

const uploadMiddleware = upload.array('files', 5)

export default uploadMiddleware;