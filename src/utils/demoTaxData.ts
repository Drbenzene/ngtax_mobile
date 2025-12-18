// Demo Tax Data for Testing

import {
  BusinessTaxInfo,
  TaxFiling,
  TaxReceipt,
  MonthlyTaxSummary,
  TaxPeriodInfo,
} from '../types/taxTypes';
import { getTaxPeriod, calculateMonthlyTaxSummary } from './taxCalculations';

// Demo Business Tax Info
export const DEMO_BUSINESS_INFO: BusinessTaxInfo = {
  businessName: 'NGTAX Technologies Ltd',
  cacNumber: 'RC1234567',
  tinNumber: 'TIN-987654321',
  businessType: 'registered',
  annualTurnover: 85_000_000, // N85M (above small business threshold)
  isSmallBusiness: false,
  registrationDate: '2024-01-15T00:00:00.000Z',
  taxOffice: 'Lagos Tax Office',
};

// Get current and previous periods
const currentDate = new Date();
const currentPeriod = getTaxPeriod(currentDate);

const lastMonth = new Date(currentDate);
lastMonth.setMonth(lastMonth.getMonth() - 1);
const lastPeriod = getTaxPeriod(lastMonth);

const twoMonthsAgo = new Date(currentDate);
twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
const twoMonthsPeriod = getTaxPeriod(twoMonthsAgo);

// Demo Tax Receipts
export const DEMO_TAX_RECEIPTS: TaxReceipt[] = [
  {
    id: 'receipt-1',
    transactionId: '1',
    fileUrl: '/receipts/walmart_receipt.jpg',
    fileName: 'walmart_receipt.jpg',
    fileType: 'image',
    fileSize: 245678,
    uploadDate: new Date().toISOString(),
    description: 'Office supplies from Walmart',
    amount: 45.20,
    taxCategory: 'deductible_expense',
    period: currentPeriod,
  },
  {
    id: 'receipt-2',
    transactionId: '3',
    fileUrl: '/receipts/electric_bill.pdf',
    fileName: 'electric_bill.pdf',
    fileType: 'pdf',
    fileSize: 125000,
    uploadDate: new Date(Date.now() - 86400000).toISOString(),
    description: 'Monthly electricity bill',
    amount: 75.00,
    taxCategory: 'deductible_expense',
    period: currentPeriod,
  },
  {
    id: 'receipt-3',
    transactionId: '5',
    fileUrl: '/receipts/amazon_invoice.pdf',
    fileName: 'amazon_invoice.pdf',
    fileType: 'pdf',
    fileSize: 89500,
    uploadDate: new Date(Date.now() - 259200000).toISOString(),
    description: 'Equipment purchase',
    amount: 120.50,
    taxCategory: 'deductible_expense',
    period: currentPeriod,
  },
];

// Demo Monthly Tax Summaries (will be calculated from transactions in actual use)
export const DEMO_MONTHLY_SUMMARY: MonthlyTaxSummary = {
  period: currentPeriod,
  totalIncome: 2_467_000,
  totalExpenses: 340_000,
  netIncome: 2_127_000,
  vatReturn: {
    id: `vat-${currentPeriod.year}-${currentPeriod.month}`,
    period: currentPeriod,
    totalSales: 2_467_000,
    vatRate: 0.075,
    vatCollected: 185_025,
    vatDeductible: 25_500,
    netVATPayable: 159_525,
    dueDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 21).toISOString(),
    status: 'pending',
    transactionIds: ['1', '2', '3', '4', '5'],
    receiptIds: ['receipt-1', 'receipt-2', 'receipt-3'],
  },
  estimatedTaxLiability: 797_625, // VAT + estimated income tax
  transactionCount: 5,
  receiptCount: 3,
  missingReceipts: 2,
};

// Demo Tax Filings
export const DEMO_TAX_FILINGS: TaxFiling[] = [
  {
    id: 'filing-1',
    period: lastPeriod,
    summary: {
      period: lastPeriod,
      totalIncome: 3_125_000,
      totalExpenses: 425_000,
      netIncome: 2_700_000,
      vatReturn: {
        id: `vat-${lastPeriod.year}-${lastPeriod.month}`,
        period: lastPeriod,
        totalSales: 3_125_000,
        vatRate: 0.075,
        vatCollected: 234_375,
        vatDeductible: 31_875,
        netVATPayable: 202_500,
        dueDate: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 21).toISOString(),
        status: 'filed',
        filingDate: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 18).toISOString(),
        transactionIds: [],
        receiptIds: [],
      },
      estimatedTaxLiability: 1_012_500,
      transactionCount: 12,
      receiptCount: 10,
      missingReceipts: 2,
    },
    status: 'filed',
    filedDate: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 18).toISOString(),
    filedBy: 'John Doe',
    confirmationNumber: 'NRS-2026-' + Math.random().toString(36).substring(7).toUpperCase(),
    pdfUrl: '/filings/vat_return_feb_2026.pdf',
    createdAt: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1).toISOString(),
    updatedAt: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 18).toISOString(),
  },
  {
    id: 'filing-2',
    period: twoMonthsPeriod,
    summary: {
      period: twoMonthsPeriod,
      totalIncome: 2_890_000,
      totalExpenses: 390_000,
      netIncome: 2_500_000,
      vatReturn: {
        id: `vat-${twoMonthsPeriod.year}-${twoMonthsPeriod.month}`,
        period: twoMonthsPeriod,
        totalSales: 2_890_000,
        vatRate: 0.075,
        vatCollected: 216_750,
        vatDeductible: 29_250,
        netVATPayable: 187_500,
        dueDate: new Date(twoMonthsAgo.getFullYear(), twoMonthsAgo.getMonth() + 1, 21).toISOString(),
        status: 'filed',
        filingDate: new Date(twoMonthsAgo.getFullYear(), twoMonthsAgo.getMonth() + 1, 19).toISOString(),
        transactionIds: [],
        receiptIds: [],
      },
      estimatedTaxLiability: 937_500,
      transactionCount: 15,
      receiptCount: 14,
      missingReceipts: 1,
    },
    status: 'filed',
    filedDate: new Date(twoMonthsAgo.getFullYear(), twoMonthsAgo.getMonth() + 1, 19).toISOString(),
    filedBy: 'John Doe',
    confirmationNumber: 'NRS-2026-' + Math.random().toString(36).substring(7).toUpperCase(),
    pdfUrl: '/filings/vat_return_jan_2026.pdf',
    createdAt: new Date(twoMonthsAgo.getFullYear(), twoMonthsAgo.getMonth(), 1).toISOString(),
    updatedAt: new Date(twoMonthsAgo.getFullYear(), twoMonthsAgo.getMonth() + 1, 19).toISOString(),
  },
];

// Export all demo tax data
export default {
  DEMO_BUSINESS_INFO,
  DEMO_TAX_RECEIPTS,
  DEMO_MONTHLY_SUMMARY,
  DEMO_TAX_FILINGS,
};
