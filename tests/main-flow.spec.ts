//Go to https://goodsdesign.com/

import { test, expect } from '@playwright/test';

test.describe('Main Flow', () => {
  test('Customer Order Flow', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://goodsdesign.uydev.id.vn/login');

    // Wait for login form to be visible
    await page.waitForSelector('input[type="email"]');
    await page.waitForSelector('input[type="password"]');

    // Fill in login credentials
    await page.fill('input[type="email"]', 'customer@gmail.com');
    await page.fill('input[type="password"]', '123456');

    // Click login button
    await page.click('button[type="submit"]');

    // Wait for navigation after successful login
    await page.waitForURL('https://goodsdesign.uydev.id.vn/');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Verify we're not on the login page anymore
    await expect(page).not.toHaveURL(/.*\/login/);
    
    // Wait for the Available Designs section to be visible
    await page.waitForSelector('h2:has-text("Available Designs")', { timeout: 10000 });

    // Wait for the first design card to be visible
    await page.waitForSelector('[data-slot="card"]', { timeout: 10000 });
    
    // Click on the first design card
    await page.click('[data-slot="card"] >> nth=0');
    
    // Wait for product page to load
    await page.waitForLoadState('networkidle');
    
    // Select size M
    await page.click('label[for="size-M"]');
    
    // Select color (black)
    await page.click('label[for="color-#000000"]');
    
    // Click Start Designing button
    await page.click('button:has-text("Start Designing")');

    // wait change url from https://goodsdesign.uydev.id.vn/product/tshirt to https://goodsdesign.uydev.id.vn/product/tshirt/random-id
    await page.waitForURL('**/product/tshirt/*');

    await new Promise(resolve => setTimeout(resolve, 5000));

    //wait for the page to load
    await page.waitForSelector('button:has-text("Uploads")', { timeout: 10000 });

    //wait for the page to load button Uploads is enabled
    await page.waitForFunction(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const uploadsButton = buttons.find(button => button.textContent?.includes('Uploads'));
      return uploadsButton && !uploadsButton.hasAttribute('disabled');
    }, { timeout: 10000 });

    // Click Uploads button
    await page.click('button:has-text("Uploads")');

    // Wait for file input to be visible and set the file directly
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./images/Pattern/cat-meme.png');

    // Wait for the bottom bar to be visible
    await page.click('button:has-text("Add to cart")');

    //wait toast: Product has been added to cart
    await page.waitForSelector('div:has-text("Product has been added to cart")', { timeout: 10000 });

    // Wait for cart icon to be visible and click it
    await page.click('a[href="/cart"] button');

    // Wait for cart page to load
    await page.waitForURL('**/cart');

    // Verify we're on the cart page
    await expect(page).toHaveURL(/.*\/cart/);
  });

});

