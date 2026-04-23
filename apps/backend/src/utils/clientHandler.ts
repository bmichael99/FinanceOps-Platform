import { Response } from "express";

//in memory session store hashmap <userId, responseObject>
const clientList: Record<number,Response> = {};

export const addClient = (userId: number, res: Response) => {
  clientList[userId] = res;
  return clientList[userId];
}

export const deleteClient = (userId: number) => {
  delete clientList[userId];
}

export const getClient = (userId: number) => {
  return clientList[userId];
}

//for restarts
export const closeAllConnections = () => {
  for(const [userId,res] of Object.entries(clientList)){
    // res.setHeader('Connection', 'close'); //tell the client to not reconnect, but we should probably let the client automatically reconnect.
    res.end();
  }//
}
