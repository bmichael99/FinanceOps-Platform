import path from "path";
import dotenv from 'dotenv';
dotenv.config();
import {type Job, Worker} from 'bullmq';
import { processDocumentData } from '../integrations/mockController';
import { type fileProcessingData } from '../controllers/invoiceController';
import * as db from "../repositories/invoiceRepository";
import IORedis from 'ioredis';
import { uploadFile } from '../integrations/S3AWS';
import fs from "fs";
import { delay } from '../utils/delay';
import {config} from "../config/config";


export function createWorker(){
  const connection = new IORedis({ host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT), maxRetriesPerRequest: null  });
  const publisher = new IORedis({ host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT), maxRetriesPerRequest: null  });

  const fileProcessor = new Worker('FileProcessing', async (job : Job) => {
    const data : fileProcessingData = job.data;

    await db.updateInvoice(data.userId, data.fileName, {currentProcessingStatus: "PROCESSING"})
    await job.updateProgress("PROCESSING");

    const filePath = path.join(config.UPLOADS_DIR, data.fileName);

    //send file to get processed by azure, then save extracted data to database. Also update status.
    const extractedData = await processDocumentData(filePath, data.fileName);
    console.log(extractedData);

    const storeInvoice = await db.updateInvoice(data.userId, data.fileName, {currentProcessingStatus: "SAVING" , ...extractedData});
    await job.updateProgress("SAVING");

    //TODO:API uploads straight to S3 (or a staging bucket), then enqueues the job with the S3 key. 
    //The worker downloads from S3, processes, uploads result, deletes staging. This makes your workers truly stateless and horizontally scalable.
    // //send file to s3 after processing is finished.
    
    await uploadFile(data.fileName, filePath, storeInvoice.mimeType);
    await fs.promises.unlink(filePath);
    await delay(1500); //for testing only, remove when uncommenting everything else.

    // return s3Response;
    console.log(`Dev Build, Processed: ${data.fileName}`)
    await job.updateProgress("COMPLETED");
  },
  {
    connection,
    concurrency: 1,
    limiter: {max: 1, duration: 3000},
  });

  return  {fileProcessor, connection, publisher};
}


