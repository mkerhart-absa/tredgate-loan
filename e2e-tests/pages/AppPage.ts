import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoanFormPage } from './LoanFormPage';
import { LoanListPage } from './LoanListPage';
import { LoanSummaryPage } from './LoanSummaryPage';
import { TEXTS, TEST_MESSAGES } from '../texts/texts';

/**
 * Main Application Page Object
 * Combines all page components
 */
export class AppPage extends BasePage {
  readonly loanForm: LoanFormPage;
  readonly loanList: LoanListPage;
  readonly loanSummary: LoanSummaryPage;

  constructor(page: Page) {
    super(page);
    this.loanForm = new LoanFormPage(page);
    this.loanList = new LoanListPage(page);
    this.loanSummary = new LoanSummaryPage(page);
  }

  // App-specific locators
  get appTitle() {
    return this.getElementByRole('heading', { name: TEXTS.APP_TITLE });
  }

  get appTagline() {
    return this.getElementByText(TEXTS.APP_TAGLINE);
  }

  // Navigation and setup
  async navigateToApp(): Promise<void> {
    await this.goto('/');
    await this.waitForNavigation();
  }

  async setupCleanState(): Promise<void> {
    await this.clearLocalStorage();
    await this.reload();
    await this.waitForNavigation();
  }

  // Expects
  async expectAppLoaded(message: string = TEST_MESSAGES.EXPECT_PAGE_TITLE): Promise<void> {
    await expect(this.appTitle, message).toBeVisible();
    await expect(this.appTagline, message).toBeVisible();
  }

  async expectPageTitle(message: string = TEST_MESSAGES.EXPECT_PAGE_TITLE): Promise<void> {
    await expect(this.page, message).toHaveTitle(/Tredgate Loan/);
  }
}
