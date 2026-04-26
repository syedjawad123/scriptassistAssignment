import { expect, type Locator, type Page } from '@playwright/test';;

export class loginPage {
    readonly page: Page;
    readonly signUpButton: Locator;
    readonly emailInputField: Locator;
    readonly passwordInputField: Locator;
    readonly sigInButton: Locator;

    private log(message: string): void {
        console.log(`[LoginPage] ${message}`);
    }

    constructor(page: Page) {
        this.page = page;
        this.signUpButton = page.getByRole('link', { name: 'Sign Up' });
        this.emailInputField = page.getByRole('textbox', { name: 'Enter your email' });
        this.passwordInputField = page.getByRole('textbox', { name: 'Enter your password' });
        this.sigInButton = page.getByRole('button', { name: 'Sign In' });
    }

    async goto() {
        const URL = process.env.BASE_URL
        this.log(`Navigating to ${URL}`);
        await this.page.goto(`${URL}`);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickSingupbutton() {
        await expect(this.signUpButton).toBeVisible();
        this.log('Login page loaded, opening sign up flow');
        await this.signUpButton.click();
    }

    async userlogin(email: string, password: string) {
        await this.page.waitForLoadState('domcontentloaded');
        await this.emailInputField.fill(email);
        await this.passwordInputField.fill(password);
        await this.sigInButton.click();
    }


}
