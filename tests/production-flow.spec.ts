import { test, expect } from '@playwright/test';

test.describe('Production Flow', () => {
  test('Factory Production Flow', async ({ page }) => {
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

    await page.waitForURL('**/factory/orders/*');

    // Wait for and click the main Accept Order button in the action area
    await page.waitForSelector('div[data-slot="card"]:has(div[data-slot="alert"]) button:has-text("Accept Order")');
    await page.click('div[data-slot="card"]:has(div[data-slot="alert"]) button:has-text("Accept Order")');

    // Wait for and click the confirmation dialog Accept Order button
    await page.waitForSelector('div[role="dialog"] button:has-text("Accept Order")');
    await page.click('div[role="dialog"] button:has-text("Accept Order")');

    // Select Items tab
    await page.waitForSelector('[data-slot="tabs-trigger"]:has-text("Items")');
    await page.click('[data-slot="tabs-trigger"]:has-text("Items")');

    // Wait for items to load and find Complete Production button
    await page.waitForSelector('button:has-text("Complete Production")');

    // Get all Complete Production buttons and click them
    const completeButtons = page.locator('button:has-text("Complete Production")');
    const count = await completeButtons.count();
    
    for (let i = 0; i < count; i++) {
      // Wait for the button to be visible and clickable
      await completeButtons.nth(i).waitFor({ state: 'visible' });
      await completeButtons.nth(i).click();

      // Wait for confirmation dialog if it appears
      const dialogButton = page.locator('div[role="dialog"] button:has-text("Complete Production")');
      if (await dialogButton.isVisible()) {
        await dialogButton.click();
      }

      // Wait for the status to update in the order items section
      await page.waitForSelector('div[data-slot="card-content"] span[data-slot="badge"]:has-text("Quality Check")', { timeout: 5000 }).catch(() => {
        // If status doesn't change, continue with next item
        console.log('Status update not detected, continuing with next item');
      });

      // Small delay between items
      await page.waitForTimeout(1000);
    }

    // Verify all items are in Quality Check status within the order items section
    const qualityCheckBadges = page.locator('div[data-slot="card-content"] span[data-slot="badge"]:has-text("Quality Check")');
    const qualityCheckCount = await qualityCheckBadges.count();
    expect(qualityCheckCount).toBe(count);
  });
});

