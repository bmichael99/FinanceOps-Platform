// import bcrypt from 'bcryptjs';
// import passport from "passport";
// import * as db from "../repositories/userRepository"
import dotenv from 'dotenv';
import { Request, Response } from 'express';


dotenv.config();

export const showHomePage = (_req : Request, res : Response) => {
  res.render('index', {title: 'Express Template!'});
};

export const healthCheck = (_req : Request, res : Response) => {
  res.sendStatus(200);
};