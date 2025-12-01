import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SELECTORS, TEXTS, TEST_MESSAGES } from '../texts/texts';

/**
 * Page Object for Loan Form component
 */
export class LoanFormPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  get applicantNameInput() {
    return this.getElement(SELECTORS.INPUT_APPLICANT_NAME);
  }

  get amountInput() {
    return this.getElement(SELECTORS.INPUT_AMOUNT);
  }

  get termInput() {
    return this.getElement(SELECTORS.INPUT_TERM);
  }

  get interestRateInput() {
    return this.getElement(SELECTORS.INPUT_INTEREST_RATE);
  }

  get submitButton() {
    return this.getElement(SELECTORS.BTN_SUBMIT);
  }

  get errorMessage() {
    return this.getElement(SELECTORS.ERROR_MESSAGE);
  }

  // Atomic methods
  async fillApplicantName(name: string): Promise<void> {
    await this.applicantNameInput.fill(name);
  }

  async fillAmount(amount: string | number): Promise<void> {
    await this.amountInput.fill(amount.toString());
  }

  async fillTerm(term: string | number): Promise<void> {
    await this.termInput.fill(term.toString());
  }

  async fillInterestRate(rate: string | number): Promise<void> {
    await this.interestRateInput.fill(rate.toString());
  }

  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  async getErrorMessageText(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async isFormVisible(): Promise<boolean> {
    return await this.applicantNameInput.isVisible();
  }

  async getApplicantNameValue(): Promise<string> {
    return await this.applicantNameInput.inputValue();
  }

  async getAmountValue(): Promise<string> {
    return await this.amountInput.inputValue();
  }

  async getTermValue(): Promise<string> {
    return await this.termInput.inputValue();
  }

  async getInterestRateValue(): Promise<string> {
    return await this.interestRateInput.inputValue();
  }

  // Grouped methods with test.step
  async createLoanApplication(
    applicantName: string,
    amount: number,
    term: number,
    interestRate: number
  ): Promise<void> {
    await this.page.evaluate(() => {}); // Test step wrapper will be in actual tests
    await this.fillApplicantName(applicantName);
    await this.fillAmount(amount);
    await this.fillTerm(term);
    await this.fillInterestRate(interestRate);
    await this.clickSubmit();
  }

  async submitEmptyForm(): Promise<void> {
    await this.clickSubmit();
  }

  // Expects (assertions within page object)
  async expectFormVisible(message: string = TEST_MESSAGES.EXPECT_FORM_VISIBLE): Promise<void> {
    await expect(this.applicantNameInput, message).toBeVisible();
  }

  async expectErrorMessage(expectedError: string, message: string = TEST_MESSAGES.EXPECT_ERROR_SHOWN): Promise<void> {
    await expect(this.errorMessage, message).toBeVisible();
    await expect(this.errorMessage, message).toContainText(expectedError);
  }

  async expectFormCleared(message: string = TEST_MESSAGES.EXPECT_FIELD_CLEARED): Promise<void> {
    await expect(this.applicantNameInput, message).toHaveValue('');
    await expect(this.amountInput, message).toHaveValue('');
    await expect(this.termInput, message).toHaveValue('');
    await expect(this.interestRateInput, message).toHaveValue('');
  }

  async expectNoError(): Promise<void> {
    await expect(this.errorMessage).not.toBeVisible();
  }
}
