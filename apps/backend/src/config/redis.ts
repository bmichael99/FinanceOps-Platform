import {Queue} from "bullmq"; 
import dotenv from 'dotenv';
import Redis from 'ioredis'
dotenv.config();

export const fileQueue = new Queue('FileProcessing', {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

export const redis = new Redis({ host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT), maxRetriesPerRequest: null  });