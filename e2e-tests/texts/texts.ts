/**
 * Text library for Playwright tests
 * Centralizes all text values used in tests and page objects
 */

export const TEXTS = {
  // Page titles and headers
  APP_TITLE: 'Tredgate Loan',
  APP_TAGLINE: 'Simple loan application management',
  NEW_LOAN_HEADER: 'New Loan Application',
  LOAN_APPLICATIONS_HEADER: 'Loan Applications',
  
  // Form labels
  LABEL_APPLICANT_NAME: 'Applicant Name',
  LABEL_LOAN_AMOUNT: 'Loan Amount ($)',
  LABEL_TERM: 'Term (Months)',
  LABEL_INTEREST_RATE: 'Interest Rate (e.g., 0.08 for 8%)',
  
  // Buttons
  BTN_CREATE_APPLICATION: 'Create Application',
  
  // Empty state
  EMPTY_STATE_MESSAGE: 'No loan applications yet. Create one using the form.',
  
  // Table headers
  TH_APPLICANT: 'Applicant',
  TH_AMOUNT: 'Amount',
  TH_TERM: 'Term',
  TH_RATE: 'Rate',
  TH_MONTHLY_PAYMENT: 'Monthly Payment',
  TH_STATUS: 'Status',
  TH_CREATED: 'Created',
  TH_ACTIONS: 'Actions',
  
  // Status badges
  STATUS_PENDING: 'pending',
  STATUS_APPROVED: 'approved',
  STATUS_REJECTED: 'rejected',
  
  // Summary cards
  STAT_TOTAL: 'Total Applications',
  STAT_PENDING: 'Pending',
  STAT_APPROVED: 'Approved',
  STAT_REJECTED: 'Rejected',
  STAT_TOTAL_APPROVED: 'Total Approved',
  
  // Error messages
  ERROR_NAME_REQUIRED: 'Applicant name is required',
  ERROR_AMOUNT_POSITIVE: 'Amount must be greater than 0',
  ERROR_TERM_POSITIVE: 'Term months must be greater than 0',
  ERROR_RATE_REQUIRED: 'Interest rate is required and cannot be negative',
  
  // Test data
  TEST_APPLICANT_NAME: 'John Doe',
  TEST_APPLICANT_NAME_2: 'Jane Smith',
  TEST_APPLICANT_NAME_3: 'Bob Johnson',
} as const;

export const SELECTORS = {
  // Form inputs
  INPUT_APPLICANT_NAME: '#applicantName',
  INPUT_AMOUNT: '#amount',
  INPUT_TERM: '#termMonths',
  INPUT_INTEREST_RATE: '#interestRate',
  
  // Buttons
  BTN_SUBMIT: 'button[type="submit"]',
  BTN_APPROVE: '[data-testid="approve-btn"]',
  BTN_REJECT: '[data-testid="reject-btn"]',
  BTN_AUTO_DECIDE: '[data-testid="auto-decide-btn"]',
  
  // Cards
  CARD_TOTAL: '[data-testid="total-card"]',
  CARD_PENDING: '[data-testid="pending-card"]',
  CARD_APPROVED: '[data-testid="approved-card"]',
  CARD_REJECTED: '[data-testid="rejected-card"]',
  CARD_AMOUNT: '[data-testid="amount-card"]',
  
  // Other
  ERROR_MESSAGE: '.error-message',
  EMPTY_STATE: '.empty-state',
  TABLE: 'table',
  TABLE_ROW: 'tbody tr',
  STATUS_BADGE: '.status-badge',
} as const;

export const TEST_MESSAGES = {
  // Expect messages
  EXPECT_PAGE_TITLE: 'Page title should be correct',
  EXPECT_FORM_VISIBLE: 'Loan form should be visible',
  EXPECT_LOAN_CREATED: 'Loan should be created successfully',
  EXPECT_LOAN_VISIBLE: 'Loan should be visible in the table',
  EXPECT_STATUS_UPDATED: 'Loan status should be updated',
  EXPECT_STATS_UPDATED: 'Statistics should be updated',
  EXPECT_ERROR_SHOWN: 'Error message should be shown',
  EXPECT_FIELD_CLEARED: 'Form field should be cleared after submission',
  EXPECT_MONTHLY_PAYMENT: 'Monthly payment should be calculated correctly',
  EXPECT_EMPTY_STATE: 'Empty state should be shown when no loans exist',
} as const;
