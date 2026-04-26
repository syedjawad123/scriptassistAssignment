import { test, expect } from '@playwright/test';
import { LoginPage } from '@page/loginPage';
import { SignupPage } from '@page/signupPage';
import { DEFAULT_ORGANIZATION } from '../test-data/signupData';

test.describe('Signup flow', () => {
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
    await page.waitForURL(/.*login/);
    await expect(page).toHaveURL(/.*login/);
    await login.clickSignupButton();
    await page.waitForURL(/.*register/);
    await expect(page).toHaveURL(/.*register/);
  });

  test.afterEach(async ({ page }) => {
    log('Closing page after test');
    await page.close();
  });

  test('User should be successfully registered with valid data and should be able to login', async ({ page }) => {
    log('Running happy path signup scenario');
    const data = await signupPage.fillSignUpForm();
    const email = data.stepOne.email;
    const password = data.stepTwo.password;
    const organization = data.stepOne.organization;
    log('Login with newly registered user');
    await signupPage.selectOrganization(organization);
    await login.userLogin(email, password);
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
    log('Running empty step 2 validation scenario');
    const validationErrors = [
      'Gender is required',
      'Date of Birth is required',
      'Password must be at least 8 characters and include a number, an uppercase letter and special character',
    ];

    await signupPage.fillStepOne();
    await signupPage.continueToStepTwo();
    await signupPage.termsAndConditionsCheckbox.check();
    await signupPage.createAccount();
    for (const errorMessage of validationErrors) {
      await expect.soft(page.getByText(errorMessage, { exact: true })).toBeVisible();
    }
    await signupPage.passwordInput.fill('Test');
    await signupPage.createAccount();
    await expect.soft(page.getByText('Passwords do not match', { exact: true })).toBeVisible();
  });

  test('should not proceed to step 2 without selecting organization', async ({ page }) => {
    log('No organization selected');

    await signupPage.legalFirstNameInput.fill('John');
    await signupPage.legalLastNameInput.fill('Doe');
    await signupPage.emailInput.fill('john.doe@test.com');
    await signupPage.phoneNumberInput.fill('07123456789');
    await signupPage.continueToStepTwo();

    // Should still be on step 1 or show org error
    await expect(page).toHaveURL(/.*register/);
  });
  test('Invalid Mobile Number', async ({ page }) => {
    log('Invalid Mobile number entered less than 11 digit');
    await signupPage.selectOrganization(DEFAULT_ORGANIZATION);
    await signupPage.selectTitle('Mr.')
    await signupPage.legalFirstNameInput.fill('John');
    await signupPage.legalLastNameInput.fill('Doe');
    await signupPage.emailInput.fill('john.doe@test.com');
    await signupPage.phoneNumberInput.fill('712345678');
    await signupPage.continueToStepTwo();
    await expect.soft(page.getByText('Please enter a valid phone number', { exact: true })).toBeVisible();
  });

});
