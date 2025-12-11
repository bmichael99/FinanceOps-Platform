import { Invoice } from "./prisma-types"

export type InvoiceDailyChartData = Pick<Invoice, "DueDate" | "InvoiceTotal" | "paymentStatus">;

export type InvoiceMonthlyChartData = {
  month: string;
  revenue: number;
  projectedRevenue: number;
  profit: number;
  expenditure: number;
}


export type InvoiceChartData = {
  // last90Days: InvoiceDailyChartData[];     // raw daily data
  last6Months: InvoiceMonthlyChartData[];  // monthly aggregated
  // last1Year: InvoiceMonthlyChartData[];    // monthly aggregated
  // YTD: InvoiceMonthlyChartData[];          // monthly aggregated
  // allTime: InvoiceMonthlyChartData[];      // monthly aggregated
}

export type InvoiceDashboardSummaryType = {
  totalInvoices: {
    verified: number;
    unverified: number;
  };
  upcoming: {
    next7days: {
      count: number;
      amountDue: number;
    };
    next30days: {
      count: number;
      amountDue: number;
    };
  };
  past: {
    count: number;
    amountDue: number;
  };
  revenue: {
    last30Days: {
      amount: number;
      amountOwed: number;
    };
    MTD: {
      amount: number;
      amountOwed: number;
    };
    last365Days: {
      amount: number;
      amountOwed: number;
    };
    YTD: {
      amount: number;
      amountOwed: number;
    };
    total: {
      amount: number;
      amountOwed: number;
    };
  };
  expenditure: {
    last30Days: {
      amount: number;
      amountDue: number;
    };
    MTD: {
      amount: number;
      amountDue: number;
    };
    last365Days: {
      amount: number;
      amountDue: number;
    };
    YTD: {
      amount: number;
      amountDue: number;
    };
    total: {
      amount: number;
      amountDue: number;
    };
  };
  profit: {
    last30Days: {
      amount: number;
      projected: number;
    };
    MTD: {
      amount: number;
      projected: number;
    };
    last365Days: {
      amount: number;
      projected: number;
    };
    YTD: {
      amount: number;
      projected: number;
    };
    total: {
      amount: number;
      projected: number;
    };
  };
  chartData: InvoiceChartData;
}




