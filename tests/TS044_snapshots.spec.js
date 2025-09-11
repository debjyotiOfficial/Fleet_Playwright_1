const { test, expect } = require('@playwright/test');
const TestHelpers = require('../utils/test-helpers');

test.describe('Snapshots', () => {
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

    test('should display snapshots', async ({ page }) => {
        const helpers = new TestHelpers(page);
        config = await helpers.getConfig();
        
        await page.goto(config.urls.backupLoginPage);
        
        await expect(page.locator(config.selectors.login.usernameFieldBackup)).toBeVisible();
        await page.locator(config.selectors.login.usernameFieldBackup).clear();
        await page.locator(config.selectors.login.usernameFieldBackup).fill(config.credentials.demo.usernameBackup);
        
        await expect(page.locator(config.selectors.login.passwordFieldBackup)).toBeVisible();
        await page.locator(config.selectors.login.passwordFieldBackup).clear();
        await page.locator(config.selectors.login.passwordFieldBackup).fill(config.credentials.demo.passwordBackup);
        
        await expect(page.locator(config.selectors.login.submitButtonBackup)).toBeVisible();
        await page.locator(config.selectors.login.submitButtonBackup).click();

        await page.waitForTimeout(config.timeouts.wait);
        await page.goto(config.urls.fleetDashcamDashboard);

        await page.waitForTimeout(config.timeouts.wait);

        // Hover over "dashcamMenu"
        await page.locator(config.selectors.dashcam.dashcamMenu).hover();
        await page.waitForTimeout(500); // Give time for menu to open

        // Click on "dashcamMenu"
        await expect(page.locator(config.selectors.dashcam.dashcamMenu)).toBeVisible();
        await page.locator(config.selectors.dashcam.dashcamMenu).click();

        // Click on snapshot button
        await page.locator(config.selectors.dashcam.snapshots).click({ force: true });

        await page.waitForTimeout(config.timeouts.wait);

        // Wait for the dashcam refresh container to be visible
        await expect(page.locator(config.selectors.dashcam.snapshotmodal)).toBeVisible();

        // Click on submit
        await expect(page.locator(config.selectors.dashcam.conformSnapshotModal)).toBeVisible();
        await page.locator(config.selectors.dashcam.conformSnapshotModal).click();

        await expect(page.locator(config.selectors.dashcam.currentPhotoPopup)).toBeVisible();

        await expect(page.locator(config.selectors.dashcam.dashcamCard)).toBeVisible();

        // Click on "Download Road View" button
        await page.locator(config.selectors.dashcam.downloadRearView).click();

        // Click on "Download Driver View" button
        await page.locator(config.selectors.dashcam.downloadDriverView).click();

        // Get the status text from the card and click the matching filter button
        const statusText = await page.locator(config.selectors.dashcam.dashcamStatus).textContent();
        if (statusText) {
            await page.locator('.filter-btn').filter({ hasText: statusText.trim() }).click();
        }

        // Verify dashcam card is visible
        await expect(page.locator(config.selectors.dashcam.dashcamCard)).toBeVisible();

        // Click on "Clear Filter" button
        await page.locator(config.selectors.dashcam.clearFilter).click();

        // Verify the "All" button becomes active
        await expect(page.locator(config.selectors.dashcam.allButton)).toHaveClass(/active/);

        // Intercept the API call before interacting with the checkbox
        const updateColorizePromise = page.waitForResponse(response => 
            response.url().includes('updateColorizeOption.php') && response.request().method() === 'POST'
        );

        // Check the "Show Images In Color" checkbox
        await page.locator('.colorize-checkbox').check({ force: true });

        // Wait for the API call and assert status 200
        const response = await updateColorizePromise;
        expect(response.status()).toBe(200);
    });
});