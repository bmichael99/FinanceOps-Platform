export type InvoiceDashboardSummaryType = {
  totalInvoices: {
    verified: number,
    unverified: number,
  },
  upcoming: {
    next7days: {
      count: number,
      amountDue: number,
    },
    next30days: {
      count: number,
      amountDue: number,
    },
  },
  past: {
    count: number,
    amountDue: number,
  },
  revenue: {
    last30Days: number,
    MTD: number,
    last365Days: number,
    YTD: number,
    total: number,
  }
}