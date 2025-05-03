import { test, expect } from '@playwright/test';

test.describe('Happy Case - Complete Order Flow', () => {
  test('Complete order flow from customer order to feedback', async ({ page }) => {
    // 1. Customer Order Flow
    await page.goto('https://goodsdesign.uydev.id.vn/login');

    // Customer Login
    await page.waitForSelector('input[type="email"]');
    await page.waitForSelector('input[type="password"]');
    await page.fill('input[type="email"]', 'customer@gmail.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    // Select template and add to cart
    const secondCard = page.locator('[data-slot="card"]').nth(1);
    const useDesignButton = secondCard.locator('button[data-slot="button"]:has-text("Use Design")');
    await useDesignButton.waitFor({ state: 'visible', timeout: 10000 });
    await useDesignButton.click();

    await page.waitForURL('**/product/tshirt/*');
    await page.waitForSelector('button:has-text("Add to cart")', { timeout: 10000 });
    await page.click('button:has-text("Add to cart")');
    await page.waitForSelector('div:has-text("Product has been added to cart")', { timeout: 10000 });

    // Go to cart and checkout
    await page.click('a[href="/cart"] button');
    await page.waitForURL('**/cart');
    await expect(page).toHaveURL(/.*\/cart/);
    await page.waitForSelector('[data-slot="card"]', { timeout: 10000 });
    const checkbox = page.locator('[data-slot="checkbox"]').nth(1);
    await checkbox.click();
    await expect(checkbox).toHaveAttribute('data-state', 'checked');
    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL('**/my-order/*');

    // Payment process
    await page.waitForSelector('[data-slot="tabs-trigger"]:has-text("Payment")', { timeout: 10000 });
    await page.click('[data-slot="tabs-trigger"]:has-text("Payment")');
    await page.click('button:has-text("Pay Now")');

    // Fill payment details
    await page.waitForSelector('#card_number_mask', { timeout: 10000 });
    await page.fill('#card_number_mask', '9704198526191432198');
    await page.waitForSelector('#cardHolder', { timeout: 10000 });
    await page.fill('#cardHolder', 'NGUYEN VAN A');
    await page.waitForSelector('#cardDate', { timeout: 10000 });
    await page.fill('#cardDate', '07/15');
    await page.waitForSelector('#btnContinue', { timeout: 10000 });
    await page.click('#btnContinue');
    await page.waitForSelector('#btnAgree', { timeout: 10000 });
    await page.click('#btnAgree');
    await page.waitForSelector('#otpvalue', { timeout: 10000 });
    await page.fill('#otpvalue', '123456');
    await page.waitForSelector('#btnConfirm', { timeout: 10000 });
    await page.click('#btnConfirm');
    await page.waitForSelector('div:has-text("Successful")', { timeout: 30000 });

    // Log out customer
    await page.click('button[data-slot="dropdown-menu-trigger"]:has(span[data-slot="avatar"])');
    await page.click('div[role="menuitem"]:has-text("Log out")');
    await page.waitForURL('**/login');

    // 2. Factory Production Flow
    await page.goto('https://goodsdesign.uydev.id.vn/login');
    await page.waitForSelector('input[type="email"]');
    await page.waitForSelector('input[type="password"]');
    await page.fill('input[type="email"]', 'factory@gmail.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/factory');
    await page.goto('https://goodsdesign.uydev.id.vn/factory/orders');

    // Accept and complete production
    await page.waitForSelector('button:has-text("View Details")');
    const viewDetailsButton = page.locator('button:has-text("View Details")').first();
    await viewDetailsButton.click();
    await page.waitForURL('**/factory/orders/*');

    // Accept order
    await page.waitForSelector('div[data-slot="card"]:has(div[data-slot="alert"]) button:has-text("Accept Order")');
    await page.click('div[data-slot="card"]:has(div[data-slot="alert"]) button:has-text("Accept Order")');
    await page.waitForSelector('div[role="dialog"] button:has-text("Accept Order")');
    await page.click('div[role="dialog"] button:has-text("Accept Order")');

    // Complete production for all items
    await page.waitForSelector('[data-slot="tabs-trigger"]:has-text("Items")');
    await page.click('[data-slot="tabs-trigger"]:has-text("Items")');
    await page.waitForSelector('button:has-text("Complete Production")');
    const completeButtons = page.locator('button:has-text("Complete Production")');
    const count = await completeButtons.count();
    
    for (let i = 0; i < count; i++) {
      await completeButtons.nth(i).waitFor({ state: 'visible' });
      await completeButtons.nth(i).click();
      const dialogButton = page.locator('div[role="dialog"] button:has-text("Complete Production")');
      if (await dialogButton.isVisible()) {
        await dialogButton.click();
      }
      await page.waitForSelector('div[data-slot="card-content"] span[data-slot="badge"]:has-text("Quality Check")', { timeout: 5000 }).catch(() => {
        console.log('Status update not detected, continuing with next item');
      });
      await page.waitForTimeout(1000);
    }

    // Log out factory
    await page.click('button[data-slot="dropdown-menu-trigger"]:has(span[data-slot="avatar"])');
    await page.click('div[role="menuitem"]:has-text("Log out")');
    await page.waitForURL('**/login');

    // 3. Quality Check Flow
    await page.goto('https://goodsdesign.uydev.id.vn/login');
    await page.waitForSelector('input[type="email"]');
    await page.waitForSelector('input[type="password"]');
    await page.fill('input[type="email"]', 'staff@gmail.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/staff');
    await page.goto('https://goodsdesign.uydev.id.vn/staff/tasks');

    // Complete quality check
    await page.waitForSelector('button:has-text("View Details")');
    const qcViewDetailsButton = page.locator('button:has-text("View Details")').first();
    await qcViewDetailsButton.click();
    await page.waitForURL('**/staff/tasks/*');

    await page.waitForSelector('button[role="combobox"]');
    await page.click('button[role="combobox"]');
    await page.waitForSelector('[role="option"]');
    await page.click('[role="option"]');

    await page.waitForSelector('[data-slot="tabs-trigger"]:has-text("Quality Check Form")');
    await page.click('[data-slot="tabs-trigger"]:has-text("Quality Check Form")');

    const quantityText = await page.locator('div:has-text("Quantity")').locator('p.font-medium').nth(3).textContent();
    const quantity = parseInt(quantityText || '1');

    await page.fill('input[id="passedQuantity"]', quantity.toString());
    await page.fill('input[id="failedQuantity"]', '0');
    await page.fill('textarea[id="note"]', 'Product passed all quality checks. No defects found.');

    await page.waitForSelector('button:has-text("Complete Quality Check"):not([disabled])');
    await page.click('button:has-text("Complete Quality Check")');
    await page.waitForSelector('div:has-text("Quality check completed successfully")', { timeout: 5000 });

    // Log out staff
    await page.click('button[data-slot="dropdown-menu-trigger"]:has(span[data-slot="avatar"])');
    await page.click('div[role="menuitem"]:has-text("Log out")');
    await page.waitForURL('**/login');

    // 4. Shipping Flow
    await page.goto('https://goodsdesign.uydev.id.vn/login');
    await page.waitForSelector('input[type="email"]');
    await page.waitForSelector('input[type="password"]');
    await page.fill('input[type="email"]', 'factory@gmail.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/factory');
    await page.goto('https://goodsdesign.uydev.id.vn/factory/orders');

    // Start and complete shipping
    await page.waitForSelector('button:has-text("View Details")');
    const shippingViewDetailsButton = page.locator('button:has-text("View Details")').first();
    await shippingViewDetailsButton.click();
    await page.waitForURL('**/factory/orders/*');

    await page.waitForSelector('div[data-slot="card"]:has(div[data-slot="alert"]) button:has-text("Start Shipping")');
    await page.click('div[data-slot="card"]:has(div[data-slot="alert"]) button:has-text("Start Shipping")');
    await page.waitForSelector('div[role="dialog"] button:has-text("Start Shipping")');
    await page.click('div[role="dialog"] button:has-text("Start Shipping")');
    await page.waitForSelector('div:has-text("Shipping started successfully")', { timeout: 5000 });

    await page.waitForSelector('div[data-slot="card"]:has(div[data-slot="alert"]) button:has-text("Done Shipping")');
    await page.click('div[data-slot="card"]:has(div[data-slot="alert"]) button:has-text("Done Shipping")');
    await page.waitForSelector('div[role="dialog"] button:has-text("Done Shipping")');
    await page.click('div[role="dialog"] button:has-text("Done Shipping")');
    await page.waitForSelector('div:has-text("[MOCK] Shipping completed successfully")', { timeout: 5000 });

    // Log out factory
    await page.click('button[data-slot="dropdown-menu-trigger"]:has(span[data-slot="avatar"])');
    await page.click('div[role="menuitem"]:has-text("Log out")');
    await page.waitForURL('**/login');

    // 5. Customer Feedback Flow
    await page.goto('https://goodsdesign.uydev.id.vn/login');
    await page.waitForSelector('input[type="email"]');
    await page.waitForSelector('input[type="password"]');
    await page.fill('input[type="email"]', 'customer@gmail.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    // Submit feedback
    await page.click('button[data-slot="dropdown-menu-trigger"]:has(span[data-slot="avatar"])');
    await page.click('div[role="menuitem"]:has-text("My Order")');
    await page.waitForSelector('table[data-slot="table"]');
    const detailsButton = page.locator('a[href^="/my-order/"] button:has-text("Details")').first();
    await detailsButton.click();
    await page.waitForURL('**/my-order/*');
    await page.waitForSelector('div[role="status"]', { state: 'hidden' });

    await page.waitForSelector('div:has-text("Rate Your Order")');
    await page.waitForSelector('div[role="dialog"]');
    const starButtons = page.locator('div[role="dialog"] button[data-slot="button"]');
    await starButtons.nth(4).click();
    await page.fill('textarea[id="comment"]', 'Great service and product quality!');
    await page.click('button:has-text("Submit Feedback")');
    await page.waitForSelector('div:has-text("Thank you for your feedback!")', { timeout: 5000 });

    // Final log out
    await page.click('button[data-slot="dropdown-menu-trigger"]:has(span[data-slot="avatar"])');
    await page.click('div[role="menuitem"]:has-text("Log out")');
    await page.waitForURL('**/login');
  });
}); 