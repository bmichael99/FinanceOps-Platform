import {Queue} from "bullmq"; 


export const fileQueue = new Queue('FileProcessing', {
  connection: {
    host: "192.168.0.206",
    port: 6379,
  },
});


