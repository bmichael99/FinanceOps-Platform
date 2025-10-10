import * as db from "../repositories/invoiceRepository";
import {NextFunction, Request, Response} from "express";
import {Queue} from 'bullmq';

export async function createInvoice(req : Request, res : Response, _next: NextFunction) { 
  const files = req.files as Express.Multer.File[];

  const results = await Promise.allSettled(files?.map((file : Express.Multer.File) => 
    db.createUnprocessedInvoice({fileName: file.filename, originalFileName: file.originalname, mimeType: file.mimetype, filePath: file.path, currentProcessingStatus: 'PENDING'})
  ))

  const fileQueue = new Queue('FileProcessing');
  const successes : {file: string, originalFileName: string}[] = [];
  const failures: {originalFileName: string, error: string}[] = [];

  for(const [i,result] of results.entries()) {
    if(result.status == "fulfilled"){
      try{
        await fileQueue.add(files[i].filename, {fileName: files[i].filename}, {removeOnComplete: true, removeOnFail: true}); 
        successes.push({file: files[i].filename, originalFileName: files[i].originalname});
      }
      catch(queueErr) {
        failures.push({originalFileName: files[i].originalname, error: `Queueing failed: ${queueErr}`})
      }
    } else {
      failures.push({originalFileName: files[i].originalname, error: String(result.reason)})
    }
  }



  //return to user which files succeeded and failed. Failed only needs original name for UX
  res.status(200).json({successes, failures});
}