import dotenv from 'dotenv';
dotenv.config();
import prisma from "./prisma";
import {InvoiceTable} from "../generated/prisma"
import {UnprocessedInvoiceTable} from "../generated/prisma"
import { Prisma } from '../generated/prisma'

export const createInvoice = async (invoiceData : Prisma.InvoiceCreateInput) => {
    
    const invoice = await prisma.invoice.create({
      data: {
        ...invoiceData,
      },
    });

    return invoice;
}

export const createUnprocessedInvoice = async (unprocessedInvoiceData : Prisma.UnprocessedInvoiceCreateInput) => {
    const unprocessedInvoice = await prisma.unprocessedInvoice.create({
      data: {
        ...unprocessedInvoiceData,
      },
    });

    return unprocessedInvoice;
}

export const updateInvoice = async (fileName : string, invoiceData : Prisma.InvoiceUpdateInput) => {

    const invoice = await prisma.invoice.update({
      where: {fileName},
      data: invoiceData,
    });

    return invoice;
  
}

export const updateUnprocessedInvoice = async (fileName : string, unprocessedInvoiceData : Prisma.UnprocessedInvoiceUpdateInput) => {

    const unprocessedInvoice = await prisma.unprocessedInvoice.update({
      where: {fileName},
      data: unprocessedInvoiceData,
    });

    return unprocessedInvoice;
  
}

export const createInvoiceTable = async ({name, invoiceTableDataAsMarkdown, rowCount, columnCount, invoiceId} : InvoiceTable) => {

    const invoiceTable = await prisma.invoiceTable.create({
    data: {name, invoiceTableDataAsMarkdown, rowCount, columnCount, invoiceId}
  });

  return invoiceTable

}

export const createUnprocessedInvoiceTable = async ({name, invoiceTableDataAsMarkdown, rowCount, columnCount, invoiceId} : UnprocessedInvoiceTable) => {

    const unprocessedInvoiceTable = await prisma.unprocessedInvoiceTable.create({
    data: {name, invoiceTableDataAsMarkdown, rowCount, columnCount, invoiceId}
  });

  return unprocessedInvoiceTable

}

export const getAllInvoices = async() => {
  const invoices = await prisma.invoice.findMany({
    include: {
      invoiceTables: true,
    }
  })

  return invoices;
}

export const getAllUnprocessedInvoices = async() => {
  const unprocessedInvoices = await prisma.unprocessedInvoice.findMany();

  return unprocessedInvoices;
}

export const getAllUnprocessedInvoicesFileNames = async() => {
  const unprocessedInvoices = await prisma.unprocessedInvoice.findMany({
    select: {
      fileName: true,
    }
  });

  return unprocessedInvoices;
}

export const getUnprocessedInvoiceByFileName = async(fileName : string) => {
  const unprocessedInvoice = await prisma.unprocessedInvoice.findUnique({
    where:{
      fileName
    }
  });

  return unprocessedInvoice;
}

export const findInvoiceWithFileName = async(fileName : string) =>{
  const invoice = await prisma.invoice.findUnique({
    where: {
      fileName,
    },
  });

  return invoice;
}

export const findUnprocessedInvoiceWithFileName = async(fileName : string) =>{
  const unprocessedInvoice = await prisma.unprocessedInvoice.findUnique({
    where: {
      fileName,
    },
  });

  return unprocessedInvoice;
}

export const getAllInvoicesByProjectName = async(projectName : string) => {
    const invoices = await prisma.invoice.findMany({
      where: {projectName}
    })

    return invoices;
}

export const getAllInvoicesIncludingTablesByProjectName = async(projectName : string) => {
    const invoices = await prisma.invoice.findMany({
      where: {projectName},
      include: {invoiceTables: true}
    })

    return invoices;
}


export const deleteUnprocessedInvoiceByFileName = async(fileName : string) => {

    const unprocessedInvoice = await prisma.unprocessedInvoice.delete({
      where: {fileName}
    })

    return unprocessedInvoice;
}