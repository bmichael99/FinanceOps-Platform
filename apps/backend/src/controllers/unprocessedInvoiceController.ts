import * as db from "../repositories/unprocessedInvoiceRepository";
import {Request, Response} from "express";
import { fileQueue } from "../config/redis";
import { type FileResponseType } from "@finance-platform/types";
import { addClient, deleteClient, getClient } from "../utils/clientHandler";
import { delay } from "../utils/delay";
import IORedis from 'ioredis';
import { JobProgress } from "bullmq";
import { type UnprocessedInvoiceFindManyType } from "../repositories/unprocessedInvoiceRepository";

export interface fileProcessingData {
    userId: number,
    fileName: string,
    originalFileName: string,
    uploadTime: Date,
    status: JobProgress,
}

const redis = new IORedis({ maxRetriesPerRequest: null });

redis.subscribe("FileProcessing", (err, count) => {
  if (err) {
    console.error("Failed to subscribe: %s", err.message);
  } else {
    console.log(
      `Subscribed successfully! This client is currently subscribed to ${count} channels.`
    );
  }
});

redis.on("message", (_channel, message) => {
  const data: fileProcessingData = JSON.parse(message);
  const res = getClient(data.userId);

  const event = "fileStatus";

  //format response in the proper Event stream format
  res.write(`event: ${event}\ndata: ${message}\n\n`);

  // console.log(`Received ${message} from ${channel}`);
});

export async function createUnprocessedInvoice(req : Request, res : Response) { 
  const files = req.files as Express.Multer.File[];
  const clientIds = Array.isArray(req.body.clientIds) ? req.body.clientIds : [req.body.clientIds];

  if(!files || files.length == 0){
    return res.status(400).json("No files submitted. That shouldn't even be possible.");
  }


  const results = await Promise.allSettled(files?.map((file : Express.Multer.File) => 
    db.createUnprocessedInvoice({user: { connect: { id: req.user!.id } },fileName: file.filename, originalFileName: file.originalname, mimeType: file.mimetype, filePath: file.path, currentProcessingStatus: 'PENDING'})
  ))

  await delay(3000);

  const fileResponse: FileResponseType[] = [];

  for(const [i,result] of results.entries()) {
    if(result.status == "fulfilled"){
      try{
        const fileData : fileProcessingData = {fileName: files[i].filename, userId: req.user!.id, originalFileName: files[i].originalname, uploadTime: result.value.createdAt, status: "PENDING"};
        await fileQueue.add(files[i].filename, fileData, {removeOnComplete: true, removeOnFail: 25, attempts: 3, backoff: {type: "exponential", delay: 3000}}); 
        fileResponse.push({clientID: clientIds[i], fileName: files[i].filename, originalFileName: files[i].originalname, uploadTime: result.value.createdAt,status: "PENDING"})
      }
      catch(queueErr) {
        fileResponse.push({clientID: clientIds[i], fileName: files[i].filename, originalFileName: files[i].originalname, uploadTime: result.value.createdAt, status: "FAILED", error: `Queueing failed: ${queueErr}`})
        console.error("Some invoices failed to enqueue: ", {fileName: files[i].filename, originalFileName: files[i].originalname, status: "FAILED", error: `Queueing failed: ${queueErr}`});
      }
    } else {
      fileResponse.push({clientID: clientIds[i], fileName: files[i].filename, originalFileName: files[i].originalname, uploadTime: new Date(), status: "FAILED", error: String(result.reason)})
      console.error("Some invoices failed to be saved to db: ", {fileName: files[i].filename, originalFileName: files[i].originalname, status: "FAILED", error: String(result.reason)});
    }
  }

  res.status(200).json(fileResponse);
}

export async function unprocessedInvoiceEvents(req: Request, res : Response){
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  //set the users response object based on their userId, this is so workers can have access to the response object for sending updates to the client.
  addClient(req.user!.id, res);
  
  req.on("close", () => {
    deleteClient(req.user!.id);
  });
}

export async function getUnprocessedInvoices(req: Request, res: Response){
  const {since} = req.query;

  const filters: UnprocessedInvoiceFindManyType['where'] = { userId: req.user!.id };

  if (since) filters.createdAt = { gte: new Date(since as string) };

  const unprocessedInvoices = await db.getManyUnprocessedInvoicesWithFilters({where: filters});

  res.status(200).json({invoices: unprocessedInvoices})
}