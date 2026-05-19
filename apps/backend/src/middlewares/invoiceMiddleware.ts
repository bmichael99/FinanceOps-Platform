import { NextFunction, Request, Response } from "express";
import * as db from "../repositories/userRepository"


const INVOICE_LIMIT = Number(process.env.INVOICE_LIMIT ?? 5);

export async function checkInvoiceLimits(req: Request, res: Response, next: NextFunction){
    if(req.user!.role === "ADMIN") return next();

    //call db to check how many files this user has, and pass false to block download of files if limits are exceeded.
    try{
      //TODO: update this to include a where filter for whether the invoice is test-data or a usercreated invoice, 
      //maybe should make a new invoice type for whether the invoice is: 1. created on site, 2. external and processed on site, or 3. test data.
      const invoiceCount = await db.getTotalUploadedInvoicesByUserId(req.user!.id);
      //5 is the invoice limit if .env var is not set
      if (invoiceCount >= INVOICE_LIMIT){
        return res.status(403).json({message: "Upload limit reached"});
      }
      req.totalInvoiceCount = invoiceCount;
      next();
    } catch(err){
      next(err);
    }
}