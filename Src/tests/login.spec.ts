import { test, expect } from '@playwright/test';
import { loginPage } from '@page/loginPage';
import { SignupPage } from '@page/signupPage';
import { DEFAULT_ORGANIZATION } from '../test-data/signupData';
test.describe('login with valid credentials', () => {
    let signupPage: SignupPage;
    let login: loginPage;
    function log(message: string): void {
        console.log(`[SignupSpec] ${message}`);
    }

    test.beforeEach(async ({ page }) => {
        login = new loginPage(page);
        signupPage = new SignupPage(page);
        log('Opening signup page');
        await login.goto();
        await expect(page).toHaveURL(/.*login/);
    });

    test.afterEach(async ({ page }) => {
        log('Closing page after test');
        await page.close();
    });

    test('User should be able to login', async ({ page }) => {
        log('Running happy path login scenario');
        let email = process.env.USEREMAIL
        let password = process.env.PASSWORD
        await signupPage.selectOrganization(DEFAULT_ORGANIZATION);
        await login.userlogin(`${email}`, `${password}`);
        await page.waitForURL(/.*dashboard/);
        await expect(page).toHaveURL(/.*dashboard/);
        await page.waitForURL(/.*tasks/);
        await expect(page).toHaveURL(/.*tasks/);
        await page.waitForLoadState('domcontentloaded');
        await expect(page.getByText('Tasks').first()).toBeVisible();
    });

});
