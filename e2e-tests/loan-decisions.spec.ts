import { test } from '@playwright/test';
import { AppPage } from './pages/AppPage';
import { TEXTS } from './texts/texts';
import { TestData, formatCurrencyNoDecimals } from './helpers/testHelpers';

test.describe('Loan Decision Workflows', () => {
  let appPage: AppPage;

  test.beforeEach(async ({ page }) => {
    appPage = new AppPage(page);
    await appPage.navigateToApp();
    await appPage.setupCleanState();
  });

  test('should approve a loan manually', async () => {
    const loanData = TestData.approvedLoan;

    await test.step('Create a pending loan', async () => {
      await appPage.loanForm.createLoanApplication(
        loanData.applicantName,
        loanData.amount,
        loanData.termMonths,
        loanData.interestRate
      );
      await appPage.loanList.expectStatus(TEXTS.STATUS_PENDING, 0);
    });

    await test.step('Approve the loan', async () => {
      await appPage.loanList.approveLoan(0);
    });

    await test.step('Verify loan status is approved', async () => {
      await appPage.loanList.expectStatus(TEXTS.STATUS_APPROVED, 0);
    });

    await test.step('Verify action buttons are no longer visible', async () => {
      await appPage.loanList.expectNoActionButtons(0);
    });

    await test.step('Verify statistics are updated', async () => {
      const expectedAmount = formatCurrencyNoDecimals(loanData.amount);
      await appPage.loanSummary.expectStatistics(1, 0, 1, 0, expectedAmount);
    });
  });

  test('should reject a loan manually', async () => {
    const loanData = TestData.approvedLoan;

    await test.step('Create a pending loan', async () => {
      await appPage.loanForm.createLoanApplication(
        loanData.applicantName,
        loanData.amount,
        loanData.termMonths,
        loanData.interestRate
      );
      await appPage.loanList.expectStatus(TEXTS.STATUS_PENDING, 0);
    });

    await test.step('Reject the loan', async () => {
      await appPage.loanList.rejectLoan(0);
    });

    await test.step('Verify loan status is rejected', async () => {
      await appPage.loanList.expectStatus(TEXTS.STATUS_REJECTED, 0);
    });

    await test.step('Verify action buttons are no longer visible', async () => {
      await appPage.loanList.expectNoActionButtons(0);
    });

    await test.step('Verify statistics are updated', async () => {
      await appPage.loanSummary.expectStatistics(1, 0, 0, 1, '$0');
    });
  });

  test('should auto-approve loan meeting criteria (≤$100k and ≤60 months)', async () => {
    const loanData = TestData.approvedLoan; // $50k, 36 months

    await test.step('Create a pending loan', async () => {
      await appPage.loanForm.createLoanApplication(
        loanData.applicantName,
        loanData.amount,
        loanData.termMonths,
        loanData.interestRate
      );
    });

    await test.step('Use auto-decide', async () => {
      await appPage.loanList.autoDecideLoan(0);
    });

    await test.step('Verify loan is approved', async () => {
      await appPage.loanList.expectStatus(TEXTS.STATUS_APPROVED, 0);
    });

    await test.step('Verify statistics show approved loan', async () => {
      const expectedAmount = formatCurrencyNoDecimals(loanData.amount);
      await appPage.loanSummary.expectStatistics(1, 0, 1, 0, expectedAmount);
    });
  });

  test('should auto-reject loan exceeding amount limit (>$100k)', async () => {
    const loanData = TestData.rejectedLoanHighAmount; // $150k, 36 months

    await test.step('Create a pending loan with high amount', async () => {
      await appPage.loanForm.createLoanApplication(
        loanData.applicantName,
        loanData.amount,
        loanData.termMonths,
        loanData.interestRate
      );
    });

    await test.step('Use auto-decide', async () => {
      await appPage.loanList.autoDecideLoan(0);
    });

    await test.step('Verify loan is rejected', async () => {
      await appPage.loanList.expectStatus(TEXTS.STATUS_REJECTED, 0);
    });

    await test.step('Verify statistics show rejected loan', async () => {
      await appPage.loanSummary.expectStatistics(1, 0, 0, 1, '$0');
    });
  });

  test('should auto-reject loan exceeding term limit (>60 months)', async () => {
    const loanData = TestData.rejectedLoanLongTerm; // $50k, 72 months

    await test.step('Create a pending loan with long term', async () => {
      await appPage.loanForm.createLoanApplication(
        loanData.applicantName,
        loanData.amount,
        loanData.termMonths,
        loanData.interestRate
      );
    });

    await test.step('Use auto-decide', async () => {
      await appPage.loanList.autoDecideLoan(0);
    });

    await test.step('Verify loan is rejected', async () => {
      await appPage.loanList.expectStatus(TEXTS.STATUS_REJECTED, 0);
    });

    await test.step('Verify statistics show rejected loan', async () => {
      await appPage.loanSummary.expectStatistics(1, 0, 0, 1, '$0');
    });
  });

  test('should auto-approve loan at exact boundary ($100k, 60 months)', async () => {
    const loanData = TestData.boundaryLoan; // $100k, 60 months

    await test.step('Create a pending loan at boundary', async () => {
      await appPage.loanForm.createLoanApplication(
        loanData.applicantName,
        loanData.amount,
        loanData.termMonths,
        loanData.interestRate
      );
    });

    await test.step('Use auto-decide', async () => {
      await appPage.loanList.autoDecideLoan(0);
    });

    await test.step('Verify loan is approved', async () => {
      await appPage.loanList.expectStatus(TEXTS.STATUS_APPROVED, 0);
    });

    await test.step('Verify statistics show approved loan', async () => {
      const expectedAmount = formatCurrencyNoDecimals(loanData.amount);
      await appPage.loanSummary.expectStatistics(1, 0, 1, 0, expectedAmount);
    });
  });

  test('should handle multiple loan decisions correctly', async () => {
    await test.step('Create and approve first loan', async () => {
      const loan1 = TestData.approvedLoan;
      await appPage.loanForm.createLoanApplication(
        loan1.applicantName,
        loan1.amount,
        loan1.termMonths,
        loan1.interestRate
      );
      await appPage.loanList.approveLoan(0);
    });

    await test.step('Create and reject second loan', async () => {
      const loan2 = TestData.smallLoan;
      await appPage.loanForm.createLoanApplication(
        loan2.applicantName,
        loan2.amount,
        loan2.termMonths,
        loan2.interestRate
      );
      await appPage.loanList.rejectLoan(1);
    });

    await test.step('Create and auto-decide third loan', async () => {
      const loan3 = TestData.rejectedLoanHighAmount;
      await appPage.loanForm.createLoanApplication(
        loan3.applicantName,
        loan3.amount,
        loan3.termMonths,
        loan3.interestRate
      );
      await appPage.loanList.autoDecideLoan(2);
    });

    await test.step('Verify all loan statuses', async () => {
      await appPage.loanList.expectStatus(TEXTS.STATUS_APPROVED, 0);
      await appPage.loanList.expectStatus(TEXTS.STATUS_REJECTED, 1);
      await appPage.loanList.expectStatus(TEXTS.STATUS_REJECTED, 2);
    });

    await test.step('Verify final statistics', async () => {
      const expectedAmount = formatCurrencyNoDecimals(TestData.approvedLoan.amount);
      await appPage.loanSummary.expectStatistics(3, 0, 1, 2, expectedAmount);
    });
  });

  test('should calculate total approved amount correctly with multiple approvals', async () => {
    await test.step('Create and approve first loan', async () => {
      const loan1 = TestData.approvedLoan;
      await appPage.loanForm.createLoanApplication(
        loan1.applicantName,
        loan1.amount,
        loan1.termMonths,
        loan1.interestRate
      );
      await appPage.loanList.approveLoan(0);
    });

    await test.step('Create and approve second loan', async () => {
      const loan2 = TestData.smallLoan;
      await appPage.loanForm.createLoanApplication(
        loan2.applicantName,
        loan2.amount,
        loan2.termMonths,
        loan2.interestRate
      );
      await appPage.loanList.approveLoan(1);
    });

    await test.step('Verify total approved amount', async () => {
      const totalAmount = TestData.approvedLoan.amount + TestData.smallLoan.amount;
      const expectedAmount = formatCurrencyNoDecimals(totalAmount);
      await appPage.loanSummary.expectTotalApprovedAmount(expectedAmount);
    });

    await test.step('Verify complete statistics', async () => {
      const totalAmount = TestData.approvedLoan.amount + TestData.smallLoan.amount;
      const expectedAmount = formatCurrencyNoDecimals(totalAmount);
      await appPage.loanSummary.expectStatistics(2, 0, 2, 0, expectedAmount);
    });
  });
});
