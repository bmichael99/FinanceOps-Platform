import dotenv from 'dotenv';
dotenv.config();
import prisma from "../config/prisma";
import {type UnprocessedInvoiceTable} from "../generated/prisma"
import { Prisma } from '../generated/prisma'

export type UnprocessedInvoiceFindManyType = Prisma.UnprocessedInvoiceFindManyArgs;

export const createUnprocessedInvoice = async (unprocessedInvoiceData : Prisma.UnprocessedInvoiceCreateInput) => {
    const unprocessedInvoice = await prisma.unprocessedInvoice.create({
      data: {
        ...unprocessedInvoiceData,
      },
    });
    return unprocessedInvoice;
}

export const updateUnprocessedInvoice = async (fileName : string, unprocessedInvoiceData : Prisma.UnprocessedInvoiceUpdateInput) => {
    const unprocessedInvoice = await prisma.unprocessedInvoice.update({
      where: {fileName},
      data: unprocessedInvoiceData,
    });
    return unprocessedInvoice;
}

export const createUnprocessedInvoiceTable = async ({name, invoiceTableDataAsMarkdown, rowCount, columnCount, invoiceId} : UnprocessedInvoiceTable) => {
    const unprocessedInvoiceTable = await prisma.unprocessedInvoiceTable.create({
    data: {name, invoiceTableDataAsMarkdown, rowCount, columnCount, invoiceId}
  });
  return unprocessedInvoiceTable
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

export const findUnprocessedInvoiceWithFileName = async(fileName : string) =>{
  const unprocessedInvoice = await prisma.unprocessedInvoice.findUnique({
    where: {
      fileName,
    },
  });

  return unprocessedInvoice;
}

export const deleteUnprocessedInvoiceByFileName = async(fileName : string) => {

    const unprocessedInvoice = await prisma.unprocessedInvoice.delete({
      where: {fileName}
    })

    return unprocessedInvoice;
}

export const getManyUnprocessedInvoicesWithFilters = async (filters: UnprocessedInvoiceFindManyType) => {
  /**
   * pass in object with args such as where: orderBy: take: etc for filtering, pagination, ordering, etc.
   */
  const unprocessedInvoices = await prisma.unprocessedInvoice.findMany(filters)

  return unprocessedInvoices;
}