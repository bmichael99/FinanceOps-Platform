import { createWorker } from "./fileProcessor";
import { type fileProcessingData } from '../controllers/invoiceController';
import {type Job, JobProgress} from 'bullmq';
import * as db from "../repositories/invoiceRepository";

const {fileProcessor, connection, publisher} = createWorker();

fileProcessor.on('completed', async (job: Job, _returnValue: any) => {
  const data : fileProcessingData = job?.data;
  await db.updateInvoice(data.userId, data.fileName, {currentProcessingStatus: "COMPLETED"});
})

fileProcessor.on('failed', async (job: Job | undefined, error: Error, _prev: string) => {
  const data : fileProcessingData = job?.data;
  await db.updateInvoice(data.userId, data.fileName, {currentProcessingStatus: "FAILED"});
  console.error(error.message);
});

fileProcessor.on('progress', async (job: Job, progress: JobProgress) => {
  const data : fileProcessingData = job?.data;
  // const res = getClient(data.userId);

  const payload: fileProcessingData = {userId: data.userId, fileName: data.fileName, originalFileName: data.originalFileName, uploadTime: data.uploadTime, status: progress};
  await publisher.publish("FileProcessing", JSON.stringify(payload));
});


//error listener to avoid NodeJS raising an unhandled exception when an error occurs.
fileProcessor.on('error', err => {
  // log the error
  console.error(err);
});

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