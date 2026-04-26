import { test, expect } from '@playwright/test';
import { loginPage } from '@page/loginPage';
import { SignupPage } from '@page/signupPage';
import { DEFAULT_ORGANIZATION } from '../test-data/signupData';
test.describe('Signup flow', () => {
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
    await page.waitForURL(/.*login/);
    await expect(page).toHaveURL(/.*login/);
    await login.clickSingupbutton();
    await page.waitForURL(/.*register/);
    await expect(page).toHaveURL(/.*register/);
  });

  test.afterEach(async ({ page }) => {
    log('Closing page after test');
    await page.close();
  });

  test('User should be successfully registered with valid data and should be able to login', async ({ page }) => {
    log('Running happy path signup scenario');
    let data = await signupPage.fillSignUpForm();
    let email = data.stepOne.email
    let password = data.stepTwo.password
    let orgnization = data.stepOne.organization
    log('login with newly registered user');
    await signupPage.selectOrganization(orgnization);
    await login.userlogin(email, password);
    await page.waitForURL(/.*dashboard/);
    await expect(page).toHaveURL(/.*dashboard/);
    await page.waitForURL(/.*tasks/);
    await expect(page).toHaveURL(/.*tasks/);
    await expect(page.getByText('Tasks').first()).toBeVisible();
  });

  test('should display validation error when step 1 is submitted empty', async ({ page }) => {
    log('Running empty step 1 validation scenario');
    const validationErrors = [
      'First Name is required',
      'Last Name is required',
      'Please enter a valid email address',
      'Phone Number is required',
    ];
    await signupPage.selectOrganization(DEFAULT_ORGANIZATION);
    await signupPage.continueToStepTwo();
    for (const errorMessage of validationErrors) {
      await expect.soft(page.getByText(errorMessage, { exact: true })).toBeVisible();
      log(errorMessage + " error is displayed");
    }
  });

  test('should display validation error when step 2 is submitted empty', async ({ page }) => {
    log('Running empty step 1 validation scenario');
    const validationErrors = [
      'Gender is required',
      'Date of Birth is required',
      'Password must be at least 8 characters and include a number, an uppercase letter and special character',
    ];

    await signupPage.fillStepOne();
    await signupPage.continueToStepTwo();
    await signupPage.termsAndConditonsCheckBox.check();
    await signupPage.createAccount();
    for (const errorMessage of validationErrors) {
      await expect.soft(page.getByText(errorMessage, { exact: true })).toBeVisible();
    }
    await signupPage.passwordInput.fill('Test');
    await signupPage.createAccount();
    await expect.soft(page.getByText('Passwords do not match', { exact: true })).toBeVisible();

  });

});
