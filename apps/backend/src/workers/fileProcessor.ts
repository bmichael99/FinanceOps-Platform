import dotenv from 'dotenv';
dotenv.config();
import {type Job, Worker} from 'bullmq';
import { processDocumentData } from '../integrations/mockController';
import { type fileProcessingData } from '../controllers/invoiceController';
import * as db from "../repositories/invoiceRepository";
import IORedis from 'ioredis';
import { uploadFile } from '../integrations/S3AWS';
import path from "path";
import fs from "fs";

const connection = new IORedis({ maxRetriesPerRequest: null });

const fileProcessor = new Worker('FileProcessing', async (job : Job) => {
  const data : fileProcessingData = job.data;

  await db.updateUnprocessedInvoice(data.fileName, {currentProcessingStatus: "PROCESSING"})

  //send file to get processed by azure, then save extracted data to database. Also update status.
  // ### UNCOMMENT BELOW IN PROD. KEEPING COSTS DOWN BY NOT INCLUDING THIS IN DEV FOR NOW###
  // const extractedData = await processDocumentData(data.fileName);
  // console.log(extractedData);

  // const storeUnprocessedInvoice = await db.updateUnprocessedInvoice(data.fileName, {currentProcessingStatus: "SAVING" , ...extractedData});

  // //send file to s3 after processing is finished.
  const filePath = path.join(__dirname, "../../uploads/", data.fileName);
  // const s3Response = await uploadFile(data.fileName, filePath, storeUnprocessedInvoice.mimeType);
  await fs.promises.unlink(filePath);

  // return s3Response;
  console.log(`Dev Build, Processed: ${data.fileName}`)
},
{
  connection,
  concurrency: 1,
  limiter: {max: 1, duration: 3000},}
);

fileProcessor.on('completed', async (job: Job, _returnValue: any) => {
  const data : fileProcessingData = job?.data;
  await db.updateUnprocessedInvoice(data.fileName, {currentProcessingStatus: "COMPLETED"});
})

fileProcessor.on('failed', async (job: Job | undefined, error: Error, _prev: string) => {
  const data : fileProcessingData = job?.data;
  await db.updateUnprocessedInvoice(data.fileName, {currentProcessingStatus: "FAILED"});
  console.error(error.message);
});


//error listener to avoid NodeJS raising an unhandled exception when an error occurs.
fileProcessor.on('error', err => {
  // log the error
  console.error(err);
});

// example of what we can have running on a dedicated queueEvent listener process
// fileProcessor.on('progress', async (job: Job, progress: JobProgress) => {
//   const data : fileProcessingData = job.data;
//   const updateProcessingStatus = await db.updateUnprocessedInvoice(data.fileName, {currentProcessingStatus: progress.toString()});
// });

//graceful shutdown logic
const shutdown = async (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);

  try {
    //stop taking new jobs and wait for current jobs to finish
    await fileProcessor.close();
    console.log('Worker closed.');

    //close Redis connection
    await connection.quit();
    console.log('Redis connection closed.');

    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

// Handle SIGINT (Ctrl+C) and SIGTERM (e.g., Docker stop)
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

//fileProcessor.run();

