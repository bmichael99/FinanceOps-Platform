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
    last30Days: {
      amount: number,
      amountOwed: number,
    },
    MTD: {
      amount: number,
      amountOwed: number,
    },
    last365Days: {
      amount: number,
      amountOwed: number,
    },
    YTD: {
      amount: number,
      amountOwed: number,
    },
    total: {
      amount: number,
      amountOwed: number,
    },
  }
  expenditure: {
    last30Days: {
      amount: number,
      amountDue: number,
    },
    MTD: {
      amount: number,
      amountDue: number,
    },
    last365Days: {
      amount: number,
      amountDue: number,
    },
    YTD: {
      amount: number,
      amountDue: number,
    },
    total: {
      amount: number,
      amountDue: number,
    },
  },
  profit: {
    last30Days: {
      amount: number,
      projected: number,
    },
    MTD: {
      amount: number,
      projected: number,
    },
    last365Days: {
      amount: number,
      projected: number,
    },
    YTD: {
      amount: number,
      projected: number,
    },
    total: {
      amount: number,
      projected: number,
    },
  }
}