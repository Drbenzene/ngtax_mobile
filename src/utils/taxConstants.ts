// Nigeria 2026 Tax Law Constants

// VAT (Value Added Tax)
export const VAT_RATE = 0.075; // 7.5% standard rate
export const VAT_FILING_DAY = 21; // Monthly filing due on 21st

// Small Business Thresholds (Tax Exempt)
export const SMALL_BUSINESS_TURNOVER_THRESHOLD = 50_000_000; // N50 million
export const SMALL_BUSINESS_ASSET_THRESHOLD = 250_000_000; // N250 million

// Tax Rates
export const COMPANY_INCOME_TAX_RATE = 0.30; // 30% for large companies
export const SMALL_BUSINESS_TAX_RATE = 0.0; // 0% (exempt)

// Penalties
export const LATE_FILING_PENALTY_RATE = 0.05; // 5% penalty
export const LATE_PAYMENT_PENALTY_RATE = 0.10; // 10% penalty per month

// Filing Deadlines
export const ANNUAL_FILING_DEADLINE = { month: 1, day: 31 }; // January 31

// Transaction Reporting Thresholds
export const MONTHLY_TRANSACTION_REPORTING_THRESHOLD = 100_000_000; // N100M for financial institutions

// Tax Categories
export const TAX_CATEGORIES = {
  TAXABLE_INCOME: 'taxable_income',
  VAT_SALE: 'vat_sale',
  DEDUCTIBLE_EXPENSE: 'deductible_expense',
  NON_TAXABLE: 'non_taxable',
} as const;

// Tax Category Labels
export const TAX_CATEGORY_LABELS = {
  taxable_income: 'Taxable Income',
  vat_sale: 'VAT Sale',
  deductible_expense: 'Deductible Expense',
  non_taxable: 'Non-Taxable',
};

// Tax Category Colors (for UI badges)
export const TAX_CATEGORY_COLORS = {
  taxable_income: '#3B82F6',      // Blue
  vat_sale: '#10B981',            // Green
  deductible_expense: '#F59E0B',  // Amber
  non_taxable: '#6B7280',         // Gray
};

// Filing Status Labels
export const FILING_STATUS_LABELS = {
  pending: 'Pending',
  draft: 'Draft',
  filed: 'Filed',
  late: 'Filed Late',
  overdue: 'Overdue',
};

// Filing Status Colors
export const FILING_STATUS_COLORS = {
  pending: '#F59E0B',  // Amber
  draft: '#6B7280',    // Gray
  filed: '#10B981',    // Green
  late: '#EF4444',     // Red
  overdue: '#DC2626',  // Dark Red
};

// Default reminder days before deadline
export const DEFAULT_REMINDER_DAYS = 5;

// Currency
export const CURRENCY_SYMBOL = '₦';
export const CURRENCY_CODE = 'NGN';
