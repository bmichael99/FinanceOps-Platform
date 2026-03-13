export type InvoiceChartData = {
    formattedDate: string;
    revenue: number;
    profit: number;
    expenditure: number;
};
export type InvoiceChartTypes = {
    last30Days: InvoiceChartData[];
    last90Days: InvoiceChartData[];
    last6Months: InvoiceChartData[];
    last12Months: InvoiceChartData[];
    allTime: InvoiceChartData[];
};
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
        last90Days: {
            amount: number;
            amountOwed: number;
        };
        last365Days: {
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
        last90Days: {
            amount: number;
            amountDue: number;
        };
        last365Days: {
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
        last90Days: {
            amount: number;
            projected: number;
        };
        last365Days: {
            amount: number;
            projected: number;
        };
        total: {
            amount: number;
            projected: number;
        };
    };
    chartData: InvoiceChartTypes;
};
