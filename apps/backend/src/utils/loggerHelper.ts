import pino from "pino"
import logger from "../config/logger"

interface Log {
  userId: number,
  description: string,
  level: pino.Level,
  err?: Error
}



function log({userId, description, level, err} : Log){
  logger[level]({userId, err}, description);
}

(() => log({userId: 10, description: "wow", level: "warn"}))();

export default log