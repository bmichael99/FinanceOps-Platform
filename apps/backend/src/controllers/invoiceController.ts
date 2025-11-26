import * as db from "../repositories/invoiceRepository";
import prisma from "../config/prisma";
import {Request, Response} from "express";
import {type InvoiceTableData} from "@finance-platform/types"
import * as z from "zod";
import { delay } from "../utils/delay";

export async function getInvoices(_req: Request, _res: Response){

}

export async function getInvoiceTableData(req: Request, res: Response){
  const invoiceSelect: Record<keyof InvoiceTableData, true> = {
    fileName: true,
    originalFileName: true,
    InvoiceDate: true,
    InvoiceTotal: true,
    InvoiceId: true,
  };
  
  const tableData = await db.getAllInvoicesWithFilters({where: {userId: req.user?.id}, select: invoiceSelect})

  res.status(200).json(tableData);
}

export async function deleteInvoice(req: Request, res: Response) {
  console.log("hello!");
  const paramsSchema = z.object({
    invoiceId: z.string()
  })

  const paramsParse = paramsSchema.safeParse(req.params);

  if(!paramsParse.success){
    return res.status(400).json({message: "Invalid invoiceId", error: paramsParse.error})
  }

  const {invoiceId} = paramsParse.data;

  await db.deleteInvoiceByInvoiceId(invoiceId);
  return res.sendStatus(200);
}

export async function deleteManyInvoices(req: Request, res: Response) {
  //use query params with a list of invoiceIds
  console.log("hello!");
  const paramsSchema = z.object({
    invoiceId: z.string()
  })

  const paramsParse = paramsSchema.safeParse(req.params);

  if(!paramsParse.success){
    return res.status(400).json({message: "Invalid invoiceId", error: paramsParse.error})
  }

  const {invoiceId} = paramsParse.data;

  await db.deleteInvoiceByInvoiceId(invoiceId);
  return res.sendStatus(200);
}