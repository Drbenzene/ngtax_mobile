// Tax Types for Nigeria 2026 Tax Law Compliance

export type TaxPeriod = 'monthly' | 'quarterly' | 'annual';

export type TaxCategory = 
  | 'taxable_income'      // Revenue/income subject to tax
  | 'vat_sale'            // Sales with VAT collected
  | 'deductible_expense'  // Tax-deductible business expense
  | 'non_taxable';        // Exempt transactions

export type FilingStatus = 
  | 'pending'      // Not yet filed
  | 'draft'        // Saved but not submitted
  | 'filed'        // Successfully filed
  | 'late'         // Filed after deadline
  | 'overdue';     // Not filed and past deadline

export type BusinessType = 
  | 'registered'        // CAC/RC registered business
  | 'unregistered'      // Informal business
  | 'small_business';   // <N50M turnover (tax exempt)

// Business tax information
export interface BusinessTaxInfo {
  businessName: string;
  cacNumber?: string;
  tinNumber?: string;
  businessType: BusinessType;
  annualTurnover: number;
  isSmallBusiness: boolean;
  registrationDate?: string;
  taxOffice?: string;
}

// Individual tax period (month, quarter, or year)
export interface TaxPeriodInfo {
  period: TaxPeriod;
  year: number;
  month?: number;        // 1-12 for monthly
  quarter?: number;      // 1-4 for quarterly
  startDate: string;
  endDate: string;
}

// VAT Return filing
export interface VATReturn {
  id: string;
  period: TaxPeriodInfo;
  totalSales: number;           // Total VAT-eligible sales
  vatRate: number;              // Standard 7.5%
  vatCollected: number;         // Total VAT amount
  vatDeductible: number;        // VAT on purchases (input VAT)
  netVATPayable: number;        // VAT collected - VAT deductible
  filingDate?: string;
  dueDate: string;
  status: FilingStatus;
  transactionIds: string[];     // Linked transactions
  receiptIds: string[];         // Supporting receipts
}

// Monthly tax summary
export interface MonthlyTaxSummary {
  period: TaxPeriodInfo;
  totalIncome: number;          // All taxable income
  totalExpenses: number;        // All deductible expenses
  netIncome: number;            // Income - Expenses
  vatReturn: VATReturn;
  estimatedTaxLiability: number; // Total tax owed
  transactionCount: number;
  receiptCount: number;
  missingReceipts: number;      // Transactions without receipts
}

// Complete tax filing
export interface TaxFiling {
  id: string;
  period: TaxPeriodInfo;
  summary: MonthlyTaxSummary;
  status: FilingStatus;
  filedDate?: string;
  filedBy?: string;
  confirmationNumber?: string;
  pdfUrl?: string;              // Exported filing PDF
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Receipt/Evidence
export interface TaxReceipt {
  id: string;
  transactionId?: string;       // Linked transaction
  fileUrl: string;              // Local file path or cloud URL
  fileName: string;
  fileType: 'image' | 'pdf';
  fileSize: number;
  uploadDate: string;
  description?: string;
  amount?: number;
  taxCategory?: TaxCategory;
  period: TaxPeriodInfo;
}

// Tax notification/reminder
export interface TaxReminder {
  id: string;
  type: 'filing_due' | 'payment_due' | 'missing_receipt';
  title: string;
  message: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  createdAt: string;
}

// Tax preferences
export interface TaxPreferences {
  enableReminders: boolean;
  reminderDaysBefore: number;   // Days before deadline to remind
  autoCalculateVAT: boolean;
  defaultTaxCategory: TaxCategory;
  emailReports: boolean;
  reportEmail?: string;
}

// Tax compliance score
export interface TaxComplianceScore {
  score: number;                // 0-100
  filingOnTime: number;         // Percentage of on-time filings
  receiptCoverage: number;      // Percentage of transactions with receipts
  categorizationComplete: number; // Percentage of categorized transactions
  lastUpdated: string;
}
