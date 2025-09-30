import prisma from "./prisma";

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
 }) => {
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
 }) => {
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
 }) => {

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
 }) => {

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

export const createInvoiceTable = async ({id, name, invoiceTableDataAsMarkdown, rowCount, columnCount, invoiceId}) => {

    const invoiceTable = await prisma.invoiceTable.create({
    data: {id, name, invoiceTableDataAsMarkdown, rowCount, columnCount, invoiceId}
  });

  return invoiceTable

}

export const createUnprocessedInvoiceTable = async ({id, name, invoiceTableDataAsMarkdown, rowCount, columnCount, invoiceId}) => {

    const unprocessedInvoiceTable = await prisma.unprocessedInvoiceTable.create({
    data: {id, name, invoiceTableDataAsMarkdown, rowCount, columnCount, invoiceId}
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

export const getUnprocessedInvoiceByFileName = async(fileName) => {
  const unprocessedInvoice = await prisma.unprocessedInvoice.findUnique({
    where:{
      fileName
    }
  });

  return unprocessedInvoice;
}

export const findInvoiceWithFileName = async(fileName) =>{
  const invoice = await prisma.invoice.findUnique({
    where: {
      fileName,
    },
  });

  return invoice;
}

export const findUnprocessedInvoiceWithFileName = async(fileName) =>{
  const unprocessedInvoice = await prisma.unprocessedInvoice.findUnique({
    where: {
      fileName,
    },
  });

  return unprocessedInvoice;
}

export const getAllInvoicesByProjectName = async(projectName) => {
    const invoices = await prisma.invoice.findMany({
      where: {projectName}
    })

    return invoices;
}

export const getAllInvoicesIncludingTablesByProjectName = async(projectName) => {
    const invoices = await prisma.invoice.findMany({
      where: {projectName},
      include: {invoiceTables: true}
    })

    return invoices;
}


export const deleteUnprocessedInvoiceByFileName = async(fileName) => {

    const unprocessedInvoice = await prisma.unprocessedInvoice.delete({
      where: {fileName}
    })

    return unprocessedInvoice;
}