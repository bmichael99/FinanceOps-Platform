import pino from "pino";
import dotenv from 'dotenv';
dotenv.config();

const transport = pino.transport({
  targets: [
    // {
    //   target: 'pino/file',
    //   options: {destination: './logs/output.log', mkdir: true},
    //   level: "warn",
    // },
    {
      target: 'pino-pretty',
      options: {destination: process.stdout.fd},
      level: "warn",
    },
  ]

});

const logger = pino({
  level: process.env.NODE_ENV == "dev" ? "info" : "warn",
}, transport);



export default logger;