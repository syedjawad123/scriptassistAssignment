import { test, expect } from '@playwright/test';
import { LoginPage } from '@page/loginPage';
import { SignupPage } from '@page/signupPage';
import { DEFAULT_ORGANIZATION } from '../test-data/signupData';

test.describe('login with valid credentials', () => {
    let signupPage: SignupPage;
    let login: LoginPage;

    function log(message: string): void {
        console.log(`[SignupSpec] ${message}`);
    }

    test.beforeEach(async ({ page }) => {
        login = new LoginPage(page);
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
        const email = process.env.USEREMAIL;
        const password = process.env.PASSWORD;
        await signupPage.selectOrganization(DEFAULT_ORGANIZATION);
        await login.userLogin(`${email}`, `${password}`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForURL(/.*tasks/);
        await expect(page).toHaveURL(/.*tasks/);
        await expect(page.getByText('Tasks').first()).toBeVisible();
    });

});
