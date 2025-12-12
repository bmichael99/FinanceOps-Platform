import * as db from "../repositories/invoiceRepository";
import { Invoice, InvoiceMonthlyChartData } from "@finance-platform/types";

type inputs = {
  monthCount: number,
  userId: number,
}


//returns sums of invoices grouped by months, ex: last 6 months
//need to make this function again but grouped by days.
//TODO: We need an option to get all ranges of dates, in this case we should fetch starting from the oldest date in the db. 
//TODO: It could be much better to use a raw sql query that does everything here for me? if it exists?
export async function getLastInvoiceSumsGroupedByMonth({monthCount, userId, }: inputs){
  const currDate = new Date();

  const invoiceData : InvoiceMonthlyChartData[] = [];
  let currentYear = currDate.getFullYear();
  let currentMonth = currDate.getMonth();
  for(let i = 0; i < monthCount; i++){
    if(currentMonth < 0){
      currentYear -= 1;
      currentMonth = 12;
    }
    
    const monthlyRevenuePromise = db.getAllInvoicesUsingAggregate({
      where: {userId , DueDate: {gte: new Date(Date.UTC(currentYear,currentMonth,1,0,0,0,1)), lte: new Date(Date.UTC(currentYear,currentMonth+1,1,0,0,0,0))}, verificationStatus: "VERIFIED", paymentStatus: "PAID", invoiceType: "ACCOUNTS_RECEIVABLE"},
      _sum: {
        InvoiceTotal: true,
      }
    });
    const monthlyRevenueOwedPromise = db.getAllInvoicesUsingAggregate({
      where: {userId , DueDate: {gte: new Date(Date.UTC(currentYear,currentMonth,1,0,0,0,1)), lte: new Date(Date.UTC(currentYear,currentMonth+1,1,0,0,0,0))}, verificationStatus: "VERIFIED", paymentStatus: "UNPAID", invoiceType: "ACCOUNTS_RECEIVABLE"},
      _sum: {
        InvoiceTotal: true,
      }
    });
    const monthlyExpenditurePromise = db.getAllInvoicesUsingAggregate({
      where: {userId , DueDate: {gte: new Date(Date.UTC(currentYear,currentMonth,1,0,0,0,1)), lte: new Date(Date.UTC(currentYear,currentMonth+1,1,0,0,0,0))}, verificationStatus: "VERIFIED", paymentStatus: "PAID", invoiceType: "ACCOUNTS_PAYABLE"},
      _sum: {
        InvoiceTotal: true,
      }
    });

    const [monthlyRevenue, monthlyRevenueOwed, monthlyExpenditure] = await Promise.all([monthlyRevenuePromise,monthlyRevenueOwedPromise,monthlyExpenditurePromise])

    // const v = (t:any) => t._sum?.InvoiceTotal ?? 0;

    invoiceData.push({
      month: `${currentYear}-${currentMonth}`,
      revenue: monthlyRevenue._sum?.InvoiceTotal ?? 0,
      projectedRevenue: monthlyRevenueOwed._sum?.InvoiceTotal ?? 0,
      expenditure: monthlyExpenditure._sum?.InvoiceTotal ?? 0,
      profit: (monthlyRevenue._sum?.InvoiceTotal ?? 0) - (monthlyExpenditure._sum?.InvoiceTotal ?? 0),
    });
  }

  return invoiceData;
}
