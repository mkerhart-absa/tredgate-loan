import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { SELECTORS, TEXTS, TEST_MESSAGES } from '../texts/texts';

/**
 * Page Object for Loan List component
 */
export class LoanListPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  get emptyState() {
    return this.getElement(SELECTORS.EMPTY_STATE);
  }

  get table() {
    return this.getElement(SELECTORS.TABLE);
  }

  get tableRows() {
    return this.getElement(SELECTORS.TABLE_ROW);
  }

  // Atomic methods
  async getRowCount(): Promise<number> {
    return await this.tableRows.count();
  }

  async isTableVisible(): Promise<boolean> {
    return await this.table.isVisible();
  }

  async isEmptyStateVisible(): Promise<boolean> {
    try {
      return await this.emptyState.isVisible();
    } catch {
      return false;
    }
  }

  async getRowByIndex(index: number): Promise<Locator> {
    return this.tableRows.nth(index);
  }

  async getCellText(rowIndex: number, cellIndex: number): Promise<string> {
    const row = await this.getRowByIndex(rowIndex);
    const cell = row.locator('td').nth(cellIndex);
    return await cell.textContent() || '';
  }

  async getApplicantName(rowIndex: number): Promise<string> {
    return await this.getCellText(rowIndex, 0);
  }

  async getAmount(rowIndex: number): Promise<string> {
    return await this.getCellText(rowIndex, 1);
  }

  async getTerm(rowIndex: number): Promise<string> {
    return await this.getCellText(rowIndex, 2);
  }

  async getInterestRate(rowIndex: number): Promise<string> {
    return await this.getCellText(rowIndex, 3);
  }

  async getMonthlyPayment(rowIndex: number): Promise<string> {
    return await this.getCellText(rowIndex, 4);
  }

  async getStatus(rowIndex: number): Promise<string> {
    return await this.getCellText(rowIndex, 5);
  }

  async getCreatedDate(rowIndex: number): Promise<string> {
    return await this.getCellText(rowIndex, 6);
  }

  async clickApproveButton(rowIndex: number = 0): Promise<void> {
    const row = await this.getRowByIndex(rowIndex);
    const approveBtn = row.locator(SELECTORS.BTN_APPROVE);
    await approveBtn.click();
  }

  async clickRejectButton(rowIndex: number = 0): Promise<void> {
    const row = await this.getRowByIndex(rowIndex);
    const rejectBtn = row.locator(SELECTORS.BTN_REJECT);
    await rejectBtn.click();
  }

  async clickAutoDecideButton(rowIndex: number = 0): Promise<void> {
    const row = await this.getRowByIndex(rowIndex);
    const autoDecideBtn = row.locator(SELECTORS.BTN_AUTO_DECIDE);
    await autoDecideBtn.click();
  }

  async isApproveButtonVisible(rowIndex: number = 0): Promise<boolean> {
    const row = await this.getRowByIndex(rowIndex);
    const approveBtn = row.locator(SELECTORS.BTN_APPROVE);
    return await approveBtn.isVisible();
  }

  async isRejectButtonVisible(rowIndex: number = 0): Promise<boolean> {
    const row = await this.getRowByIndex(rowIndex);
    const rejectBtn = row.locator(SELECTORS.BTN_REJECT);
    return await rejectBtn.isVisible();
  }

  async isAutoDecideButtonVisible(rowIndex: number = 0): Promise<boolean> {
    const row = await this.getRowByIndex(rowIndex);
    const autoDecideBtn = row.locator(SELECTORS.BTN_AUTO_DECIDE);
    return await autoDecideBtn.isVisible();
  }

  // Grouped methods
  async approveLoan(rowIndex: number = 0): Promise<void> {
    await this.clickApproveButton(rowIndex);
    await this.page.waitForTimeout(100); // Wait for state update
  }

  async rejectLoan(rowIndex: number = 0): Promise<void> {
    await this.clickRejectButton(rowIndex);
    await this.page.waitForTimeout(100); // Wait for state update
  }

  async autoDecideLoan(rowIndex: number = 0): Promise<void> {
    await this.clickAutoDecideButton(rowIndex);
    await this.page.waitForTimeout(100); // Wait for state update
  }

  // Expects (assertions within page object)
  async expectLoanInTable(
    applicantName: string,
    rowIndex: number = 0,
    message: string = TEST_MESSAGES.EXPECT_LOAN_VISIBLE
  ): Promise<void> {
    const actualName = await this.getApplicantName(rowIndex);
    expect(actualName, message).toBe(applicantName);
  }

  async expectTableVisible(message: string = 'Table should be visible'): Promise<void> {
    await expect(this.table, message).toBeVisible();
  }

  async expectEmptyState(message: string = TEST_MESSAGES.EXPECT_EMPTY_STATE): Promise<void> {
    await expect(this.emptyState, message).toBeVisible();
    await expect(this.emptyState, message).toContainText(TEXTS.EMPTY_STATE_MESSAGE);
  }

  async expectRowCount(count: number, message: string = 'Row count should match'): Promise<void> {
    await expect(this.tableRows, message).toHaveCount(count);
  }

  async expectStatus(
    status: string,
    rowIndex: number = 0,
    message: string = TEST_MESSAGES.EXPECT_STATUS_UPDATED
  ): Promise<void> {
    const row = await this.getRowByIndex(rowIndex);
    const statusBadge = row.locator(SELECTORS.STATUS_BADGE);
    await expect(statusBadge, message).toContainText(status);
  }

  async expectActionButtonsVisible(
    rowIndex: number = 0,
    message: string = 'Action buttons should be visible for pending loans'
  ): Promise<void> {
    const isApproveVisible = await this.isApproveButtonVisible(rowIndex);
    const isRejectVisible = await this.isRejectButtonVisible(rowIndex);
    const isAutoDecideVisible = await this.isAutoDecideButtonVisible(rowIndex);
    
    expect(isApproveVisible && isRejectVisible && isAutoDecideVisible, message).toBe(true);
  }

  async expectNoActionButtons(
    rowIndex: number = 0,
    message: string = 'Action buttons should not be visible for approved/rejected loans'
  ): Promise<void> {
    const isApproveVisible = await this.isApproveButtonVisible(rowIndex);
    const isRejectVisible = await this.isRejectButtonVisible(rowIndex);
    
    expect(isApproveVisible || isRejectVisible, message).toBe(false);
  }
}
