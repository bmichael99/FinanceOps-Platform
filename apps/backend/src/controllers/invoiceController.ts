import * as db from "../repositories/invoiceRepository";
import {Request, Response} from "express";
import {type InvoiceTableData, type InvoiceDashboardSummaryType, InvoiceDailyChartData} from "@finance-platform/types"
import { fileQueue } from "../config/redis";
import { FileStatus, Invoice, ProcessingStatus, type FileResponseType,type FileStatusType } from "@finance-platform/types";
import { addClient, deleteClient, getClient } from "../utils/clientHandler";
import { delay } from "../utils/delay";
import IORedis from 'ioredis';
import { JobProgress } from "bullmq";
import { type InvoiceFindManyType, type InvoiceFindUniqueType } from "../repositories/invoiceRepository";
import { Prisma } from "../generated/prisma";
import * as z from "zod";
import { shapeFull, shapeSummary, shapeCustom } from "../utils/invoiceShapers";
import dotenv from 'dotenv';
import * as s3 from "../integrations/S3AWS";
import { asyncHandler } from "../utils/asyncHandler";
import { invoiceFormSchema, InvoiceFormType } from "@finance-platform/schemas";
import prisma from "../config/prisma";
import { getLastInvoiceSumsGroupedByMonth } from "../services/invoiceService";
dotenv.config();

export interface fileProcessingData {
    userId: number,
    fileName: string,
    originalFileName: string,
    uploadTime: Date,
    status: JobProgress,
}

const redis = new IORedis({ host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT), maxRetriesPerRequest: null  });
const redisCache = new IORedis({ host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT), maxRetriesPerRequest: null  });

redis.subscribe("FileProcessing", (err, count) => {
  if (err) {
    console.error("Failed to subscribe: %s", err.message);
  } else {
    console.log(
      `Subscribed successfully! This client is currently subscribed to ${count} channels.`
    );
  }
});

redis.on("message", (_channel, message) => {
  const data: fileProcessingData = JSON.parse(message);
  const res = getClient(data.userId);

  const event = "fileStatus";

  //format response in the proper Event stream format
  if(res)
    res.write(`event: ${event}\ndata: ${message}\n\n`);

  // console.log(`Received ${message} from ${channel}`);
});

export async function createInvoice(req : Request, res : Response) { 
  const files = req.files as Express.Multer.File[];
  const clientIds = Array.isArray(req.body.clientIds) ? req.body.clientIds : [req.body.clientIds];

  if(!files || files.length == 0){
    return res.status(400).json("No files submitted. That shouldn't even be possible.");
  }


  const results = await Promise.allSettled(files?.map((file : Express.Multer.File) => 
    db.createInvoice({user: { connect: { id: req.user!.id } },fileName: file.filename, originalFileName: file.originalname, mimeType: file.mimetype, filePath: file.path, currentProcessingStatus: 'PENDING'})
  ))

  await delay(3000);

  const fileResponse: FileResponseType[] = [];

  for(const [i,result] of results.entries()) {
    if(result.status == "fulfilled"){
      try{
        const fileData : fileProcessingData = {fileName: files[i].filename, userId: req.user!.id, originalFileName: files[i].originalname, uploadTime: result.value.createdAt, status: "PENDING"};
        await fileQueue.add(files[i].filename, fileData, {removeOnComplete: true, removeOnFail: 25, attempts: 3, backoff: {type: "exponential", delay: 3000}}); 
        fileResponse.push({clientID: clientIds[i], fileName: files[i].filename, originalFileName: files[i].originalname, uploadTime: result.value.createdAt,status: "PENDING"})
      }
      catch(queueErr) {
        fileResponse.push({clientID: clientIds[i], fileName: files[i].filename, originalFileName: files[i].originalname, uploadTime: result.value.createdAt, status: "FAILED", error: `Queueing failed: ${queueErr}`})
        console.error("Some invoices failed to enqueue: ", {fileName: files[i].filename, originalFileName: files[i].originalname, status: "FAILED", error: `Queueing failed: ${queueErr}`});
      }
    } else {
      fileResponse.push({clientID: clientIds[i], fileName: files[i].filename, originalFileName: files[i].originalname, uploadTime: new Date(), status: "FAILED", error: String(result.reason)})
      console.error("Some invoices failed to be saved to db: ", {fileName: files[i].filename, originalFileName: files[i].originalname, status: "FAILED", error: String(result.reason)});
    }
  }

  res.status(200).json(fileResponse);
}

export async function invoiceEvents(req: Request, res : Response){
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  //set the users response object based on their userId, this is so workers can have access to the response object for sending updates to the client.
  addClient(req.user!.id, res);
  
  req.on("close", () => {
    deleteClient(req.user!.id);
  });
}


/**
 * Query Parameter options: 
 * since: Date object that's received as a string, returns all invoices greater than or equal to the date time provided. ex: ?since=new Date(Date.now() - 1000*60*60*24) will return invoices within the last 24 hours
 * status: currentProcessingStatus filter, this is defined by the FileStatusType in the shared types. Current options are: UPLOADING, PENDING, PROCESSING, SAVING, COMPLETED, FAILED
 * view: sets the shape of the return data, determining what data is returned. Current options are summary: returns invoices as FileResponseType[] (shared type which includes fileName, originalFileName, status, and uploadTime(createdAt)). full: returns invoices as Invoice[] (all data returned by db, the full model for invoice). custom: returns the specified fields in fields query param only.
 * fields: Input as comma seperated values. If view type is set to custom then this endpoint will only return the specified fields. Possible fields reflect the prisma model. ex: ?fields=originalFileName,fileName,mimeType
 * verified: whether the invoice has been verified by a user or not through the verify UI.
 */ 
export async function getInvoices(req: Request, res: Response){
  //define zod schema for parsing query params. This allows us to validate our query params.
  console.log(req.query);
  const QueryParamsSchema = z.object({
    since: z.string().optional(),
    status: z.enum(Object.keys(FileStatus)).optional(),
    verified: z.string().transform((s) => {
      if(s == "true") return true;
      if(s == "false") return false;
    }).optional(),
    view: z.enum(["SUMMARY", "FULL", "CUSTOM"]).optional(),
    fields: z.string().optional(),
  })
  const result = QueryParamsSchema.safeParse(req.query);
  if(!result.success){
    res.status(400).json({message: "Invalid params"});
    return;
  }

  //extract query params from parsed params.
  const {since, status, view, fields, verified} = result.data;

  //validate fields
  const FieldsSchema = z.array(z.enum(Prisma.InvoiceScalarFieldEnum));
  const fieldsListParse = FieldsSchema.safeParse(fields?.split(",") ?? []);

  if(!fieldsListParse.success){
    res.status(400).json({message: "Invalid fields"});
    return;
  }
  const fieldsList = fieldsListParse.data;
  
  //set filters
  const filters: InvoiceFindManyType['where'] = { userId: req.user!.id };
  if (since) filters.createdAt = { gte: new Date(since) };
  if (status) filters.currentProcessingStatus = status as ProcessingStatus;
  if (verified !== undefined) filters.verificationStatus = verified ? "VERIFIED" : "UNVERIFIED";

  //query the db with filters
  const invoices = await db.getAllInvoicesWithFilters({where: filters});
  if(!invoices){
    return res.sendStatus(404); //not found
  }

  //define our response and apply view (shape of the result object)
  type ResponseType = FileResponseType[] | Invoice[];
  let response : ResponseType;
  switch(view){
    case("SUMMARY"):
    response = invoices.map((invoice) => shapeSummary(invoice))
    break;
    case("CUSTOM"):
    response = invoices.map((invoice) => shapeCustom(invoice, fieldsList));
    break;
    case("FULL"):
    default:
    response = invoices;
    break;
  }

  res.status(200).json(response)
}

export const getInvoice = asyncHandler(async (req: Request, res: Response) => {
//get invoiceId from URL param
  const paramSchema = z.object({
    invoiceId: z.string(),
  });
  const result = paramSchema.safeParse(req.params);
  if(!result.success){
    return res.status(400).json({ message: "Invalid invoiceId", error: result.error });
  }
  const { invoiceId } = result.data;

//get query params and apply filters to db request
  const QueryParamsSchema = z.object({
    since: z.string().optional(),
    status: z.enum(Object.keys(FileStatus)).optional(),
    verified: z.string().transform((s) => {
      if(s == "true") return true;
      if(s == "false") return false;
    }).optional(),
  })
  const QuerySchemaResult = QueryParamsSchema.safeParse(req.query);
  if(!QuerySchemaResult.success){
    res.status(400).json({message: "Invalid params"});
    return;
  }
  //extract query params from parsed params.
  const {since, status, verified} = QuerySchemaResult.data;
  //set filters
  const filters: InvoiceFindUniqueType['where'] = { userId: req.user!.id, fileName: invoiceId};
  if (since) filters.createdAt = { gte: new Date(since) };
  if (status) filters.currentProcessingStatus = status as ProcessingStatus;
  if (verified !== undefined) filters.verificationStatus = verified ? "VERIFIED" : "UNVERIFIED";

//query the db with filters
  const invoiceData = await db.getInvoiceWithFilters({where: filters});
  if(!invoiceData){
    return res.sendStatus(404); //not found
  }
  return res.status(200).json(invoiceData);
})

export const getS3SignedURL = asyncHandler(async (req: Request, res: Response) => {
  const invoiceId = req.params.invoiceId;
  if(!invoiceId){
    return res.sendStatus(400); //bad request
  }

  //verify that this resource belongs to this user before modifying
  const data = await db.getuserIdByInvoiceId(invoiceId);
  const userId = data?.userId;
  if(!data){ //could not find invoice, return 404 not found
    return res.sendStatus(404);
  }
  if(req.user!.id != userId){
    return res.sendStatus(403); //403 foribdden
  }

  const cachedURL = await redisCache.get(invoiceId);
  //if url is cached, return url.
  if(cachedURL){
    return res.status(200).json({signedURL: cachedURL, wasCached: true});
  }
  const signedURL = await s3.getSignedURL(invoiceId);
  //cache signed URL and expire it after 15 minutes, our aws is set to expire links after 16 minutes
  await redisCache.set(invoiceId, signedURL, 'EX', 900);
  
  if(signedURL){
    res.status(200).json({signedURL, wasCached: false});
  } else{
    res.sendStatus(404);
  }
})

//takes updated invoice data from the user after manual verification of extracted data, update invoice table, mark invoice as verified.
export const verifyInvoice = asyncHandler(async (req: Request, res: Response) => {
  const invoiceFormResult = invoiceFormSchema.safeParse(req.body);
  if(!invoiceFormResult.success){
    return res.sendStatus(400).json({message: "Failed to parse the data received.", error: invoiceFormResult.error});
  }
  const invoiceFormData = invoiceFormResult.data;

  //convert data from front-end to fit back-end prisma model. We use dates on the front-end to make sure input is valid but need to convert back to strings on the back-end
  const updatedData: Pick<Invoice, keyof InvoiceFormType> = {
    CustomerAddress: invoiceFormData.CustomerAddress ?? null,
    DueDate: invoiceFormData.DueDate ?? null,
    CustomerName: invoiceFormData.CustomerName,
    InvoiceDate: invoiceFormData.InvoiceDate,
    InvoiceId: invoiceFormData.InvoiceId,
    InvoiceTotal: invoiceFormData.InvoiceTotal ?? null,
    VendorAddress: invoiceFormData.VendorAddress ?? null,
    VendorName: invoiceFormData.VendorName,
    invoiceType: invoiceFormData.invoiceType,
    paymentStatus: invoiceFormData.paymentStatus,
  }

  const paramSchema = z.object({
    invoiceId: z.string(),
  });
  const paramResult = paramSchema.safeParse(req.params);
  if(!paramResult.success){
    return res.status(400).json({ message: "Invalid invoiceId", error: paramResult.error });
  }
  const { invoiceId } = paramResult.data;

  //verify that this resource belongs to this user before modifying
  const data = await db.getuserIdByInvoiceId(invoiceId);
  const userId = data?.userId;
  if(!userId){ //could not find invoice, return 404 not found
    return res.sendStatus(404);
  }
  if(req.user!.id != userId){
    return res.sendStatus(403); //403 foribdden
  }

  const finishedInvoice = await db.updateInvoice(req.user!.id, invoiceId, {...updatedData, verificationStatus: "VERIFIED"});

  res.status(200).json(finishedInvoice);
})

export async function getInvoiceTableData(req: Request, res: Response){
  const invoiceSelect: Record<keyof InvoiceTableData, true> = {
    fileName: true,
    originalFileName: true,
    InvoiceDate: true,
    InvoiceTotal: true,
    InvoiceId: true,
    DueDate: true,
  };
  
  const tableData = await db.getAllInvoicesWithFilters({where: {userId: req.user!.id, verificationStatus: "VERIFIED"}, select: invoiceSelect})
  if(!tableData){
    return res.sendStatus(404);
  }
  res.status(200).json(tableData);
}

export async function deleteInvoice(req: Request, res: Response) {
  const paramsSchema = z.object({
    invoiceId: z.string()
  })

  const paramsParse = paramsSchema.safeParse(req.params);

  if(!paramsParse.success){
    return res.status(400).json({message: "Invalid invoiceId", error: paramsParse.error})
  }

  const {invoiceId} = paramsParse.data;

  //verify that this resource belongs to this user before modifying
  const data = await db.getuserIdByInvoiceId(invoiceId);
  const userId = data?.userId;
  if(!data){ //could not find invoice, return 404 not found
    return res.sendStatus(404);
  }
  if(req.user!.id != userId){
    return res.sendStatus(403); //403 foribdden
  }

  await db.deleteInvoiceByInvoiceId(invoiceId);
  return res.sendStatus(200);
}

// export async function deleteManyInvoices(req: Request, res: Response) {
//   //use query params with a list of invoiceIds
//   console.log("hello!");
//   const paramsSchema = z.object({
//     invoiceId: z.string()
//   })

//   const paramsParse = paramsSchema.safeParse(req.params);

//   if(!paramsParse.success){
//     return res.status(400).json({message: "Invalid invoiceId", error: paramsParse.error})
//   }

//   const {invoiceId} = paramsParse.data;

//   await db.deleteInvoiceByInvoiceId(invoiceId);
//   return res.sendStatus(200);
// }

export async function getInvoiceDashboardSummary(req: Request, res: Response) {
  const currDate = new Date();
  const totalVerifiedInvoices = await db.getInvoiceCountWithFilters({where: {userId: req.user!.id, verificationStatus: "VERIFIED"}});
  const totalUnverifiedInvoices = await db.getInvoiceCountWithFilters({where: {userId: req.user!.id, verificationStatus: "UNVERIFIED"}});
  
  if(!totalVerifiedInvoices && !totalUnverifiedInvoices){
    return res.sendStatus(404); //not found
  }
  const totalInvoices: InvoiceDashboardSummaryType['totalInvoices'] = {unverified: totalUnverifiedInvoices, verified: totalVerifiedInvoices}
  const next7daysCount = await db.getInvoiceCountWithFilters({where: {userId: req.user!.id, DueDate: {gte: currDate, lte: new Date(currDate.getTime() + 7*24*60*60*1000)}, verificationStatus: "VERIFIED", paymentStatus: "UNPAID", invoiceType: "ACCOUNTS_PAYABLE"}});
  const next30daysCount = await db.getInvoiceCountWithFilters({where: {userId: req.user!.id, DueDate: {gte: currDate, lte: new Date(currDate.getTime() + 30*24*60*60*1000)}, verificationStatus: "VERIFIED", paymentStatus: "UNPAID", invoiceType: "ACCOUNTS_PAYABLE"}});

  const next7daysDue = await db.getAllInvoicesUsingAggregate({
    where: {userId: req.user!.id, DueDate: {gte: currDate, lte: new Date(currDate.getTime() + 7*24*60*60*1000)}, verificationStatus: "VERIFIED", paymentStatus: "UNPAID", invoiceType: "ACCOUNTS_PAYABLE"},
    _sum: {
      InvoiceTotal: true,
    }
  });
  const next30daysDue = await db.getAllInvoicesUsingAggregate({
    where: {userId: req.user!.id, DueDate: {gte: currDate, lte: new Date(currDate.getTime() + 30*24*60*60*1000)}, verificationStatus: "VERIFIED", paymentStatus: "UNPAID", invoiceType: "ACCOUNTS_PAYABLE"},
    _sum: {
      InvoiceTotal: true,
    }
  });

  const pastDueCount = await db.getInvoiceCountWithFilters({where: {userId: req.user!.id, DueDate: {lt: currDate}, verificationStatus: "VERIFIED", paymentStatus: "UNPAID", invoiceType: "ACCOUNTS_PAYABLE"}});
  const pastDueAmount = await db.getAllInvoicesUsingAggregate({
    where: {userId: req.user!.id, DueDate: {lt: currDate}, verificationStatus: "VERIFIED", paymentStatus: "UNPAID", invoiceType: "ACCOUNTS_PAYABLE"},
    _sum: {
      InvoiceTotal: true,
    }
  });

  //TODO: add in a date paid for these. Even though there's a due date it doesn't mean the payment was made on that due date.
  const mtdRevenue = await db.getAllInvoicesUsingAggregate({
    where: {userId: req.user!.id, DueDate: {gte: new Date(Date.UTC(currDate.getFullYear(),currDate.getMonth(),1,0,0,0,0))}, verificationStatus: "VERIFIED", paymentStatus: "PAID", invoiceType: "ACCOUNTS_RECEIVABLE"},
    _sum: {
      InvoiceTotal: true,
    }
  });

  const mtdRevenueOwed = await db.getAllInvoicesUsingAggregate({
    where: {userId: req.user!.id, DueDate: {gte: new Date(Date.UTC(currDate.getFullYear(),currDate.getMonth(),1,0,0,0,0))}, verificationStatus: "VERIFIED", paymentStatus: "UNPAID", invoiceType: "ACCOUNTS_RECEIVABLE"},
    _sum: {
      InvoiceTotal: true,
    }
  });

  const mtdExpenditure = await db.getAllInvoicesUsingAggregate({
    where: {userId: req.user!.id, DueDate: {gte: new Date(Date.UTC(currDate.getFullYear(),currDate.getMonth(),1,0,0,0,0))}, verificationStatus: "VERIFIED", paymentStatus: "PAID", invoiceType: "ACCOUNTS_PAYABLE"},
    _sum: {
      InvoiceTotal: true,
    }
  });

  const totalRevenue = await db.getAllInvoicesUsingAggregate({
    where: {userId: req.user!.id, verificationStatus: "VERIFIED", paymentStatus: "PAID", invoiceType: "ACCOUNTS_RECEIVABLE"},
    _sum: {
      InvoiceTotal: true,
    }
  });

  const totalRevenueOwed = await db.getAllInvoicesUsingAggregate({
    where: {userId: req.user!.id, verificationStatus: "VERIFIED", paymentStatus: "UNPAID", invoiceType: "ACCOUNTS_RECEIVABLE"},
    _sum: {
      InvoiceTotal: true,
    }
  });

  const totalExpenditure = await db.getAllInvoicesUsingAggregate({
    where: {userId: req.user!.id, verificationStatus: "VERIFIED", paymentStatus: "PAID", invoiceType: "ACCOUNTS_PAYABLE"},
    _sum: {
      InvoiceTotal: true,
    }
  });

  const totalExpenditureDue = await db.getAllInvoicesUsingAggregate({
    where: {userId: req.user!.id, verificationStatus: "VERIFIED", paymentStatus: "UNPAID", invoiceType: "ACCOUNTS_PAYABLE"},
    _sum: {
      InvoiceTotal: true,
    }
  });


  const invoiceDashboardData: InvoiceDashboardSummaryType = {
    totalInvoices,
    upcoming : {
      next7days: {
        count: next7daysCount,
        amountDue: next7daysDue._sum?.InvoiceTotal ?? 0
      },
      next30days: {
        count: next30daysCount,
        amountDue: next30daysDue._sum?.InvoiceTotal ?? 0,
      }
    },
    past:{
      count: pastDueCount,
      amountDue: pastDueAmount._sum?.InvoiceTotal ?? 0,
    },
    revenue:{
      last30Days: {
        amount: 0, 
        amountOwed: 0
      },
      MTD: {
        amount: mtdRevenue._sum?.InvoiceTotal ?? 0, 
        amountOwed: 0
      },
      last365Days: {
        amount: 0, 
        amountOwed: 0
      },
      YTD: {
        amount: 0, 
        amountOwed: 0
      },
      total: {
        amount: totalRevenue._sum?.InvoiceTotal ?? 0, 
        amountOwed: totalRevenueOwed._sum?.InvoiceTotal ?? 0,
      },
    },
    expenditure: {
      last30Days: {
        amount: 0, 
        amountDue: 0
      },
      MTD: {
        amount: 0, 
        amountDue: 0
      },
      last365Days: {
        amount: 0, 
        amountDue: 0
      },
      YTD: {
        amount: 0, 
        amountDue: 0
      },
      total: {
        amount: totalExpenditure._sum?.InvoiceTotal ?? 0, 
        amountDue: totalExpenditureDue._sum?.InvoiceTotal ?? 0
      },
    },
    profit: {
      last30Days: {
        amount: 0, 
        projected: 0
      }, //projected = (revenue.amount + revenue.amountOwed) - (expenditure.amount + expenditure.amountDue)
      MTD: {
        amount: (mtdRevenue._sum?.InvoiceTotal ?? 0) - (mtdExpenditure._sum?.InvoiceTotal ?? 0),
        projected: 0,
      },
      last365Days: {
        amount: 0, 
        projected: 0,
      },
      YTD: {
        amount: 0, 
        projected: 0,
      },
      total: {
        amount: (totalRevenue._sum?.InvoiceTotal ?? 0) - (totalExpenditure._sum?.InvoiceTotal ?? 0), 
        projected: ((totalRevenue._sum?.InvoiceTotal ?? 0) + (totalRevenueOwed._sum?.InvoiceTotal ?? 0))- ((totalExpenditure._sum?.InvoiceTotal ?? 0) + (totalExpenditureDue._sum?.InvoiceTotal ?? 0)),
      },
    },
    chartData: {
      last6Months: await getLastInvoiceSumsGroupedByMonth({monthCount: 6, userId: req.user!.id}), //just return all months and sort them by ranges in the front-end in the future.
    }
    };
  return res.json(invoiceDashboardData)
}