import * as db from "../repositories/unprocessedInvoiceRepository";
import {Request, Response} from "express";
import { fileQueue } from "../config/redis";
import { FileStatus, type FileResponseType,type FileStatusType } from "@finance-platform/types";
import { addClient, deleteClient, getClient } from "../utils/clientHandler";
import { delay } from "../utils/delay";
import IORedis from 'ioredis';
import { JobProgress } from "bullmq";
import { type UnprocessedInvoiceFindManyType } from "../repositories/unprocessedInvoiceRepository";
import { Prisma, type UnprocessedInvoice } from "../generated/prisma";
import * as z from "zod";
import { shapeFull, shapeSummary, shapeCustom } from "../utils/unprocessedInvoiceShapers";

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
  if(res)
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


/**
 * Query Parameter options: 
 * since: Date object that's received as a string, returns all unprocessed invoices greater than or equal to the date time provided. ex: ?since=new Date(Date.now() - 1000*60*60*24) will return unprocessed invoices within the last 24 hours
 * status: currentProcessingStatus filter, this is defined by the FileStatusType in the shared types. Current options are: UPLOADING, PENDING, PROCESSING, SAVING, COMPLETED, FAILED
 * view: sets the shape of the return data, determining what data is returned. Current options are summary: returns invoices as FileResponseType[] (shared type which includes fileName, originalFileName, status, and uploadTime(createdAt)). full: returns invoices as Invoice[] (all data returned by db, the full model for unprocessed invoice). custom: returns the specified fields in fields query param only.
 * fields: Input as comma seperated values. If view type is set to custom then this endpoint will only return the specified fields. Possible fields reflect the prisma model. ex: ?fields=originalFileName,fileName,mimeType
 */ 
export async function getUnprocessedInvoices(req: Request, res: Response){
  //define zod schema for parsing query params. This allows us to validate our query params.
  const QueryParamsSchema = z.object({
    since: z.string().optional(),
    status: z.enum(Object.keys(FileStatus)).optional(),
    view: z.enum(["SUMMARY", "FULL", "CUSTOM"]).optional(),
    fields: z.string().optional(),
  })
  const result = QueryParamsSchema.safeParse(req.query);
  if(!result.success){
    res.status(400).json({message: "Invalid params"});
    return;
  }

  //extract query params from parsed params.
  const {since, status, view, fields} = result.data;

  //validate fields
  const FieldsSchema = z.array(z.enum(Prisma.UnprocessedInvoiceScalarFieldEnum));
  const fieldsListParse = FieldsSchema.safeParse(fields?.split(",") ?? []);

  if(!fieldsListParse.success){
    res.status(400).json({message: "Invalid fields"});
    return;
  }
  const fieldsList = fieldsListParse.data;
  
  //set filters
  const filters: UnprocessedInvoiceFindManyType['where'] = { userId: req.user!.id };
  if (since) filters.createdAt = { gte: new Date(since) };
  if (status) filters.currentProcessingStatus = status as FileStatusType;
  

  //query the db with filters
  const unprocessedInvoices = await db.getManyUnprocessedInvoicesWithFilters({where: filters});

  //define our response and apply view (shape of the result object)
  type ResponseType = FileResponseType[] | UnprocessedInvoice[];
  let response : ResponseType;
  switch(view){
    case("SUMMARY"):
    response = unprocessedInvoices.map((invoice) => shapeSummary(invoice))
    break;
    case("CUSTOM"):
    response = unprocessedInvoices.map((invoice) => shapeCustom(invoice, fieldsList));
    break;
    case("FULL"):
    default:
    response = unprocessedInvoices;
    break;
  }

  res.status(200).json(response)
}