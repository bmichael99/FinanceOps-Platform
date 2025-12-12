//this script will generate mock data for testing purposes.
import { Invoice } from "@finance-platform/types";
import prisma from "../config/prisma";


type InvoiceData = Pick<Invoice, "invoiceType" | "paymentStatus">
interface GenerateMockDataInput extends InvoiceData{
  recordCount: number,
} 

async function generateMockData({invoiceType, paymentStatus, recordCount} : GenerateMockDataInput){
  const randomCompanyNames = ["Luminara Labs", "Echelon Dynamics", "Quantum Leap Co.", "Aetherflow", "Echo Bloom"];
  //receivables
  for(let i = 0; i < recordCount;i++){
    //Math.random generates a number between [0,1) | 0 inclusive, 1 exclusive
    //Due Date:
    const randomMonth = Math.floor(Math.random()*12); //month index in Date constructors is 0-11, so use floor //0-11
    const randomDay = Math.ceil(Math.random()*28); //28 days in shortest month, not worried about missing days for mock data. //1-28
    const randomYear = 2020 + Math.floor(Math.random()*6); //2020-2025
    //Invoice Date:
    const randomMonth2 = Math.floor(Math.random()*12); 
    const randomDay2 = Math.ceil(Math.random()*28); 
    const randomYear2 = 2000 + Math.floor(Math.random()*26); //2000-2025
    //Misc:
    const randomInvoiceTotal = 100 + Math.floor(Math.random()*11901); //100-1200
    const randomID = crypto.randomUUID();
    await prisma.invoice.create({
      data: {
        fileName: `testFile-${i}-${randomID}.pdf`,
        filePath: `uploads/testFile-${i}-${randomID}.pdf`,
        mimeType: "application/pdf",
        originalFileName: `originalName-testFile-${i}-${randomID}.pdf`,
        paymentStatus,
        CustomerName: invoiceType == "ACCOUNTS_PAYABLE" ? "Adanta" : randomCompanyNames[Math.floor(Math.random()*5)],
        VendorName: invoiceType == "ACCOUNTS_RECEIVABLE" ? "Adanta" : randomCompanyNames[Math.floor(Math.random()*5)],
        invoiceType,
        InvoiceTotal: randomInvoiceTotal,
        InvoiceDate: new Date(randomYear2,randomMonth2,randomDay2), //we don't really care about this for testing right now.
        DueDate: new Date(randomYear,randomMonth,randomDay),
        InvoiceId: randomID,
        verificationStatus: "VERIFIED",
        userId: 1,
      }
    })
  }

}

function main(){
  generateMockData({recordCount: 50, invoiceType: "ACCOUNTS_PAYABLE", paymentStatus: "PAID"}); //Expenditure
  generateMockData({recordCount: 50, invoiceType: "ACCOUNTS_PAYABLE", paymentStatus: "UNPAID"}); //Unpaid Expenses
  generateMockData({recordCount: 100, invoiceType: "ACCOUNTS_RECEIVABLE", paymentStatus: "PAID"}); //Revenue
  generateMockData({recordCount: 50, invoiceType: "ACCOUNTS_RECEIVABLE", paymentStatus: "UNPAID"}); //Pending Revenue (unpaid)
}

main();