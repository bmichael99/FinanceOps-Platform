import * as db from "../repositories/invoiceRepository";
import {Request, Response} from "express";
import {Queue} from 'bullmq';
import { type FileResponseType } from "@finance-platform/types";

export interface fileProcessingData {
    fileName: string,
}

function delay(ms: number){
  return new Promise((resolve) => {setTimeout(resolve, ms)})
}

export async function createInvoice(req : Request, res : Response) { 
  const files = req.files as Express.Multer.File[];
  const clientIds = Array.isArray(req.body.clientIds) ? req.body.clientIds : [req.body.clientIds];

  if(!files || files.length == 0){
    return res.status(400).json("No files submitted. That shouldn't even be possible.");
  }


  const results = await Promise.allSettled(files?.map((file : Express.Multer.File) => 
    db.createUnprocessedInvoice({user: { connect: { id: req.user!.id } },fileName: file.filename, originalFileName: file.originalname, mimeType: file.mimetype, filePath: file.path, currentProcessingStatus: 'PENDING'})
  ))

  const fileQueue = new Queue('FileProcessing');

  const fileResponse: FileResponseType[] = [];

  for(const [i,result] of results.entries()) {
    if(result.status == "fulfilled"){
      try{
        const fileData : fileProcessingData = {fileName: files[i].filename};
        await fileQueue.add(files[i].filename, fileData, {removeOnComplete: true, removeOnFail: 25, attempts: 3, backoff: {type: "exponential", delay: 3000}}); 
        fileResponse.push({clientID: clientIds[i], fileName: files[i].filename, originalFileName: files[i].originalname, status: "PENDING"})
      }
      catch(queueErr) {
        fileResponse.push({clientID: clientIds[i], fileName: files[i].filename, originalFileName: files[i].originalname, status: "FAILED", error: `Queueing failed: ${queueErr}`})
        console.error("Some invoices failed to enqueue: ", {fileName: files[i].filename, originalFileName: files[i].originalname, status: "FAILED", error: `Queueing failed: ${queueErr}`});
      }
    } else {
      fileResponse.push({clientID: clientIds[i], fileName: files[i].filename, originalFileName: files[i].originalname, status: "FAILED", error: String(result.reason)})
      console.error("Some invoices failed to be saved to db: ", {fileName: files[i].filename, originalFileName: files[i].originalname, status: "FAILED", error: String(result.reason)});
    }
  }

  //return to user which files succeeded and failed. Failed only needs original name for UX
  await delay(3000);

  res.status(200).json(fileResponse);
}

export async function invoiceEvents(_req: Request, res : Response){
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  


}