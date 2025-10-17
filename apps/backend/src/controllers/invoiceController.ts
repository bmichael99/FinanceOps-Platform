import * as db from "../repositories/invoiceRepository";
import {NextFunction, Request, Response} from "express";
import {Queue} from 'bullmq';
import { type User } from '../generated/prisma'

export interface fileProcessingData {
    fileName: string,
}

export async function createInvoice(req : Request, res : Response, _next: NextFunction) { 
  const files = req.files as Express.Multer.File[];
  if(!files || files.length == 0){
    return res.status(400).json("No files submitted. That shouldn't even be possible.");
  }


  const results = await Promise.allSettled(files?.map((file : Express.Multer.File) => 
    db.createUnprocessedInvoice({user: { connect: { id: req.user!.id } },fileName: file.filename, originalFileName: file.originalname, mimeType: file.mimetype, filePath: file.path, currentProcessingStatus: 'PENDING'})
  ))

  const fileQueue = new Queue('FileProcessing');
  const successes : {file: string, originalFileName: string}[] = [];
  const failures: {originalFileName: string, error: string}[] = [];

  

  for(const [i,result] of results.entries()) {
    if(result.status == "fulfilled"){
      try{
        const fileData : fileProcessingData = {fileName: files[i].filename};
        await fileQueue.add(files[i].filename, fileData, {removeOnComplete: true, removeOnFail: 25, attempts: 3, backoff: {type: "exponential", delay: 3000}}); 
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