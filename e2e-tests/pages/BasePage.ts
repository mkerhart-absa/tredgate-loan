import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object class with common methods
 * All page objects should extend this class
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a URL
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get element by selector
   */
  getElement(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Get element by text
   */
  getElementByText(text: string): Locator {
    return this.page.getByText(text);
  }

  /**
   * Get element by role
   */
  getElementByRole(role: 'button' | 'textbox' | 'heading' | 'table' | 'cell' | 'row', options?: { name?: string }): Locator {
    return this.page.getByRole(role, options);
  }

  /**
   * Click on element
   */
  async click(selector: string): Promise<void> {
    await this.page.locator(selector).click();
  }

  /**
   * Fill input field
   */
  async fill(selector: string, value: string): Promise<void> {
    await this.page.locator(selector).fill(value);
  }

  /**
   * Get text content of element
   */
  async getTextContent(selector: string): Promise<string> {
    const text = await this.page.locator(selector).textContent();
    return text || '';
  }

  /**
   * Check if element is visible
   */
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string, timeout?: number): Promise<void> {
    await this.page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  /**
   * Get count of elements matching selector
   */
  async getElementCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  /**
   * Clear localStorage
   */
  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
  }

  /**
   * Reload the page
   */
  async reload(): Promise<void> {
    await this.page.reload();
  }
}
