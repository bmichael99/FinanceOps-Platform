import prisma from "./prisma.js";

interface fieldConfidenceType {
  fieldName : string,
  confidence : number,
}

interface Invoice {
  fileName : string,
  projectName ?: string,
  invoiceType ?: string,
  paymentStatus ?: string,
  fileIdSharepoint ?: string,
  CustomerName ?: string,
  CustomerId ?: string,
  PurchaseOrder ?: string,
  InvoiceId ?: string,
  InvoiceDate ?: string,
  DueDate ?: string,
  VendorName ?: string,
  VendorAddress ?: string,
  VendorAddressRecipient ?: string,
  CustomerAddress ?: string,
  CustomerAddressRecipient ?: string,
  BillingAddress ?: string,
  BillingAddressRecipient ?: string,
  ShippingAddress ?: string,
  ShippingAddressRecipient ?: string,
  SubTotal ?: string,
  TotalDiscount ?: string,
  TotalTax ?: string,
  InvoiceTotal ?: string,
  AmountDue ?: string,
  PreviousUnpaidBalance ?: string,
  RemittanceAddress ?: string,
  RemittanceAddressRecipient ?: string,
  ServiceAddress ?: string,
  ServiceAddressRecipient ?: string,
  ServiceStartDate ?: string,
  ServiceEndDate ?: string,
  VendorTaxId ?: string,
  CustomerTaxId ?: string,
  PaymentTerm ?: string,
  fieldConfidences ?: fieldConfidenceType[],
}

interface invoiceTableType {
  name ?: string, 
  invoiceTableDataAsMarkdown : string,
  rowCount ?: number,
  columnCount ?: number,
  invoiceId : number,
}

export const createInvoice = async ({
  fileName,
  projectName,
  invoiceType,
  paymentStatus,
  fileIdSharepoint,
  CustomerName,
  CustomerId,
  PurchaseOrder,
  InvoiceId,
  InvoiceDate,
  DueDate,
  VendorName,
  VendorAddress,
  VendorAddressRecipient,
  CustomerAddress,
  CustomerAddressRecipient,
  BillingAddress,
  BillingAddressRecipient,
  ShippingAddress,
  ShippingAddressRecipient,
  SubTotal,
  TotalDiscount,
  TotalTax,
  InvoiceTotal,
  AmountDue,
  PreviousUnpaidBalance,
  RemittanceAddress,
  RemittanceAddressRecipient,
  ServiceAddress,
  ServiceAddressRecipient,
  ServiceStartDate,
  ServiceEndDate,
  VendorTaxId,
  CustomerTaxId,
  PaymentTerm
 } : Invoice) => {
    const invoice = await prisma.invoice.create({
      data: {
        fileName,
        projectName,
        invoiceType,
        paymentStatus,
        fileIdSharepoint,
        CustomerName,
        CustomerId,
        PurchaseOrder,
        InvoiceId,
        InvoiceDate,
        DueDate,
        VendorName,
        VendorAddress,
        VendorAddressRecipient,
        CustomerAddress,
        CustomerAddressRecipient,
        BillingAddress,
        BillingAddressRecipient,
        ShippingAddress,
        ShippingAddressRecipient,
        SubTotal,
        TotalDiscount,
        TotalTax,
        InvoiceTotal,
        AmountDue,
        PreviousUnpaidBalance,
        RemittanceAddress,
        RemittanceAddressRecipient,
        ServiceAddress,
        ServiceAddressRecipient,
        ServiceStartDate,
        ServiceEndDate,
        VendorTaxId,
        CustomerTaxId,
        PaymentTerm
      },
    });

    return invoice;
}

export const createUnprocessedInvoice = async ({
  fileName,
  projectName,
  invoiceType,
  paymentStatus,
  fileIdSharepoint,
  CustomerName,
  CustomerId,
  PurchaseOrder,
  InvoiceId,
  InvoiceDate,
  DueDate,
  VendorName,
  VendorAddress,
  VendorAddressRecipient,
  CustomerAddress,
  CustomerAddressRecipient,
  BillingAddress,
  BillingAddressRecipient,
  ShippingAddress,
  ShippingAddressRecipient,
  SubTotal,
  TotalDiscount,
  TotalTax,
  InvoiceTotal,
  AmountDue,
  PreviousUnpaidBalance,
  RemittanceAddress,
  RemittanceAddressRecipient,
  ServiceAddress,
  ServiceAddressRecipient,
  ServiceStartDate,
  ServiceEndDate,
  VendorTaxId,
  CustomerTaxId,
  PaymentTerm,
  fieldConfidences = [],
 } : Invoice) => {
    const unprocessedInvoice = await prisma.unprocessedInvoice.create({
      data: {
        fileName,
        projectName,
        invoiceType,
        paymentStatus,
        fileIdSharepoint,
        CustomerName,
        CustomerId,
        PurchaseOrder,
        InvoiceId,
        InvoiceDate,
        DueDate,
        VendorName,
        VendorAddress,
        VendorAddressRecipient,
        CustomerAddress,
        CustomerAddressRecipient,
        BillingAddress,
        BillingAddressRecipient,
        ShippingAddress,
        ShippingAddressRecipient,
        SubTotal,
        TotalDiscount,
        TotalTax,
        InvoiceTotal,
        AmountDue,
        PreviousUnpaidBalance,
        RemittanceAddress,
        RemittanceAddressRecipient,
        ServiceAddress,
        ServiceAddressRecipient,
        ServiceStartDate,
        ServiceEndDate,
        VendorTaxId,
        CustomerTaxId,
        PaymentTerm,
        fieldConfidences: {
          create: fieldConfidences.map(({ fieldName, confidence }) => ({
            fieldName,
            confidence,
          })),
        }
      },
    });

    return unprocessedInvoice;
  
}

export const updateInvoice = async ({
  fileName,
  projectName,
  invoiceType,
  paymentStatus,
  fileIdSharepoint,
  CustomerName,
  CustomerId,
  PurchaseOrder,
  InvoiceId,
  InvoiceDate,
  DueDate,
  VendorName,
  VendorAddress,
  VendorAddressRecipient,
  CustomerAddress,
  CustomerAddressRecipient,
  BillingAddress,
  BillingAddressRecipient,
  ShippingAddress,
  ShippingAddressRecipient,
  SubTotal,
  TotalDiscount,
  TotalTax,
  InvoiceTotal,
  AmountDue,
  PreviousUnpaidBalance,
  RemittanceAddress,
  RemittanceAddressRecipient,
  ServiceAddress,
  ServiceAddressRecipient,
  ServiceStartDate,
  ServiceEndDate,
  VendorTaxId,
  CustomerTaxId,
  PaymentTerm
 } : Invoice) => {

    const invoice = await prisma.invoice.update({
      where: {fileName},
      data: {
        fileName,
        projectName,
        invoiceType,
        paymentStatus,
        fileIdSharepoint,
        CustomerName,
        CustomerId,
        PurchaseOrder,
        InvoiceId,
        InvoiceDate,
        DueDate,
        VendorName,
        VendorAddress,
        VendorAddressRecipient,
        CustomerAddress,
        CustomerAddressRecipient,
        BillingAddress,
        BillingAddressRecipient,
        ShippingAddress,
        ShippingAddressRecipient,
        SubTotal,
        TotalDiscount,
        TotalTax,
        InvoiceTotal,
        AmountDue,
        PreviousUnpaidBalance,
        RemittanceAddress,
        RemittanceAddressRecipient,
        ServiceAddress,
        ServiceAddressRecipient,
        ServiceStartDate,
        ServiceEndDate,
        VendorTaxId,
        CustomerTaxId,
        PaymentTerm
      },
    });

    return invoice;
  
}

export const updateUnprocessedInvoice = async ({
  fileName,
  projectName,
  invoiceType,
  paymentStatus,
  fileIdSharepoint,
  CustomerName,
  CustomerId,
  PurchaseOrder,
  InvoiceId,
  InvoiceDate,
  DueDate,
  VendorName,
  VendorAddress,
  VendorAddressRecipient,
  CustomerAddress,
  CustomerAddressRecipient,
  BillingAddress,
  BillingAddressRecipient,
  ShippingAddress,
  ShippingAddressRecipient,
  SubTotal,
  TotalDiscount,
  TotalTax,
  InvoiceTotal,
  AmountDue,
  PreviousUnpaidBalance,
  RemittanceAddress,
  RemittanceAddressRecipient,
  ServiceAddress,
  ServiceAddressRecipient,
  ServiceStartDate,
  ServiceEndDate,
  VendorTaxId,
  CustomerTaxId,
  PaymentTerm
 } : Invoice) => {

    const unprocessedInvoice = await prisma.unprocessedInvoice.update({
      where: {fileName},
      data: {
        fileName,
        projectName,
        invoiceType,
        paymentStatus,
        fileIdSharepoint,
        CustomerName,
        CustomerId,
        PurchaseOrder,
        InvoiceId,
        InvoiceDate,
        DueDate,
        VendorName,
        VendorAddress,
        VendorAddressRecipient,
        CustomerAddress,
        CustomerAddressRecipient,
        BillingAddress,
        BillingAddressRecipient,
        ShippingAddress,
        ShippingAddressRecipient,
        SubTotal,
        TotalDiscount,
        TotalTax,
        InvoiceTotal,
        AmountDue,
        PreviousUnpaidBalance,
        RemittanceAddress,
        RemittanceAddressRecipient,
        ServiceAddress,
        ServiceAddressRecipient,
        ServiceStartDate,
        ServiceEndDate,
        VendorTaxId,
        CustomerTaxId,
        PaymentTerm
      },
    });

    return unprocessedInvoice;
  
}

export const createInvoiceTable = async ({name, invoiceTableDataAsMarkdown, rowCount, columnCount, invoiceId} : invoiceTableType) => {

    const invoiceTable = await prisma.invoiceTable.create({
    data: {name, invoiceTableDataAsMarkdown, rowCount, columnCount, invoiceId}
  });

  return invoiceTable

}

export const createUnprocessedInvoiceTable = async ({name, invoiceTableDataAsMarkdown, rowCount, columnCount, invoiceId} : invoiceTableType) => {

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