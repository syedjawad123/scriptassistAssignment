import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly signUpButton: Locator;
    readonly emailInputField: Locator;
    readonly passwordInputField: Locator;
    readonly signInButton: Locator;

    private log(message: string): void {
        console.log(`[LoginPage] ${message}`);
    }

    constructor(page: Page) {
        this.page = page;
        this.signUpButton = page.getByRole('link', { name: 'Sign Up' });
        this.emailInputField = page.getByRole('textbox', { name: 'Enter your email' });
        this.passwordInputField = page.getByRole('textbox', { name: 'Enter your password' });
        this.signInButton = page.getByRole('button', { name: 'Sign In' });
    }

    async goto(): Promise<void> {
        const url = process.env.BASE_URL;
        this.log(`Navigating to ${url}`);
        await this.page.goto('');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickSignupButton(): Promise<void> {
        await expect(this.signUpButton).toBeVisible();
        this.log('Login page loaded, opening sign up flow');
        await this.signUpButton.click();
    }

    async userLogin(email: string, password: string): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        await this.emailInputField.fill(email);
        await this.passwordInputField.fill(password);
        await this.signInButton.click();
    }


}
