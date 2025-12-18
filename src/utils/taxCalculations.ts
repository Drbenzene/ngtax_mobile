// Tax Calculation Engine for Nigeria 2026 Tax Law

import {
  TaxCategory,
  TaxPeriodInfo,
  VATReturn,
  MonthlyTaxSummary,
  BusinessTaxInfo,
  FilingStatus,
} from '../types/taxTypes';
import {
  VAT_RATE,
  VAT_FILING_DAY,
  SMALL_BUSINESS_TURNOVER_THRESHOLD,
  COMPANY_INCOME_TAX_RATE,
} from './taxConstants';

// Transaction interface (simplified from actual transaction type)
interface Transaction {
  id: string;
  amount: number;
  timestamp: string;
  taxCategory?: TaxCategory;
  receiptUrl?: string;
}

/**
 * Check if a business qualifies as a small business (tax exempt)
 */
export const isSmallBusinessExempt = (annualTurnover: number): boolean => {
  return annualTurnover < SMALL_BUSINESS_TURNOVER_THRESHOLD;
};

/**
 * Calculate VAT amount from transaction
 */
export const calculateVAT = (amount: number, rate: number = VAT_RATE): number => {
  return amount * rate;
};

/**
 * Get tax period info for a given date
 */
export const getTaxPeriod = (date: Date): TaxPeriodInfo => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 0-indexed to 1-indexed
  const quarter = Math.ceil(month / 3);

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  return {
    period: 'monthly',
    year,
    month,
    quarter,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
};

/**
 * Get VAT filing due date for a period
 */
export const getVATFilingDueDate = (period: TaxPeriodInfo): Date => {
  // VAT return due on 21st of following month
  const year = period.month === 12 ? period.year + 1 : period.year;
  const month = period.month === 12 ? 1 : period.month! + 1;
  return new Date(year, month - 1, VAT_FILING_DAY);
};

/**
 * Calculate days until deadline
 */
export const getDaysUntilDeadline = (dueDate: Date): number => {
  const now = new Date();
  const diff = dueDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * Check if filing is overdue
 */
export const isOverdue = (dueDate: Date): boolean => {
  return new Date() > dueDate;
};

/**
 * Filter transactions by tax period
 */
export const getTransactionsForPeriod = (
  transactions: Transaction[],
  period: TaxPeriodInfo
): Transaction[] => {
  const startTime = new Date(period.startDate).getTime();
  const endTime = new Date(period.endDate).getTime();

  return transactions.filter((t) => {
    const txTime = new Date(t.timestamp).getTime();
    return txTime >= startTime && txTime <= endTime;
  });
};

/**
 * Categorize transactions by tax category
 */
export const categorizeTransactions = (transactions: Transaction[]) => {
  const categorized = {
    taxable_income: [] as Transaction[],
    vat_sale: [] as Transaction[],
    deductible_expense: [] as Transaction[],
    non_taxable: [] as Transaction[],
    uncategorized: [] as Transaction[],
  };

  transactions.forEach((tx) => {
    if (!tx.taxCategory) {
      categorized.uncategorized.push(tx);
    } else {
      categorized[tx.taxCategory].push(tx);
    }
  });

  return categorized;
};

/**
 * Calculate total for transactions in a category
 */
export const calculateCategoryTotal = (transactions: Transaction[]): number => {
  return transactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
};

/**
 * Calculate VAT return for a period
 */
export const calculateVATReturn = (
  transactions: Transaction[],
  period: TaxPeriodInfo
): VATReturn => {
  const periodTransactions = getTransactionsForPeriod(transactions, period);
  const categorized = categorizeTransactions(periodTransactions);

  // VAT collected on sales
  const vatSales = categorized.vat_sale.filter((t) => t.amount > 0);
  const totalSales = calculateCategoryTotal(vatSales);
  const vatCollected = calculateVAT(totalSales);

  // VAT on purchases (input VAT) - deductible
  const vatPurchases = categorized.vat_sale.filter((t) => t.amount < 0);
  const totalPurchases = calculateCategoryTotal(vatPurchases);
  const vatDeductible = calculateVAT(totalPurchases);

  // Net VAT payable
  const netVATPayable = vatCollected - vatDeductible;

  // Get transaction and receipt IDs
  const transactionIds = vatSales.map((t) => t.id);
  const receiptIds = vatSales
    .filter((t) => t.receiptUrl)
    .map((t) => t.id);

  const dueDate = getVATFilingDueDate(period);
  const status: FilingStatus = isOverdue(dueDate) ? 'overdue' : 'pending';

  return {
    id: `vat-${period.year}-${period.month}`,
    period,
    totalSales,
    vatRate: VAT_RATE,
    vatCollected,
    vatDeductible,
    netVATPayable,
    dueDate: dueDate.toISOString(),
    status,
    transactionIds,
    receiptIds,
  };
};

/**
 * Calculate monthly tax summary
 */
export const calculateMonthlyTaxSummary = (
  transactions: Transaction[],
  period: TaxPeriodInfo,
  businessInfo?: BusinessTaxInfo
): MonthlyTaxSummary => {
  const periodTransactions = getTransactionsForPeriod(transactions, period);
  const categorized = categorizeTransactions(periodTransactions);

  // Calculate totals
  const totalIncome = calculateCategoryTotal([
    ...categorized.taxable_income.filter((t) => t.amount > 0),
    ...categorized.vat_sale.filter((t) => t.amount > 0),
  ]);

  const totalExpenses = calculateCategoryTotal([
    ...categorized.deductible_expense,
    ...categorized.vat_sale.filter((t) => t.amount < 0),
  ]);

  const netIncome = totalIncome - totalExpenses;

  // Calculate VAT return
  const vatReturn = calculateVATReturn(transactions, period);

  // Estimate total tax liability
  let estimatedTaxLiability = vatReturn.netVATPayable;

  // Add income tax if not small business
  if (businessInfo && !businessInfo.isSmallBusiness) {
    const incomeTax = netIncome * COMPANY_INCOME_TAX_RATE;
    estimatedTaxLiability += incomeTax;
  }

  // Count receipts
  const transactionCount = periodTransactions.length;
  const receiptCount = periodTransactions.filter((t) => t.receiptUrl).length;
  const missingReceipts = transactionCount - receiptCount;

  return {
    period,
    totalIncome,
    totalExpenses,
    netIncome,
    vatReturn,
    estimatedTaxLiability,
    transactionCount,
    receiptCount,
    missingReceipts,
  };
};

/**
 * Format currency for Nigeria (Naira)
 */
export const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

/**
 * Get filing status based on due date and current state
 */
export const getFilingStatus = (
  dueDate: Date,
  filed: boolean,
  filedDate?: Date
): FilingStatus => {
  if (!filed) {
    return isOverdue(dueDate) ? 'overdue' : 'pending';
  }

  if (filedDate && filedDate > dueDate) {
    return 'late';
  }

  return 'filed';
};

/**
 * Calculate tax compliance score (0-100)
 */
export const calculateComplianceScore = (
  filings: Array<{ status: FilingStatus }>,
  transactions: Transaction[]
): number => {
  if (filings.length === 0) return 0;

  // On-time filing rate (40% weight)
  const onTimeFilings = filings.filter(
    (f) => f.status === 'filed'
  ).length;
  const filingScore = (onTimeFilings / filings.length) * 40;

  // Receipt coverage rate (30% weight)
  const withReceipts = transactions.filter((t) => t.receiptUrl).length;
  const receiptScore = transactions.length > 0
    ? (withReceipts / transactions.length) * 30
    : 0;

  // Categorization rate (30% weight)
  const categorized = transactions.filter((t) => t.taxCategory).length;
  const categorizationScore = transactions.length > 0
    ? (categorized / transactions.length) * 30
    : 0;

  return Math.round(filingScore + receiptScore + categorizationScore);
};
