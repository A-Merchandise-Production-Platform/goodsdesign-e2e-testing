import { test, expect } from '@playwright/test';

test.describe('Shipping Flow', () => {
  test('Factory Shipping Flow', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://goodsdesign.uydev.id.vn/login');

    // Wait for login form to be visible
    await page.waitForSelector('input[type="email"]');
    await page.waitForSelector('input[type="password"]');

    // Fill in login credentials
    await page.fill('input[type="email"]', 'factory@gmail.com');
    await page.fill('input[type="password"]', '123456');

    // Click login button
    await page.click('button[type="submit"]');

    // Wait for navigation after successful login
    await page.waitForURL('**/factory');

    // Navigate to factory orders page
    await page.goto('https://goodsdesign.uydev.id.vn/factory/orders');

    // Wait for orders to load and find first pending order
    await page.waitForSelector('button:has-text("View Details")');

    // Find the first "View Details" button for a pending order
    const viewDetailsButton = page.locator('button:has-text("View Details")').first();
    await viewDetailsButton.click();

    // Wait for order details page to load
    await page.waitForURL('**/factory/orders/*');

    // Wait for and click the Start Shipping button
    await page.waitForSelector('div[data-slot="card"]:has(div[data-slot="alert"]) button:has-text("Start Shipping")');
    await page.click('div[data-slot="card"]:has(div[data-slot="alert"]) button:has-text("Start Shipping")');

    // Wait for and click the confirmation dialog Start Shipping button
    await page.waitForSelector('div[role="dialog"] button:has-text("Start Shipping")');
    await page.click('div[role="dialog"] button:has-text("Start Shipping")');

    // Wait for success message
    await page.waitForSelector('div:has-text("Shipping started successfully")', { timeout: 5000 });

    // Wait for and click the Done Shipping button
    await page.waitForSelector('div[data-slot="card"]:has(div[data-slot="alert"]) button:has-text("Done Shipping")');
    await page.click('div[data-slot="card"]:has(div[data-slot="alert"]) button:has-text("Done Shipping")');

    // Wait for and click the confirmation dialog Done Shipping button
    await page.waitForSelector('div[role="dialog"] button:has-text("Done Shipping")');
    await page.click('div[role="dialog"] button:has-text("Done Shipping")');

    // Wait for success message
    await page.waitForSelector('div:has-text("[MOCK] Shipping completed successfully")', { timeout: 5000 });
  });
});

