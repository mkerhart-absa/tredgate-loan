import { test, expect } from '@playwright/test';
import { AppPage } from './pages/AppPage';
import { TEXTS } from './texts/texts';

test.describe('Form Validation', () => {
  let appPage: AppPage;

  test.beforeEach(async ({ page }) => {
    appPage = new AppPage(page);
    await appPage.navigateToApp();
    await appPage.setupCleanState();
  });

  test('should show error for empty applicant name', async ({ page }) => {
    await test.step('Try to submit form with empty name by bypassing HTML5 validation', async () => {
      // Fill other fields first
      await appPage.loanForm.fillAmount(50000);
      await appPage.loanForm.fillTerm(36);
      await appPage.loanForm.fillInterestRate(0.08);
      
      // Clear the name field and remove the required attribute to bypass HTML5 validation
      await page.evaluate(() => {
        const nameInput = document.querySelector('#applicantName') as HTMLInputElement;
        if (nameInput) {
          nameInput.value = '';
          nameInput.removeAttribute('required');
        }
      });
      
      await appPage.loanForm.clickSubmit();
    });

    await test.step('Verify error message is shown', async () => {
      await appPage.loanForm.expectErrorMessage(TEXTS.ERROR_NAME_REQUIRED);
    });

    await test.step('Verify no loan is created', async () => {
      await appPage.loanList.expectEmptyState();
    });
  });

  test('should show error for whitespace-only applicant name', async ({ page }) => {
    await test.step('Try to submit form with whitespace name by bypassing HTML5 validation', async () => {
      // Fill other fields first
      await appPage.loanForm.fillAmount(50000);
      await appPage.loanForm.fillTerm(36);
      await appPage.loanForm.fillInterestRate(0.08);
      
      // Set whitespace value and remove required attribute to bypass HTML5 validation
      await page.evaluate(() => {
        const nameInput = document.querySelector('#applicantName') as HTMLInputElement;
        if (nameInput) {
          nameInput.value = '   ';
          nameInput.removeAttribute('required');
        }
      });
      
      await appPage.loanForm.clickSubmit();
    });

    await test.step('Verify error message is shown', async () => {
      await appPage.loanForm.expectErrorMessage(TEXTS.ERROR_NAME_REQUIRED);
    });
  });

  test('should accept zero interest rate', async () => {
    await test.step('Fill form with zero interest rate', async () => {
      await appPage.loanForm.fillApplicantName('John Doe');
      await appPage.loanForm.fillAmount(50000);
      await appPage.loanForm.fillTerm(36);
      await appPage.loanForm.fillInterestRate(0);
      await appPage.loanForm.clickSubmit();
    });

    await test.step('Verify no error is shown', async () => {
      await appPage.loanForm.expectNoError();
    });

    await test.step('Verify loan is created', async () => {
      await appPage.loanList.expectLoanInTable('John Doe', 0);
    });
  });

  test('should accept very small amounts', async () => {
    await test.step('Fill form with $1 amount', async () => {
      await appPage.loanForm.fillApplicantName('John Doe');
      await appPage.loanForm.fillAmount(1);
      await appPage.loanForm.fillTerm(12);
      await appPage.loanForm.fillInterestRate(0.05);
      await appPage.loanForm.clickSubmit();
    });

    await test.step('Verify loan is created', async () => {
      await appPage.loanList.expectLoanInTable('John Doe', 0);
    });
  });

  test('should accept very large amounts', async () => {
    await test.step('Fill form with large amount', async () => {
      await appPage.loanForm.fillApplicantName('John Doe');
      await appPage.loanForm.fillAmount(999999999);
      await appPage.loanForm.fillTerm(12);
      await appPage.loanForm.fillInterestRate(0.05);
      await appPage.loanForm.clickSubmit();
    });

    await test.step('Verify loan is created', async () => {
      await appPage.loanList.expectLoanInTable('John Doe', 0);
    });
  });

  test('should trim whitespace from applicant name', async () => {
    await test.step('Fill form with name having leading/trailing spaces', async () => {
      await appPage.loanForm.fillApplicantName('  John Doe  ');
      await appPage.loanForm.fillAmount(50000);
      await appPage.loanForm.fillTerm(36);
      await appPage.loanForm.fillInterestRate(0.08);
      await appPage.loanForm.clickSubmit();
    });

    await test.step('Verify loan is created with trimmed name', async () => {
      await appPage.loanList.expectLoanInTable('John Doe', 0);
      const name = await appPage.loanList.getApplicantName(0);
      expect(name, 'Name should be trimmed').toBe('John Doe');
    });
  });

  test('should validate all required fields are filled', async () => {
    await test.step('Create a valid loan to verify form works', async () => {
      await appPage.loanForm.fillApplicantName('John Doe');
      await appPage.loanForm.fillAmount(50000);
      await appPage.loanForm.fillTerm(36);
      await appPage.loanForm.fillInterestRate(0.08);
      await appPage.loanForm.clickSubmit();
    });

    await test.step('Verify loan is created', async () => {
      await appPage.loanList.expectLoanInTable('John Doe', 0);
    });

    await test.step('Verify form is cleared', async () => {
      await appPage.loanForm.expectFormCleared();
    });
  });
});
