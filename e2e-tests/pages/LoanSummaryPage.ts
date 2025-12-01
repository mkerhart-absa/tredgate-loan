import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SELECTORS, TEST_MESSAGES } from '../texts/texts';

/**
 * Page Object for Loan Summary component
 */
export class LoanSummaryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  get totalCard() {
    return this.getElement(SELECTORS.CARD_TOTAL);
  }

  get pendingCard() {
    return this.getElement(SELECTORS.CARD_PENDING);
  }

  get approvedCard() {
    return this.getElement(SELECTORS.CARD_APPROVED);
  }

  get rejectedCard() {
    return this.getElement(SELECTORS.CARD_REJECTED);
  }

  get amountCard() {
    return this.getElement(SELECTORS.CARD_AMOUNT);
  }

  // Atomic methods
  async getTotalCount(): Promise<number> {
    const text = await this.totalCard.locator('.stat-value').textContent();
    return parseInt(text || '0', 10);
  }

  async getPendingCount(): Promise<number> {
    const text = await this.pendingCard.locator('.stat-value').textContent();
    return parseInt(text || '0', 10);
  }

  async getApprovedCount(): Promise<number> {
    const text = await this.approvedCard.locator('.stat-value').textContent();
    return parseInt(text || '0', 10);
  }

  async getRejectedCount(): Promise<number> {
    const text = await this.rejectedCard.locator('.stat-value').textContent();
    return parseInt(text || '0', 10);
  }

  async getTotalApprovedAmount(): Promise<string> {
    const text = await this.amountCard.locator('.stat-value').textContent();
    return text || '$0';
  }

  async isSummaryVisible(): Promise<boolean> {
    return await this.totalCard.isVisible();
  }

  // Expects (assertions within page object)
  async expectTotalCount(
    expected: number,
    message: string = 'Total count should be correct'
  ): Promise<void> {
    const actual = await this.getTotalCount();
    expect(actual, message).toBe(expected);
  }

  async expectPendingCount(
    expected: number,
    message: string = 'Pending count should be correct'
  ): Promise<void> {
    const actual = await this.getPendingCount();
    expect(actual, message).toBe(expected);
  }

  async expectApprovedCount(
    expected: number,
    message: string = 'Approved count should be correct'
  ): Promise<void> {
    const actual = await this.getApprovedCount();
    expect(actual, message).toBe(expected);
  }

  async expectRejectedCount(
    expected: number,
    message: string = 'Rejected count should be correct'
  ): Promise<void> {
    const actual = await this.getRejectedCount();
    expect(actual, message).toBe(expected);
  }

  async expectTotalApprovedAmount(
    expected: string,
    message: string = 'Total approved amount should be correct'
  ): Promise<void> {
    const actual = await this.getTotalApprovedAmount();
    expect(actual, message).toBe(expected);
  }

  async expectSummaryVisible(
    message: string = 'Summary cards should be visible'
  ): Promise<void> {
    await expect(this.totalCard, message).toBeVisible();
    await expect(this.pendingCard, message).toBeVisible();
    await expect(this.approvedCard, message).toBeVisible();
    await expect(this.rejectedCard, message).toBeVisible();
    await expect(this.amountCard, message).toBeVisible();
  }

  async expectStatistics(
    total: number,
    pending: number,
    approved: number,
    rejected: number,
    totalAmount: string,
    message: string = TEST_MESSAGES.EXPECT_STATS_UPDATED
  ): Promise<void> {
    await this.expectTotalCount(total, message);
    await this.expectPendingCount(pending, message);
    await this.expectApprovedCount(approved, message);
    await this.expectRejectedCount(rejected, message);
    await this.expectTotalApprovedAmount(totalAmount, message);
  }
}
