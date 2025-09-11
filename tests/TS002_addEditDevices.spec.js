const { test, expect } = require('@playwright/test');
const TestHelpers = require('../utils/test-helpers');

test.describe('Add edit Device', () => {
    let config;
    let helpers;
    let selectedImei = ''; // Declare at describe level

    test.beforeAll(async ({ browser }) => {
        // Create a page to load config
        const page = await browser.newPage();
        helpers = new TestHelpers(page);
        config = await helpers.getConfig();
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        helpers = new TestHelpers(page);
        await helpers.clearStorageAndSetTimeouts();
        
        // Set timeouts
        test.setTimeout(300000); // 5 minutes for long test
    });

    test('should add/edit a device', async ({ page }) => {
        const helpers = new TestHelpers(page);
        config = await helpers.getConfig();
        
        await page.goto(config.urls.backAdminLoginPage);
        
        await expect(page.locator(config.selectors.login.usernameFieldBackup)).toBeVisible();
        await page.locator(config.selectors.login.usernameFieldBackup)
            .fill(config.credentials.demo.usernameBackup);

        await expect(page.locator(config.selectors.login.passwordFieldBackup)).toBeVisible();
        await page.locator(config.selectors.login.passwordFieldBackup)
            .fill(config.credentials.demo.passwordBackup);
        
        await expect(page.locator(config.selectors.login.submitButtonBackup)).toBeVisible();
        await page.locator(config.selectors.login.submitButtonBackup).click();

        await page.waitForTimeout(config.timeouts.wait);
        await page.goto(config.urls.fleetDashboard3);

        // Click on accounts menu
        await expect(page.locator(config.selectors.navigation.accountsMenu)).toBeVisible();
        await page.locator(config.selectors.navigation.accountsMenu).click();

        await expect(page.locator(config.selectors.addEditDevice.addEditDriverMenu)).toBeVisible();
        await page.locator(config.selectors.addEditDevice.addEditDriverMenu).click();

        await expect(page.locator(config.selectors.addEditDevice.addEditDriverModal)).toBeVisible();

        // Click the "Add Device" tab
        await page.locator(config.selectors.addEditDevice.addTab).first().click({ force: true });

        // Click the IMEI input to show the dropdown
        await page.locator('#imei-search').click();

        // Get the first IMEI from the dropdown, click it, and store its value
        const firstImeiElement = page.locator('.imei-dropdown-item').first();
        selectedImei = await firstImeiElement.textContent();
        selectedImei = selectedImei.trim();
        await firstImeiElement.click();
        console.log('Selected IMEI: ' + selectedImei);
        
        await page.waitForTimeout(4000);

        // Enter the device name
        await expect(page.locator(config.selectors.addEditDevice.newDeviceName)).toBeVisible();
        await page.locator(config.selectors.addEditDevice.newDeviceName).clear();
        await page.locator(config.selectors.addEditDevice.newDeviceName).fill('AutomatedDevice');

        // Click the select dropdown and choose "All"
        await page.locator(config.selectors.addEditDevice.iconCategoryAdd).selectOption('All');

        await page.locator(config.selectors.addEditDevice.iconRadioButton).nth(1).check({ force: true });

        await page.locator(config.selectors.addEditDevice.addDeviceBtn).scrollIntoViewIfNeeded();
        await expect(page.locator(config.selectors.addEditDevice.addDeviceBtn)).toBeVisible();
        await page.locator(config.selectors.addEditDevice.addDeviceBtn).click({ force: true });

        await page.waitForTimeout(10000);

        // Verify the added device name is present under "Add/Edit Device Name" column
        await expect(page.locator('table#devices-table td').filter({ hasText: 'AutomatedDevice' })).toBeVisible();

        // Verify the selected IMEI is present under "IMEI" column
        await expect(page.locator('table#devices-table td').filter({ hasText: selectedImei })).toBeVisible();

        // Click on close button of list of device modal
        await page.locator(config.selectors.devList.container + ' .icon--close').click({ force: true });

        await page.waitForTimeout(5000);

        // Click on accounts menu
        await expect(page.locator(config.selectors.navigation.accountsMenu)).toBeVisible();
        await page.locator(config.selectors.navigation.accountsMenu).click();

        // Click on drivers menu
        await expect(page.locator(config.selectors.driverCard.trackInfoMenu)).toBeVisible();
        await page.locator(config.selectors.driverCard.trackInfoMenu).click();

        // Select the "Driver Card" radio button in Track Info Display Options
        await page.locator(config.selectors.driverCard.driverCardCheckbox).check({ force: true });

        // Click on submit button
        await expect(page.locator(config.selectors.driverCard.submitButton)).toBeVisible();
        await page.locator(config.selectors.driverCard.submitButton).click();

        // Verify the driver card panel is visible
        await expect(page.locator(config.selectors.driverCard.driverCardPanel)).toBeVisible();
        await expect(page.locator(config.selectors.driverCard.driverCardPanel)).toContainText('Driver Card');

        // Verify the search input is visible and type device name
        await expect(page.locator(config.selectors.driverCard.driverSearchInput)).toBeVisible();
        await page.locator(config.selectors.driverCard.driverSearchInput).clear();
        await page.locator(config.selectors.driverCard.driverSearchInput).fill('AutomatedDevice');

        await page.waitForTimeout(2000);

        // Click on driver card and verify the device name
        await expect(page.locator(config.selectors.driverCard.card)).toBeVisible();
        await expect(page.locator(config.selectors.driverCard.card)).toContainText('AutomatedDevice');
        await page.locator(config.selectors.driverCard.card).click();

        // Verify the driver card details are visible and verify device name
        await expect(page.locator(config.selectors.driverCard.driverName)).toBeVisible();
        await expect(page.locator(config.selectors.driverCard.driverName)).toContainText('AutomatedDevice');

        // Click on the search button
        await expect(page.locator(config.selectors.driverCard.driverSearchInput)).toBeVisible();
        await page.locator(config.selectors.driverCard.driverSearchInput).clear();

        await page.waitForTimeout(5000);

        // Click the "Edit Device" tab
        // Click on accounts menu
        await expect(page.locator(config.selectors.navigation.accountsMenu)).toBeVisible();
        await page.locator(config.selectors.navigation.accountsMenu).click();

        await expect(page.locator(config.selectors.addEditDevice.addEditDriverMenu)).toBeVisible();
        await page.locator(config.selectors.addEditDevice.addEditDriverMenu).click();

        await expect(page.locator(config.selectors.addEditDevice.addEditDriverModal)).toBeVisible();

        await page.locator(config.selectors.addEditDevice.editTab).first().click({ force: true });

        await page.waitForTimeout(5000);

        await page.locator(config.selectors.addEditDevice.vehicleDropdown).click();
        
        await page.waitForTimeout(2000);
        await page.locator(config.selectors.addEditDevice.vehicleDropdown).selectOption('AutomatedDevice (IMEI: 861492065082189)');

        // After selecting AutomatedDevice, verify the input displays 'AutomatedDevice'
        await expect(page.locator(config.selectors.addEditDevice.deviceNameInput)).toHaveValue('AutomatedDevice');

        // Change the device name
        await page.locator(config.selectors.addEditDevice.deviceNameInput).clear();
        await page.locator(config.selectors.addEditDevice.deviceNameInput).fill('AutomatedDeviceEdited');

        const checkbox = page.locator(config.selectors.addEditDevice.pulsingIconCheckbox);
        if (!(await checkbox.isChecked())) {
            await checkbox.check();
        }

        // Click the select dropdown and choose "All"
        await page.locator(config.selectors.addEditDevice.iconCategoryEdit).selectOption('All');

        await page.locator(config.selectors.addEditDevice.iconRadioButton).nth(1).check({ force: true });

        await page.locator(config.selectors.addEditDevice.updateDeviceButton).scrollIntoViewIfNeeded();
        await expect(page.locator(config.selectors.addEditDevice.updateDeviceButton)).toBeVisible();
        await page.locator(config.selectors.addEditDevice.updateDeviceButton).click({ force: true });

        await page.waitForTimeout(30000);

        // Verify the device is updated in the list and driver card is visible
        // Click on accounts menu
        await expect(page.locator(config.selectors.navigation.accountsMenu)).toBeVisible();
        await page.locator(config.selectors.navigation.accountsMenu).click();

        // Click on drivers menu
        await expect(page.locator(config.selectors.driverCard.trackInfoMenu)).toBeVisible();
        await page.locator(config.selectors.driverCard.trackInfoMenu).click();

        // Select the "Driver Card" radio button in Track Info Display Options
        await page.locator(config.selectors.driverCard.driverCardCheckbox).check({ force: true });

        // Click on submit button
        await expect(page.locator(config.selectors.driverCard.submitButton)).toBeVisible();
        await page.locator(config.selectors.driverCard.submitButton).click();

        await page.waitForTimeout(30000);

        // Click on account menu
        await expect(page.locator(config.selectors.navigation.accountsMenu)).toBeVisible();
        await page.locator(config.selectors.navigation.accountsMenu).click();

        // Click on List of Dev
        await expect(page.locator(config.selectors.navigation.listOfDevices)).toBeVisible();
        await page.locator(config.selectors.navigation.listOfDevices).click();

        // Click on list of devices modal
        await expect(page.locator(config.selectors.devList.container)).toBeVisible();
        await page.locator(config.selectors.devList.container).click({ force: true });

        // Verify the device list modal is visible
        await expect(page.locator(config.selectors.devList.container)).toBeVisible();

        // Verify the device card with the updated name is visible
        const deviceRows = page.locator('table#devices-table tbody tr');
        const rowCount = await deviceRows.count();
        
        let deviceFound = false;
        for (let i = 0; i < rowCount; i++) {
            const rowText = await deviceRows.nth(i).textContent();
            if (rowText.includes('AutomatedDeviceEdited')) {
                await expect(deviceRows.nth(i).locator('div').filter({ hasText: 'AutomatedDeviceEdited' })).toBeVisible();
                deviceFound = true;
                break;
            }
        }
        expect(deviceFound).toBe(true);

        // Close the device list modal
        await page.locator(config.selectors.devList.container + ' .icon--close').click({ force: true });
        await page.waitForTimeout(5000);

        // Extract the status text from the driver card status element
        const statusElement = page.locator('.driver-status');
        const vehicleStatus = await statusElement.textContent();
        const status = vehicleStatus.trim();
        console.log('Vehicle Status: ' + status);
        
        // Verify the pulsing marker class based on vehicle status
        if (status === 'Vehicle Is Off' || status === 'Vehicle Is Running') {
            await expect(page.locator('.pulsing-marker')).toBeVisible({ timeout: 10000 });
            await expect(page.locator('.marker-circle.pulsing-marker')).toBeVisible();
            console.log('Pulsing marker verified for status: ' + status);
        } else {
            console.log('Vehicle status is: ' + status + ' - pulsing behavior may vary');
        }

        // Continue with editing back to original name
        await expect(page.locator(config.selectors.navigation.accountsMenu)).toBeVisible();
        await page.locator(config.selectors.navigation.accountsMenu).click();

        await expect(page.locator(config.selectors.addEditDevice.addEditDriverMenu)).toBeVisible();
        await page.locator(config.selectors.addEditDevice.addEditDriverMenu).click();

        await expect(page.locator(config.selectors.addEditDevice.addEditDriverModal)).toBeVisible();

        // Click the "Edit Device" tab
        await page.locator(config.selectors.addEditDevice.editTab).first().click({ force: true });

        await page.waitForTimeout(8000);

        await page.locator(config.selectors.addEditDevice.vehicleDropdown).click();
        
        await page.waitForTimeout(2000);
        await page.locator(config.selectors.addEditDevice.vehicleDropdown).selectOption('AutomatedDeviceEdited (IMEI: 861492065082189)');

        // After selecting AutomatedDeviceEdited, verify the input displays 'AutomatedDeviceEdited'
        await expect(page.locator(config.selectors.addEditDevice.deviceNameInput)).toHaveValue('AutomatedDeviceEdited');

        // Change the device name back
        await page.locator(config.selectors.addEditDevice.deviceNameInput).clear();
        await page.locator(config.selectors.addEditDevice.deviceNameInput).fill('AutomatedDevice');

        const checkbox2 = page.locator(config.selectors.addEditDevice.pulsingIconCheckbox);
        if (!(await checkbox2.isChecked())) {
            await checkbox2.check();
        }

        // Click the select dropdown and choose "All"
        await page.locator(config.selectors.addEditDevice.iconCategoryEdit).selectOption('All');

        await page.locator(config.selectors.addEditDevice.iconRadioButton).nth(1).check({ force: true });

        await page.locator(config.selectors.addEditDevice.updateDeviceButton).scrollIntoViewIfNeeded();
        await expect(page.locator(config.selectors.addEditDevice.updateDeviceButton)).toBeVisible();
        await page.locator(config.selectors.addEditDevice.updateDeviceButton).click({ force: true });

        await page.waitForTimeout(2000);

        // Remove the device
        // Click on accounts menu
        await expect(page.locator(config.selectors.navigation.accountsMenu)).toBeVisible();
        await page.locator(config.selectors.navigation.accountsMenu).click();

        await expect(page.locator(config.selectors.addEditDevice.addEditDriverMenu)).toBeVisible();
        await page.locator(config.selectors.addEditDevice.addEditDriverMenu).click();

        await expect(page.locator(config.selectors.addEditDevice.addEditDriverModal)).toBeVisible();

        await page.locator(config.selectors.addEditDevice.editTab).first().click({ force: true });

        await page.waitForTimeout(8000);

        await page.locator(config.selectors.addEditDevice.vehicleDropdown).click();

        // Use the stored selectedImei variable here
        await page.waitForTimeout(2000);
        await page.locator(config.selectors.addEditDevice.vehicleDropdown).selectOption("AutomatedDevice (IMEI: " + selectedImei + ")");

        // After selecting AutomatedDevice, verify the input displays 'AutomatedDevice'
        await expect(page.locator(config.selectors.addEditDevice.deviceNameInput)).toHaveValue('AutomatedDevice');

        // Click on remove device button
        await expect(page.locator(config.selectors.addEditDevice.removeDeviceButton)).toBeVisible();
        await page.locator(config.selectors.addEditDevice.removeDeviceButton).click({ force: true });

        // Verify the confirmation modal is visible
        await expect(page.locator(config.selectors.addEditDevice.confirmationModal)).toBeVisible();
    
        // Click on confirm delete button
        await expect(page.locator(config.selectors.addEditDevice.confirmDeleteButton)).toBeVisible();
        await page.locator(config.selectors.addEditDevice.confirmDeleteButton).click({ force: true });

        await page.waitForTimeout(10000);

        // Verify the device is removed from the list
        await expect(page.locator('table#devices-table td').filter({ hasText: 'AutomatedDevice' })).not.toBeVisible();

        // Close the modal
        await page.locator(config.selectors.addEditDevice.addEditDriverModal + ' .icon--close').click({ force: true });

        await page.waitForTimeout(20000);

        // Verify the driver card panel is visible
        await expect(page.locator(config.selectors.driverCard.driverCardPanel)).toBeVisible();
        await expect(page.locator(config.selectors.driverCard.driverCardPanel)).toContainText('Driver Card');

        // Verify the search input is visible and type device name
        await expect(page.locator(config.selectors.driverCard.driverSearchInput)).toBeVisible();
        await page.locator(config.selectors.driverCard.driverSearchInput).clear();
        await page.locator(config.selectors.driverCard.driverSearchInput).fill('AutomatedDevice');

        await page.waitForTimeout(5000);

        // Click on driver card and verify card is not visible
        await expect(page.locator(config.selectors.driverCard.card)).not.toBeVisible();
    });
});