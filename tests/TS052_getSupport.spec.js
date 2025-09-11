const { test, expect } = require('@playwright/test');
const TestHelpers = require('../utils/test-helpers');

test.describe('Get Support', () => {
    let config;
    let helpers;

  test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        helpers = new TestHelpers(page);
        config = await helpers.getConfig();
        await page.close();
    });

  test.beforeEach(async ({ page }) => {
        helpers = new TestHelpers(page);
        await helpers.clearStorageAndSetTimeouts();
        
        // Set timeouts
        test.setTimeout(600000); // 10 minutes for long test
    });

    test('should verify Get Support form functionality', async ({ page }) => {
        const helpers = new TestHelpers(page);
        config = await helpers.getConfig();
        
        await page.goto(config.urls.backAdminLoginPage);
        
        await expect(page.locator(config.selectors.login.usernameFieldBackup)).toBeVisible();
        await page.locator(config.selectors.login.usernameFieldBackup).clear();
        await page.locator(config.selectors.login.usernameFieldBackup).fill(config.credentials.demo.usernameBackup);
        
        await expect(page.locator(config.selectors.login.passwordFieldBackup)).toBeVisible();
        await page.locator(config.selectors.login.passwordFieldBackup).clear();
        await page.locator(config.selectors.login.passwordFieldBackup).fill(config.credentials.demo.passwordBackup);
        
        await expect(page.locator(config.selectors.login.submitButtonBackup)).toBeVisible();
        await page.locator(config.selectors.login.submitButtonBackup).click();

        await page.waitForTimeout(config.timeouts.wait);
        await page.goto(config.urls.fleetDashboard3);

        // Navigate to Get Support
        await page.locator(config.selectors.getSupport.getSupportMenu).hover();
        await page.waitForTimeout(500);

        await expect(page.locator(config.selectors.getSupport.getSupportMenu)).toBeVisible();
        await page.locator(config.selectors.getSupport.getSupportMenu).click();

        await expect(page.locator(config.selectors.getSupport.getSupportContainer)).toBeVisible();

        // Wait for form to be fully loaded
        await page.waitForTimeout(3000);

        await expect(page.locator(config.selectors.getSupport.getSupportContainer)).toBeVisible();

        // Intercept the API call before clicking the button
        const supportPromise = page.waitForResponse(response => 
            response.url().includes('Support.php') && response.request().method() === 'POST'
        );

        // Fill the Get Support form fields
        await page.locator(config.selectors.getSupport.firstName).fill('John');
        await page.locator(config.selectors.getSupport.lastName).fill('Doe');

        // Fill Email - handle disabled state and use direct value setting
        const emailInput = page.locator('input').filter({ has: page.locator('..').filter({ hasText: 'Email:' }) });
        await emailInput.evaluate(el => el.removeAttribute('disabled'));
        await emailInput.evaluate(el => el.value = 'john.doe@example.com');
        await emailInput.dispatchEvent('input');
        await emailInput.dispatchEvent('change');

        // Fill Phone - handle disabled state and use direct value setting
        const phoneInput = page.locator('input').filter({ has: page.locator('..').filter({ hasText: 'Phone:' }) });
        await phoneInput.evaluate(el => el.removeAttribute('disabled'));
        await phoneInput.evaluate(el => el.value = '1234567890');
        await phoneInput.dispatchEvent('input');
        await phoneInput.dispatchEvent('change');

        // Fill Comments using textarea selector
        const textareaField = page.locator('textarea').first();
        await expect(textareaField).toBeVisible();
        await textareaField.clear();
        await textareaField.fill('This is a test support request.');

        // Wait before submitting
        await page.waitForTimeout(1000);

        // Click Submit using multiple selector strategies
        const submitButton = page.locator('button[type="submit"], input[type="submit"], button').filter({ hasText: 'Submit' }).first();
        await expect(submitButton).toBeVisible();
        await expect(submitButton).not.toBeDisabled();
        await submitButton.click();

        // Wait for the API call and verify status
        const response = await supportPromise;
        expect(response.status()).toBe(200);
    });
});