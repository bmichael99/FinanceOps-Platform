import {Queue} from "bullmq"; 
import dotenv from 'dotenv';
dotenv.config();

export const fileQueue = new Queue('FileProcessing', {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});


