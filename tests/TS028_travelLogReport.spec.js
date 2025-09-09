const { test, expect } = require('@playwright/test');
const TestHelpers = require('../utils/test-helpers');

test.describe('Travel Log Report', () => {
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

    test('should display TLR', async ({ page }) => {
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

        // Click on reports menu
        await expect(page.locator(config.selectors.navigation.reportMenu)).toBeVisible();
        await page.locator(config.selectors.navigation.reportMenu).click( {force: true} );

         await page.waitForTimeout(2000);
        
        await expect(page.locator(config.selectors.navigation.trackReportMenu)).toBeVisible();
        await page.locator(config.selectors.navigation.trackReportMenu).click({ force: true });
        
        // Wait for modal to open properly
        await page.waitForTimeout(5000);
        await expect(page.locator(config.selectors.modal.container)).toBeVisible();

        // Verify modal title
        await expect(page.locator(config.selectors.modal.title)).toBeVisible();
        await expect(page.locator(config.selectors.modal.title)).toContainText(config.testData.expectedTitle);
        
        // Date selection - use JavaScript to click calendar button directly
        await page.evaluate(() => {
            const btn = document.querySelector('#travel-log-report-calendar-btn');
            if (btn) {
                btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                btn.click();
            }
        });
        await page.waitForTimeout(1000); // Wait for calendar to open

        await page.locator('.flatpickr-calendar.open .flatpickr-monthDropdown-months').selectOption('August');

        // Select August 1, 2025
        await page.locator('.flatpickr-calendar.open .flatpickr-day[aria-label="August 1, 2025"]').click({ force: true });

        // Select August 3 2025 (as end date)
        await page.locator('.flatpickr-calendar.open .flatpickr-day[aria-label="August 3, 2025"]').click({ force: true });

        // Wait for device dropdown to be available and click it
        await page.waitForTimeout(1000);
        await page.waitForSelector('#travel-log-report-panel #select2-driver-list-container', { state: 'visible' });
        await page.locator('#travel-log-report-panel #select2-driver-list-container').click({ force: true });

        // Select "Sales car1"
        await page.locator('.select2-results__option').filter({ hasText: 'Sales car1' }).click({ force: true });

        // Click on submit button
        await expect(page.locator(config.selectors.tlr.submitButton)).toBeVisible();
        await page.locator(config.selectors.tlr.submitButton).click({ force: true });
        
        await page.waitForTimeout(30000);
        
        // Wait for the limited report to be visible
        await expect(page.locator(config.selectors.report.limitedReport)).toBeVisible();
        await expect(page.locator(config.selectors.report.limitedReport)).toHaveCSS('display', 'block');

        // Select TLR tab
        await page.locator(config.selectors.report.tlrTab).click({ force: true });
        
        // Second submission
        await expect(page.locator(config.selectors.report.submitButton)).toBeVisible();
        await page.locator(config.selectors.report.submitButton).click({ force: true });
        
        await page.waitForTimeout(30000);
        

        // Check/uncheck the "Show Engine Idling Events" checkbox and verify search results
        const engineIdlingCheckbox = page.locator(config.selectors.report.engineIdlingCHeckbox);
        const isChecked = await engineIdlingCheckbox.isChecked();

        if (isChecked) {
          // If checked, uncheck it
          await engineIdlingCheckbox.uncheck({ force: true });
          await page.waitForTimeout(3000);

          // Type "engine idling" in the search input
          await page.locator(config.selectors.report.searchInput).clear();
          await page.locator(config.selectors.report.searchInput).fill('engine idling');
          await page.waitForTimeout(3000);

          // Ensure the Event Type column does NOT contain "Engine Idling"
          const eventTypeCells = page.locator(config.selectors.report.travelLogReportTable + ' tbody tr td:first-child');
          const count = await eventTypeCells.count();
          for (let i = 0; i < count; i++) {
            await expect(eventTypeCells.nth(i)).not.toContainText('Engine Idling');
          }
        } else {
          // If unchecked, check it
          await engineIdlingCheckbox.check({ force: true });
          await page.waitForTimeout(3000);

          // Type "engine idling" in the search input
          await page.locator(config.selectors.report.searchInput).clear();
          await page.locator(config.selectors.report.searchInput).fill('engine idling');
          await page.waitForTimeout(3000);

          // Ensure the Event Type column DOES contain "Engine Idling"
          await expect(page.locator(config.selectors.report.travelLogReportTable + ' tbody tr td:first-child')).toContainText('Engine Idling');
        }

        // Test export functionality
        try {
            // Click on "Save file as" dropdown and select Excel
            await page.locator('#travel-log-report-panel button.dropdown__trigger').click({ force: true });
            await page.waitForTimeout(500);
            await page.locator('#travel-log-report-panel .dropdown__content button.dropdown__item').filter({ hasText: 'Excel' }).click({ force: true });
            await page.waitForTimeout(1000);

            // Click on "Save file as" dropdown again and select CSV
            await page.locator('#travel-log-report-panel button.dropdown__trigger').click({ force: true });
            await page.waitForTimeout(500);
            await page.locator('#travel-log-report-panel .dropdown__content button.dropdown__item').filter({ hasText: 'CSV' }).click({ force: true });
            await page.waitForTimeout(1000);

            // Click on "Save file as" dropdown again and select PDF
            await page.locator('#travel-log-report-panel button.dropdown__trigger').click({ force: true });
            await page.waitForTimeout(500);
            await page.locator('#travel-log-report-panel .dropdown__content button.dropdown__item').filter({ hasText: 'PDF' }).click({ force: true });
            await page.waitForTimeout(1000);
        } catch (error) {
            console.log('Export functionality failed:', error.message);
        }
    });
});