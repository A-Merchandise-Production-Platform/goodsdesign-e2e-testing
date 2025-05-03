//Go to https://goodsdesign.com/

import { test, expect } from '@playwright/test';

test.describe('Main Flow', () => {
  // test('Customer Order Flow', async ({ page }) => {
  //   // Navigate to login page
  //   await page.goto('https://goodsdesign.uydev.id.vn/login');

  //   // Wait for login form to be visible
  //   await page.waitForSelector('input[type="email"]');
  //   await page.waitForSelector('input[type="password"]');

  //   // Fill in login credentials
  //   await page.fill('input[type="email"]', 'customer@gmail.com');
  //   await page.fill('input[type="password"]', '123456');

  //   // Click login button
  //   await page.click('button[type="submit"]');

  //   // Wait for navigation after successful login
  //   await page.waitForURL('https://goodsdesign.uydev.id.vn/');
    
  //   // Wait for the page to be fully loaded
  //   await page.waitForLoadState('networkidle');
    
  //   // Verify we're not on the login page anymore
  //   await expect(page).not.toHaveURL(/.*\/login/);
    
  //   // Wait for the Available Designs section to be visible
  //   await page.waitForSelector('h2:has-text("Available Designs")', { timeout: 10000 });

  //   // Wait for the first design card to be visible
  //   await page.waitForSelector('[data-slot="card"]', { timeout: 10000 });
    
  //   // Click on the first design card
  //   await page.click('[data-slot="card"] >> nth=0');
    
  //   // Wait for product page to load
  //   await page.waitForLoadState('networkidle');
    
  //   // Select size M
  //   await page.click('label[for="size-M"]');
    
  //   // Select color (black)
  //   await page.click('label[for="color-#000000"]');
    
  //   // Click Start Designing button
  //   await page.click('button:has-text("Start Designing")');

  //   // wait change url from https://goodsdesign.uydev.id.vn/product/tshirt to https://goodsdesign.uydev.id.vn/product/tshirt/random-id
  //   await page.waitForURL('**/product/tshirt/*');

  //   await new Promise(resolve => setTimeout(resolve, 5000));

  //   //wait for the page to load
  //   await page.waitForSelector('button:has-text("Uploads")', { timeout: 10000 });

  //   //wait for the page to load button Uploads is enabled
  //   await page.waitForFunction(() => {
  //     const buttons = Array.from(document.querySelectorAll('button'));
  //     const uploadsButton = buttons.find(button => button.textContent?.includes('Uploads'));
  //     return uploadsButton && !uploadsButton.hasAttribute('disabled');
  //   }, { timeout: 10000 });

  //   // Wait for file input to be visible and set the file directly
  //   const fileInput = page.locator('input[type="file"]');
  //   await fileInput.setInputFiles('./images/Pattern/cat-meme.png');

  //   // Wait for the bottom bar to be visible
  //   await page.click('button:has-text("Add to cart")');

  //   //wait toast: Product has been added to cart
  //   await page.waitForSelector('div:has-text("Product has been added to cart")', { timeout: 10000 });

  //   // Wait for cart icon to be visible and click it
  //   await page.click('a[href="/cart"] button');

  //   // Wait for cart page to load
  //   await page.waitForURL('**/cart');

  //   // Verify we're on the cart page
  //   await expect(page).toHaveURL(/.*\/cart/);
  // });


  test("Customer login and select template", async ({ page }) => {
    await page.goto('https://goodsdesign.uydev.id.vn/login');

    await page.waitForSelector('input[type="email"]');
    await page.waitForSelector('input[type="password"]');

    await page.fill('input[type="email"]', 'customer@gmail.com');
    await page.fill('input[type="password"]', '123456');

    await page.click('button[type="submit"]');

    await page.waitForURL('**/'); 

    // Chờ card thứ 2 xuất hiện
    const secondCard = page.locator('[data-slot="card"]').nth(1);
    // Chờ nút "Use Design" bên trong card thứ 2 xuất hiện và click
    const useDesignButton = secondCard.locator('button[data-slot="button"]:has-text("Use Design")');
    await useDesignButton.waitFor({ state: 'visible', timeout: 10000 });
    await useDesignButton.click();

    await page.waitForURL('**/product/tshirt/*');

    await page.waitForSelector('button:has-text("Uploads")', { timeout: 10000 });

    await page.waitForSelector('button:has-text("Add to cart")', { timeout: 10000 });

    await page.click('button:has-text("Add to cart")');

    await page.waitForSelector('div:has-text("Product has been added to cart")', { timeout: 10000 });

    await page.click('a[href="/cart"] button');

    await page.waitForURL('**/cart');

    // Verify we're on the cart page
    await expect(page).toHaveURL(/.*\/cart/);

    // Wait for the cart item to be visible
    await page.waitForSelector('[data-slot="card"]', { timeout: 10000 });

    // Select the item by clicking the checkbox
    const checkbox = page.locator('[data-slot="checkbox"]').nth(1);
    await checkbox.click();

    // Verify the item is selected
    await expect(checkbox).toHaveAttribute('data-state', 'checked');

    // Click the "Proceed to Checkout" button
    await page.click('button:has-text("Proceed to Checkout")');

    // Wait for navigation to my order/id
    await page.waitForURL('**/my-order/*');

    // Wait for the Pay Now button to be visible and click it
    // Wait for and click the Payment tab
    await page.waitForSelector('[data-slot="tabs-trigger"]:has-text("Payment")', { timeout: 10000 });
    await page.click('[data-slot="tabs-trigger"]:has-text("Payment")');

    //Paynow
    await page.click('button:has-text("Pay Now")');

    await page.waitForLoadState('networkidle');

    // Fill in card details
    await page.waitForSelector('#card_number_mask', { timeout: 10000 });
    await page.fill('#card_number_mask', '9704198526191432198');
    
    await page.waitForSelector('#cardHolder', { timeout: 10000 });
    await page.fill('#cardHolder', 'NGUYEN VAN A');
    
    await page.waitForSelector('#cardDate', { timeout: 10000 });
    await page.fill('#cardDate', '07/15');

    // Click continue button
    await page.waitForSelector('#btnContinue', { timeout: 10000 });
    await page.click('#btnContinue');

    // Wait for and handle terms & conditions modal
    await page.waitForSelector('#btnAgree', { timeout: 10000 });
    await page.click('#btnAgree');

    // Wait for OTP input and fill it
    await page.waitForSelector('#otpvalue', { timeout: 10000 });
    await page.fill('#otpvalue', '123456');

    // Click the payment confirmation button
    await page.waitForSelector('#btnConfirm', { timeout: 10000 });
    await page.click('#btnConfirm');

    // Wait for payment completion
    await page.waitForTimeout(5000);

    // Verify payment success
    await page.waitForSelector('div:has-text("Successful")', { timeout: 30000 });
  });
});

