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