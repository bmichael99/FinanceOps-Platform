import * as db from "../repositories/invoiceRepository";
import { Invoice, InvoiceChartData, InvoiceChartTypes } from "@finance-platform/types";
import { Prisma } from "../generated/prisma";

type monthInputs = {
  monthCount: number,
  userId: number,
}

type dayInputs = {
  dayCount: number,
  userId: number,
}

type getInvoiceTotalByDaysType = Pick<Invoice,  "verificationStatus" | "paymentStatus" | "invoiceType" | "userId" > & {
  days: number; //length of days into the past to fetch data
  startDate: Date;
}

//returns sums of invoices grouped by months, ex: last 6 months
//need to make this function again but grouped by days.
//TODO: We need an option to get all ranges of dates, in this case we should fetch starting from the oldest date in the db. 
//TODO: It could be much better to use a raw sql query that does everything here for me? if it exists?
export async function getLastInvoiceSumsGroupedByMonth({monthCount, userId, }: monthInputs){
  const currDate = new Date();

  const invoiceData : InvoiceChartData[] = [];
  let currentYear = currDate.getFullYear();
  let currentMonth = currDate.getMonth();
  for(let i = 0; i < monthCount; i++){
    //currentMonth = monthIndex which is a number from 0-11 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
    if(currentMonth < 0){
      currentYear -= 1;
      currentMonth = 11;
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
      // year: currentYear,
      // month: currentMonth+1,
      formattedDate: new Date(currentYear,currentMonth).toLocaleString('default', {month: 'short'}) + " " + currentYear,
      revenue: monthlyRevenue._sum?.InvoiceTotal ?? 0,
      // projectedRevenue: monthlyRevenueOwed._sum?.InvoiceTotal ?? 0,
      expenditure: monthlyExpenditure._sum?.InvoiceTotal ?? 0,
      profit: (monthlyRevenue._sum?.InvoiceTotal ?? 0) - (monthlyExpenditure._sum?.InvoiceTotal ?? 0),
    });
    //increment current month
    currentMonth--;
  }
  invoiceData.reverse();
  return invoiceData;
}

export async function getLastInvoiceSumsGroupedByDay({dayCount, userId, }: dayInputs){
  let ms24H = 24*60*60*1000;
  let todayDate = new Date();
  let currDate = new Date(todayDate.getTime() - (dayCount*ms24H));

  const invoiceData : InvoiceChartData[] = [];
  for(let i = 0; i < dayCount; i++){
    //currentMonth = monthIndex which is a number from 0-11 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
    let currentYear = currDate.getFullYear();
    let currentMonth = currDate.getMonth();
    let currentDay = currDate.getDate();
    
    const dailyRevenuePromise = db.getAllInvoicesUsingAggregate({
      where: {userId , DueDate: {gte: new Date(Date.UTC(currentYear,currentMonth,currentDay,0,0,0,1)), lte: new Date(Date.UTC(currentYear,currentMonth,currentDay+1,0,0,0,0))}, verificationStatus: "VERIFIED", paymentStatus: "PAID", invoiceType: "ACCOUNTS_RECEIVABLE"},
      _sum: {
        InvoiceTotal: true,
      }
    });
    const dailyRevenueOwedPromise = db.getAllInvoicesUsingAggregate({
      where: {userId , DueDate: {gte: new Date(Date.UTC(currentYear,currentMonth,currentDay,0,0,0,1)), lte: new Date(Date.UTC(currentYear,currentMonth,currentDay+1,0,0,0,0))}, verificationStatus: "VERIFIED", paymentStatus: "UNPAID", invoiceType: "ACCOUNTS_RECEIVABLE"},
      _sum: {
        InvoiceTotal: true,
      }
    });
    const dailyExpenditurePromise = db.getAllInvoicesUsingAggregate({
      where: {userId , DueDate: {gte: new Date(Date.UTC(currentYear,currentMonth,currentDay,0,0,0,1)), lte: new Date(Date.UTC(currentYear,currentMonth,currentDay+1,0,0,0,0))}, verificationStatus: "VERIFIED", paymentStatus: "PAID", invoiceType: "ACCOUNTS_PAYABLE"},
      _sum: {
        InvoiceTotal: true,
      }
    });

    const [dailyRevenueP, dailyRevenueOwedP, dailyExpenditureP] = await Promise.all([dailyRevenuePromise,dailyRevenueOwedPromise,dailyExpenditurePromise])
    const dailyRevenue = dailyRevenueP._sum?.InvoiceTotal;
    const dailyRevenueOwed = dailyRevenueOwedP._sum?.InvoiceTotal;
    const dailyExpenditure = dailyExpenditureP._sum?.InvoiceTotal;

    // const v = (t:any) => t._sum?.InvoiceTotal ?? 0;
    
    if(dailyRevenue || dailyExpenditure){
      invoiceData.push({
        formattedDate: new Date(currentYear,currentMonth).toLocaleString('default', {month: 'short'}) + " " + currentDay,
        revenue: dailyRevenue ?? 0,
        expenditure: dailyExpenditure ?? 0,
        profit: (dailyRevenue ?? 0) - (dailyExpenditure ?? 0),
      });
    } 
    
    //decrease date by a day
    currDate = new Date(currDate.getTime() + ms24H);
  }
  
  return invoiceData;
}

export async function getInvoiceTotalByDays({days, startDate = new Date(), invoiceType, paymentStatus, userId, verificationStatus} : getInvoiceTotalByDaysType){
  const oneDayInMS = 24*60*60*1000;

  const lastNDaysInvoiceTotal = await db.getAllInvoicesUsingAggregate({
       where: {userId, DueDate: {gte: new Date(startDate.getTime() - days*oneDayInMS), lte: startDate}, verificationStatus,  paymentStatus,  invoiceType},
       _sum: {
         InvoiceTotal: true,
      }
  });

  return lastNDaysInvoiceTotal;
}