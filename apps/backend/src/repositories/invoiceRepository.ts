import dotenv from 'dotenv';
dotenv.config();
import prisma from "../config/prisma";
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

export const updateInvoice = async (fileName : string, invoiceData : Prisma.InvoiceUpdateInput) => {

    const invoice = await prisma.invoice.update({
      where: {fileName},
      data: invoiceData,
    });

    return invoice;
  
}

export const createInvoiceTable = async ({name, invoiceTableDataAsMarkdown, rowCount, columnCount, invoiceId} : InvoiceTable) => {

    const invoiceTable = await prisma.invoiceTable.create({
    data: {name, invoiceTableDataAsMarkdown, rowCount, columnCount, invoiceId}
  });

  return invoiceTable

}

export const getAllInvoices = async() => {
  const invoices = await prisma.invoice.findMany({
    include: {
      invoiceTables: true,
    }
  })

  return invoices;
}

export const findInvoiceWithFileName = async(fileName : string) =>{
  const invoice = await prisma.invoice.findUnique({
    where: {
      fileName,
    },
  });

  return invoice;
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