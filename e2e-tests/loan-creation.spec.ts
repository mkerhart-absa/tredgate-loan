import { test, expect } from '@playwright/test';
import { AppPage } from './pages/AppPage';
import { TEXTS } from './texts/texts';
import { TestData, formatCurrency, formatPercent, calculateMonthlyPayment } from './helpers/testHelpers';

test.describe('Loan Application Creation', () => {
  let appPage: AppPage;

  test.beforeEach(async ({ page }) => {
    appPage = new AppPage(page);
    await appPage.navigateToApp();
    await appPage.setupCleanState();
  });

  test('should load the application correctly', async ({ page }) => {
    await test.step('Verify page title', async () => {
      await appPage.expectPageTitle();
    });

    await test.step('Verify app components are visible', async () => {
      await appPage.expectAppLoaded();
      await appPage.loanForm.expectFormVisible();
      await appPage.loanSummary.expectSummaryVisible();
    });

    await test.step('Verify empty state is shown', async () => {
      await appPage.loanList.expectEmptyState();
    });

    await test.step('Verify initial statistics are zero', async () => {
      await appPage.loanSummary.expectStatistics(0, 0, 0, 0, '$0');
    });
  });

  test('should create a new loan application successfully', async ({ page }) => {
    const loanData = TestData.approvedLoan;

    await test.step('Fill in loan application form', async () => {
      await appPage.loanForm.createLoanApplication(
        loanData.applicantName,
        loanData.amount,
        loanData.termMonths,
        loanData.interestRate
      );
    });

    await test.step('Verify loan appears in the table', async () => {
      await appPage.loanList.expectTableVisible();
      await appPage.loanList.expectLoanInTable(loanData.applicantName, 0);
      await appPage.loanList.expectRowCount(1);
    });

    await test.step('Verify loan details are correct', async () => {
      const amount = await appPage.loanList.getAmount(0);
      const term = await appPage.loanList.getTerm(0);
      const rate = await appPage.loanList.getInterestRate(0);
      const status = await appPage.loanList.getStatus(0);

      expect(amount, 'Amount should be formatted correctly').toBe(formatCurrency(loanData.amount));
      expect(term, 'Term should be displayed correctly').toContain(`${loanData.termMonths} mo`);
      expect(rate, 'Interest rate should be formatted correctly').toContain(formatPercent(loanData.interestRate));
      expect(status, 'Status should be pending').toContain(TEXTS.STATUS_PENDING);
    });

    await test.step('Verify monthly payment is calculated correctly', async () => {
      const monthlyPayment = await appPage.loanList.getMonthlyPayment(0);
      const expectedPayment = calculateMonthlyPayment(
        loanData.amount,
        loanData.termMonths,
        loanData.interestRate
      );
      expect(monthlyPayment, 'Monthly payment should be calculated correctly').toBe(formatCurrency(expectedPayment));
    });

    await test.step('Verify statistics are updated', async () => {
      await appPage.loanSummary.expectStatistics(1, 1, 0, 0, '$0');
    });

    await test.step('Verify form is cleared after submission', async () => {
      await appPage.loanForm.expectFormCleared();
    });

    await test.step('Verify action buttons are visible for pending loan', async () => {
      await appPage.loanList.expectActionButtonsVisible(0);
    });
  });

  test('should create multiple loan applications', async ({ page }) => {
    await test.step('Create first loan', async () => {
      const loan1 = TestData.approvedLoan;
      await appPage.loanForm.createLoanApplication(
        loan1.applicantName,
        loan1.amount,
        loan1.termMonths,
        loan1.interestRate
      );
    });

    await test.step('Create second loan', async () => {
      const loan2 = TestData.smallLoan;
      await appPage.loanForm.createLoanApplication(
        loan2.applicantName,
        loan2.amount,
        loan2.termMonths,
        loan2.interestRate
      );
    });

    await test.step('Create third loan', async () => {
      const loan3 = TestData.zeroInterestLoan;
      await appPage.loanForm.createLoanApplication(
        loan3.applicantName,
        loan3.amount,
        loan3.termMonths,
        loan3.interestRate
      );
    });

    await test.step('Verify all loans are in the table', async () => {
      await appPage.loanList.expectRowCount(3);
      await appPage.loanList.expectLoanInTable(TestData.approvedLoan.applicantName, 0);
      await appPage.loanList.expectLoanInTable(TestData.smallLoan.applicantName, 1);
      await appPage.loanList.expectLoanInTable(TestData.zeroInterestLoan.applicantName, 2);
    });

    await test.step('Verify statistics show 3 pending loans', async () => {
      await appPage.loanSummary.expectStatistics(3, 3, 0, 0, '$0');
    });
  });

  test('should calculate monthly payment correctly for zero interest rate', async ({ page }) => {
    const loanData = TestData.zeroInterestLoan;

    await test.step('Create loan with 0% interest', async () => {
      await appPage.loanForm.createLoanApplication(
        loanData.applicantName,
        loanData.amount,
        loanData.termMonths,
        loanData.interestRate
      );
    });

    await test.step('Verify monthly payment for zero interest', async () => {
      const monthlyPayment = await appPage.loanList.getMonthlyPayment(0);
      const expectedPayment = loanData.amount / loanData.termMonths;
      expect(monthlyPayment, 'Monthly payment for 0% interest should be amount/term').toBe(
        formatCurrency(expectedPayment)
      );
    });
  });

  test('should handle boundary values correctly', async ({ page }) => {
    const loanData = TestData.boundaryLoan;

    await test.step('Create loan at approval boundary', async () => {
      await appPage.loanForm.createLoanApplication(
        loanData.applicantName,
        loanData.amount,
        loanData.termMonths,
        loanData.interestRate
      );
    });

    await test.step('Verify loan is created', async () => {
      await appPage.loanList.expectLoanInTable(loanData.applicantName, 0);
      await appPage.loanList.expectStatus(TEXTS.STATUS_PENDING, 0);
    });

    await test.step('Verify amount and term at boundary', async () => {
      const amount = await appPage.loanList.getAmount(0);
      const term = await appPage.loanList.getTerm(0);
      
      expect(amount, 'Amount should be $100,000').toBe(formatCurrency(100000));
      expect(term, 'Term should be 60 months').toContain('60 mo');
    });
  });
});
