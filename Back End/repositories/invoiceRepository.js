exports.createInvoice = async ({
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
  try{
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
  } catch(err){
    throw err;
  }
  
}

exports.createUnprocessedInvoice = async ({
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
  try{
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
  } catch(err){
    throw err;
  }
  
}

exports.updateInvoice = async ({
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
  try{
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
  } catch(err){
    throw err;
  }
  
}

exports.updateUnprocessedInvoice = async ({
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
  try{
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
  } catch(err){
    throw err;
  }
  
}

exports.createInvoiceTable = async ({id, name, invoiceTableDataAsMarkdown, rowCount, columnCount, invoiceId}) => {
  try{
    const invoiceTable = await prisma.invoiceTable.create({
    data: {id, name, invoiceTableDataAsMarkdown, rowCount, columnCount, invoiceId}
  });

  return invoiceTable
  } catch(err){
    throw err;
  }

}

exports.createUnprocessedInvoiceTable = async ({id, name, invoiceTableDataAsMarkdown, rowCount, columnCount, invoiceId}) => {
  try{
    const unprocessedInvoiceTable = await prisma.unprocessedInvoiceTable.create({
    data: {id, name, invoiceTableDataAsMarkdown, rowCount, columnCount, invoiceId}
  });

  return unprocessedInvoiceTable
  } catch(err){
    throw err;
  }

}

exports.getAllInvoices = async() => {
  const invoices = await prisma.invoice.findMany({
    include: {
      invoiceTables: true,
    }
  })

  return invoices;
}

exports.getAllUnprocessedInvoices = async() => {
  const unprocessedInvoices = await prisma.unprocessedInvoice.findMany();

  return unprocessedInvoices;
}

exports.getAllUnprocessedInvoicesFileNames = async() => {
  const unprocessedInvoices = await prisma.unprocessedInvoice.findMany({
    select: {
      fileName: true,
    }
  });

  return unprocessedInvoices;
}

exports.getUnprocessedInvoiceByFileName = async(fileName) => {
  const unprocessedInvoice = await prisma.unprocessedInvoice.findUnique({
    where:{
      fileName
    }
  });

  return unprocessedInvoice;
}

exports.findInvoiceWithFileName = async(fileName) =>{
  const invoice = await prisma.invoice.findUnique({
    where: {
      fileName,
    },
  });

  return invoice;
}

exports.findUnprocessedInvoiceWithFileName = async(fileName) =>{
  const unprocessedInvoice = await prisma.unprocessedInvoice.findUnique({
    where: {
      fileName,
    },
  });

  return unprocessedInvoice;
}

exports.getAllInvoicesByProjectName = async(projectName) => {
  try{
    const invoices = await prisma.invoice.findMany({
      where: {projectName}
    })

    return invoices;
  } catch(err){
    throw err
  }
}

exports.getAllInvoicesIncludingTablesByProjectName = async(projectName) => {
  try{
    const invoices = await prisma.invoice.findMany({
      where: {projectName},
      include: {invoiceTables: true}
    })

    return invoices;
  } catch(err){
    throw err
  }
}


exports.deleteUnprocessedInvoiceByFileName = async(fileName) => {
  try{
    const unprocessedInvoice = await prisma.unprocessedInvoice.delete({
      where: {fileName}
    })

    return unprocessedInvoice;
  } catch(err){
    throw err
  }
}