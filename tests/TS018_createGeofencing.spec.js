const { test, expect } = require('@playwright/test');
const TestHelpers = require('../utils/test-helpers');

test.describe('Create Geofencing', () => {
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

    test('should be able to create new Geofence', async ({ page }) => {
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
            
        await expect(page.locator(config.selectors.navigation.geofencingMenu)).toBeVisible();
        await page.locator(config.selectors.navigation.geofencingMenu).click();

        await page.waitForTimeout(2000); // Wait for element to be ready

        await expect(page.locator(config.selectors.navigation.creategeofencingMenu)).toBeVisible();
        await page.locator(config.selectors.navigation.creategeofencingMenu).click();

        await page.waitForTimeout(2000); // Wait for element to be ready
        
        await expect(page.locator(config.selectors.modal.geofencingContainer)).toBeVisible();
        
        // Verify modal title
        await expect(page.locator(config.selectors.modal.geofencingTitle)).toBeVisible();
        await expect(page.locator(config.selectors.modal.geofencingTitle))
            .toContainText(config.selectors.modal.expectedGeofencingTitle);

        // Verify Enter address input
        await expect(page.locator(config.selectors.geofencingInput.addressField)).toBeVisible();
        await page.locator(config.selectors.geofencingInput.addressField).clear();
        await page.locator(config.selectors.geofencingInput.addressField).fill(config.testData.geofencingAddress);
        
        // Wait for address suggestions to appear
        await page.waitForTimeout(5000);

        // Verify Enter name input - click on address suggestion
        await expect(page.locator(config.selectors.geofencingInput.nameField).filter({ hasText: 'San Ramon, CA' })).toBeVisible();
        await page.locator(config.selectors.geofencingInput.nameField).filter({ hasText: 'San Ramon, CA' }).click();

        // Verify Enter radius input
        await expect(page.locator(config.selectors.geofencingInput.radiusField)).toBeVisible();
        await page.locator(config.selectors.geofencingInput.radiusField).clear();
        await page.locator(config.selectors.geofencingInput.radiusField).fill(config.testData.geofencingRadius);

        // Enter name of geofence
        await expect(page.locator(config.selectors.geofencingInput.geofenceName)).toBeVisible();
        await page.locator(config.selectors.geofencingInput.geofenceName).clear();
        await page.locator(config.selectors.geofencingInput.geofenceName).fill(config.testData.geofenceName);

        // Click the Submit button
        await expect(page.locator(config.selectors.geofencingInput.submitButton)).toBeVisible();
        await page.locator(config.selectors.geofencingInput.submitButton).click();

        await page.waitForTimeout(5000);

        // Click by text content within geofencing modal context
        // await page.locator('#add-new-geofence-modal').getByText('Save').click({ force: true });
        // await page.co(/^Save$/i).click({ force: true });

        // Method 1: Click by text content (most reliable for custom elements)
        // await page.locator('Save').first().click({ force: true });
        // await page.locator(/^Save$/i).click({ force: true });

        // Cypress equivalent: cy.contains('Save').click({ force: true });
        // This clicks on Save text content (likely in HereMaps interface), not a button
        // await page.locator('text=Save').first().click({ force: true });
        
        // Second click as in Cypress: cy.contains(/^Save$/i).click({ force: true });
        await page.locator('text=/^Save$/i').first().click({ force: true });

        await page.waitForTimeout(40000); // Wait for element to be ready

        await expect(page.locator(config.selectors.navigation.geofencingMenu)).toBeVisible();
        await page.locator(config.selectors.navigation.geofencingMenu).click();

        await expect(page.locator(config.selectors.geofencingInput.viewDelGeo)).toBeVisible();
        await page.locator(config.selectors.geofencingInput.viewDelGeo).click();

        await page.waitForTimeout(20000); // Wait for element to be ready

        // Select geofence from the list
        await expect(page.locator(config.selectors.viewDeleteGeofencing.geoList)).toBeVisible();
        await page.locator(config.selectors.viewDeleteGeofencing.geoList).selectOption('Test Auto Geofence (2201 Camino Ramon, San Ramon, CA 94583, United States)');

        // Click on submit button
        await expect(page.locator(config.selectors.viewDeleteGeofencing.submitButton)).toBeVisible();
        await page.locator(config.selectors.viewDeleteGeofencing.submitButton).click();

        await page.waitForTimeout(5000);
        
        // Verify the textbox is visible and contains the geofence name
        await expect(page.locator('#geolabel_id')).toBeVisible();
        await expect(page.locator('#geolabel_id')).toHaveValue('Test Auto Geofence');
    });
});