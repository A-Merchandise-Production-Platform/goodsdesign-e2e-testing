import test from "@playwright/test";

test.describe('Customer Feedback', () => {
    test("Customer login and Feedback", async ({ page }) => {
      await page.goto('https://goodsdesign.uydev.id.vn/login');
  
      await page.waitForSelector('input[type="email"]');
      await page.waitForSelector('input[type="password"]');
  
      await page.fill('input[type="email"]', 'customer@gmail.com');
      await page.fill('input[type="password"]', '123456');
  
      await page.click('button[type="submit"]');
  
      await page.waitForURL('**/'); 

      // Click avatar button in header to open dropdown menu
      await page.click('button[data-slot="dropdown-menu-trigger"]:has(span[data-slot="avatar"])');

      // Click My Order in the dropdown menu
      await page.click('div[role="menuitem"]:has-text("My Order")');

      // Wait for the orders table to load
      await page.waitForSelector('table[data-slot="table"]');

      // Find and click the first order's Details button
      const detailsButton = page.locator('a[href^="/my-order/"] button:has-text("Details")').first();
      await detailsButton.click();

      // Wait for order details page to load
      await page.waitForURL('**/my-order/*');
      await page.waitForSelector('div[role="status"]', { state: 'hidden' });

      // Wait for and click the feedback button
      await page.waitForSelector('div:has-text("Rate Your Order")');

      // Wait for feedback dialog to appear
      await page.waitForSelector('div[role="dialog"]');

      // Select 5 stars
      const starButtons = page.locator('div[role="dialog"] button[data-slot="button"]');
      await starButtons.nth(4).click();

      // Fill in feedback comment
      await page.fill('textarea[id="comment"]', 'Great service and product quality!');

      // Submit feedback
      await page.click('button:has-text("Submit Feedback")');

      // Wait for success message
      await page.waitForSelector('div:has-text("Thank you for your feedback!")', { timeout: 5000 });
    });
});
      
      
      