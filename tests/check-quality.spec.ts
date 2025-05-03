import { test, expect } from '@playwright/test';

test.describe('Quality Check Flow', () => {
  test('Staff Quality Check Flow', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://goodsdesign.uydev.id.vn/login');

    // Wait for login form to be visible
    await page.waitForSelector('input[type="email"]');
    await page.waitForSelector('input[type="password"]');

    // Fill in login credentials
    await page.fill('input[type="email"]', 'staff@gmail.com');
    await page.fill('input[type="password"]', '123456');

    // Click login button
    await page.click('button[type="submit"]');

    // Wait for navigation after successful login
    await page.waitForURL('**/staff');

    // Navigate to staff tasks page
    await page.goto('https://goodsdesign.uydev.id.vn/staff/tasks');

    // Wait for tasks to load and find first task
    await page.waitForSelector('button:has-text("View Details")');
    
    // Find the first "View Details" button
    const viewDetailsButton = page.locator('button:has-text("View Details")').first();
    await viewDetailsButton.click();

    // Wait for task details page to load
    await page.waitForURL('**/staff/tasks/*');

    // Wait for product selection dropdown
    await page.waitForSelector('button[role="combobox"]');
    await page.click('button[role="combobox"]');

    // Select the first product in dropdown
    await page.waitForSelector('[role="option"]');
    await page.click('[role="option"]');

    // Switch to Quality Check Form tab
    await page.waitForSelector('[data-slot="tabs-trigger"]:has-text("Quality Check Form")');
    await page.click('[data-slot="tabs-trigger"]:has-text("Quality Check Form")');

    // Wait for quality check form to load
    await page.waitForSelector('input[id="passedQuantity"]');

    // Get the quantity from the product details section
    const quantityText = await page.locator('div:has-text("Quantity")').locator('p.font-medium').nth(3).textContent();
    const quantity = parseInt(quantityText || '1');

    // Fill in quality check form
    await page.fill('input[id="passedQuantity"]', quantity.toString());
    await page.fill('input[id="failedQuantity"]', '0');
    await page.fill('textarea[id="note"]', 'Product passed all quality checks. No defects found.');

    // Wait for the Complete Quality Check button to be enabled
    await page.waitForSelector('button:has-text("Complete Quality Check"):not([disabled])');
    
    // Click the Complete Quality Check button
    await page.click('button:has-text("Complete Quality Check")');

    // Wait for success message or status update
    await page.waitForSelector('div:has-text("Quality check completed successfully")', { timeout: 5000 });
  });
});
