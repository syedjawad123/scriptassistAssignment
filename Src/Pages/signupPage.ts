import { expect, type Locator, type Page } from '@playwright/test';
import { createSignUpData, createStepOneData, createStepTwoData, type SignUpFormData, type SignUpStepOneData, type SignUpStepTwoData, } from '../test-data/signupData';

export class SignupPage {
    readonly page: Page;
    readonly selectOrganizationDropdown: Locator;
    readonly organizationOption: Locator;
    readonly selectTitleDropdown: Locator;
    readonly legalFirstNameInput: Locator;
    readonly legalLastNameInput: Locator;
    readonly emailInput: Locator;
    readonly phoneNumberInput: Locator;
    readonly nextButton: Locator;
    readonly genderSelection: Locator;
    readonly dateOfBirthDay: Locator;
    readonly dateOfBirthMonth: Locator;
    readonly dateOfBirthYear: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly termsAndConditionsCheckbox: Locator;
    readonly createAccountButton: Locator;
    readonly accountCreateSuccessPopup: Locator;

    private log(message: string): void {
        console.log(`[SignupPage] ${message}`);
    }

    constructor(page: Page) {
        this.page = page;
        this.selectOrganizationDropdown = page.getByPlaceholder('Select an organization');
        this.organizationOption = page.getByText('Maissara Al-Rikabi');
        this.selectTitleDropdown = page.getByPlaceholder('Select a title');
        this.legalFirstNameInput = page.getByRole('textbox', { name: 'Legal First Name' });
        this.legalLastNameInput = page.getByRole('textbox', { name: 'Legal Last Name' });
        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.phoneNumberInput = page.getByRole('textbox', { name: 'Phone Number' });
        this.nextButton = page.getByRole('button', { name: 'Next' });
        this.genderSelection = page.getByRole('textbox', { name: 'Sex at Birth' });
        this.dateOfBirthDay = page.getByRole('textbox', { name: 'Day' });
        this.dateOfBirthMonth = page.getByRole('textbox', { name: 'Month' });
        this.dateOfBirthYear = page.getByRole('textbox', { name: 'Year' });
        this.passwordInput = page.getByPlaceholder('Password', { exact: true });
        this.confirmPasswordInput = page.getByPlaceholder('Confirm Password', { exact: true });
        this.termsAndConditionsCheckbox = page.locator('[data-path="consent"]');
        this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
        this.accountCreateSuccessPopup = page.getByText('Your account has been created');
    }

    async selectOrganization(organization: string): Promise<void> {
        this.log(`Selecting organization: ${organization}`);
        await this.selectOrganizationDropdown.click();
        await this.selectOrganizationDropdown.fill(organization);
        await this.page.getByText(organization, { exact: true }).click();
    }

    async selectTitle(title: string): Promise<void> {
        this.log(`Selecting title: ${title}`);
        await this.selectTitleDropdown.click();
        await this.selectTitleDropdown.fill(title);
        await this.page.getByText(title, { exact: true }).click();
    }

    async fillStepOne(data: Partial<SignUpStepOneData> = {}): Promise<SignUpStepOneData> {
        const signUpStepOneData = createStepOneData(data);
        this.log(`Filling step 1 for ${signUpStepOneData.legalFirstName} ${signUpStepOneData.legalLastName} (${signUpStepOneData.email})`);

        await expect(this.selectOrganizationDropdown).toBeVisible();
        await this.selectOrganization(signUpStepOneData.organization);
        await this.selectTitle(signUpStepOneData.title);
        await this.legalFirstNameInput.fill(signUpStepOneData.legalFirstName);
        await this.legalLastNameInput.fill(signUpStepOneData.legalLastName);
        await this.emailInput.fill(signUpStepOneData.email);
        await this.phoneNumberInput.fill(signUpStepOneData.phoneNumber);

        return signUpStepOneData;
    }

    async continueToStepTwo(): Promise<void> {
        this.log('Continuing to step 2');
        await this.nextButton.click();
    }


    async selectGender(gender: string): Promise<void> {
        this.log(`Selecting gender: ${gender}`);
        await this.genderSelection.click();
        await this.page.getByText(gender, { exact: true }).click();
    }
    async selectDobDay(day: string): Promise<void> {
        this.log(`Selecting birth day: ${day}`);
        await this.dateOfBirthDay.click();
        await this.dateOfBirthDay.fill(day);
        await this.page.getByText(day, { exact: true }).click();
    }
    async selectDobMonth(month: string): Promise<void> {
        this.log(`Selecting birth month: ${month}`);
        await this.dateOfBirthMonth.click();
        await this.dateOfBirthMonth.fill(month);
        await this.page.getByText(month, { exact: true }).click();
    }
    async selectDobYear(year: string): Promise<void> {
        this.log(`Selecting birth year: ${year}`);
        await this.dateOfBirthYear.click();
        await this.dateOfBirthYear.fill(year);
        await this.page.getByText(year, { exact: true }).click();
    }
    async createAccount(): Promise<void> {
        this.log('Submitting signup form');
        await this.createAccountButton.scrollIntoViewIfNeeded();
        await this.createAccountButton.click();
    }


    async fillStepTwo(data: Partial<SignUpStepTwoData> = {}): Promise<SignUpStepTwoData> {
        const signUpStepTwoData = createStepTwoData(data);
        this.log(`Filling step 2 with gender ${signUpStepTwoData.gender} and DOB ${signUpStepTwoData.day}-${signUpStepTwoData.month}-${signUpStepTwoData.year}`);

        await expect(this.genderSelection).toBeVisible();
        await this.selectGender(signUpStepTwoData.gender);
        await this.selectDobDay(signUpStepTwoData.day);
        await this.selectDobMonth(signUpStepTwoData.month);
        await this.selectDobYear(signUpStepTwoData.year);
        await this.passwordInput.fill(signUpStepTwoData.password);
        await this.confirmPasswordInput.fill(signUpStepTwoData.confirmPassword);

        if (signUpStepTwoData.acceptTerms) {
            this.log('Accepting terms and conditions');
            await this.termsAndConditionsCheckbox.check();
        }

        return signUpStepTwoData;
    }

    async fillSignUpForm(overrides: Partial<SignUpFormData> = {}): Promise<SignUpFormData> {
        const signUpData = createSignUpData(overrides);
        this.log('Starting end-to-end signup form completion');
        await this.fillStepOne(signUpData.stepOne);
        await this.continueToStepTwo();
        await this.fillStepTwo(signUpData.stepTwo);
        await this.createAccount();
        await expect(this.accountCreateSuccessPopup).toBeVisible();
        this.log('Account creation completed successfully');
        return signUpData;
    }

}
