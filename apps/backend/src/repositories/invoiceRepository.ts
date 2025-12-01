import dotenv from 'dotenv';
dotenv.config();
import prisma from "../config/prisma";
import { Prisma } from '../generated/prisma'

export type InvoiceFindManyType = Prisma.InvoiceFindManyArgs;

export const createInvoice = async (invoiceData : Prisma.InvoiceCreateInput) => {
    
    const invoice = await prisma.invoice.create({
      data: {
        ...invoiceData,
      },
    });

    return invoice;
}

export const updateInvoice = async (userId: number, fileName : string, invoiceData : Prisma.InvoiceUpdateInput) => {

    const invoice = await prisma.invoice.update({
      where: {fileName, userId},
      data: invoiceData,
    });

    return invoice;
  
}

export const getAllInvoices = async() => {
  const invoices = await prisma.invoice.findMany()

  return invoices;
}

export const getAllInvoicesWithFilters = async(filters: Prisma.InvoiceFindManyArgs) => {
  const invoices = await prisma.invoice.findMany(filters);

  return invoices;
}

export const getInvoiceWithFileName = async(userId: number, fileName : string) =>{
  const invoice = await prisma.invoice.findUnique({
    where: {
      fileName,
      userId,
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
    })

    return invoices;
}

export const deleteInvoiceByInvoiceId = async (invoiceId : string) => {
  const invoice = await prisma.invoice.delete({
    where: {fileName : invoiceId}
  })

  return invoice;
}

export const getuserIdByInvoiceId = async (invoiceId : string) => {
  const invoice = await prisma.invoice.findUnique({
    where: {fileName : invoiceId},
    select: {userId: true}
  })

  return invoice;
}