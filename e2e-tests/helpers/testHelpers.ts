/**
 * Helper utilities for tests
 */

/**
 * Calculate expected monthly payment using the same formula as the app
 * Formula: total = amount * (1 + interestRate), monthly = total / termMonths
 * Note: This is a simplified formula, not standard amortization
 */
export function calculateMonthlyPayment(
  amount: number,
  termMonths: number,
  interestRate: number
): number {
  const total = amount * (1 + interestRate);
  return total / termMonths;
}

/**
 * Format currency for comparison
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Format currency without decimals for summary
 */
export function formatCurrencyNoDecimals(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Format percentage
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * Wait for a specific time
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Test data generator
 */
export const TestData = {
  /**
   * Generate loan data that should be approved (≤ $100k and ≤ 60 months)
   */
  approvedLoan: {
    applicantName: 'John Doe',
    amount: 50000,
    termMonths: 36,
    interestRate: 0.08
  },

  /**
   * Generate loan data that should be rejected (> $100k)
   */
  rejectedLoanHighAmount: {
    applicantName: 'Jane Smith',
    amount: 150000,
    termMonths: 36,
    interestRate: 0.08
  },

  /**
   * Generate loan data that should be rejected (> 60 months)
   */
  rejectedLoanLongTerm: {
    applicantName: 'Bob Johnson',
    amount: 50000,
    termMonths: 72,
    interestRate: 0.08
  },

  /**
   * Edge case: Small loan
   */
  smallLoan: {
    applicantName: 'Alice Brown',
    amount: 1000,
    termMonths: 12,
    interestRate: 0.05
  },

  /**
   * Edge case: Zero interest
   */
  zeroInterestLoan: {
    applicantName: 'Charlie Davis',
    amount: 10000,
    termMonths: 24,
    interestRate: 0
  },

  /**
   * Boundary: Exactly at approval limit
   */
  boundaryLoan: {
    applicantName: 'Diana Evans',
    amount: 100000,
    termMonths: 60,
    interestRate: 0.08
  }
};
