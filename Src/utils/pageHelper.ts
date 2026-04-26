// Src/utils/pageHelper.ts
import { Locator, Page } from '@playwright/test';

export async function waitForPageLoad(page: Page, locator: Locator, retries = 3): Promise<void> {
    for (let i = 0; i < retries; i++) {
        try {
            await locator.waitFor({ state: 'visible', timeout: 10000 });
            return; // page loaded fine
        } catch {
            console.log(`Page not ready, reloading... attempt ${i + 1}/${retries}`);
            await page.reload({ waitUntil: 'domcontentloaded' });
        }
    }
    throw new Error(`Page did not load after ${retries} retries`);
}