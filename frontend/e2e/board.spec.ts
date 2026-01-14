import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Board & Column Management
 */

test.describe('Board Management', () => {

    test.beforeEach(async ({ page }) => {
        const timestamp = Date.now();
        const email = `board_${timestamp}@example.com`;
        const password = 'Test123!pass';

        // 1. Register
        await page.goto('/register');
        await page.fill('input[id="name"]', `board_user_${timestamp}`);
        await page.fill('input[id="email"]', email);
        await page.fill('input[id="password"]', password);
        await page.fill('input[id="confirmPassword"]', password);
        await page.click('button[type="submit"]');

        // 2. Login explicitly to get auth cookie
        await page.goto('/login');
        await page.fill('input[id="identifier"]', email);
        await page.fill('input[id="password"]', password);
        await page.click('button[type="submit"]');

        // Increase timeout for login redirection
        await expect(page).toHaveURL('/', { timeout: 30000 });

        // Create workspace for board tests
        await page.locator('button:has-text("+ Buat Workspace")').click();
        await expect(page.locator('[data-slot="dialog-content"]')).toBeVisible({ timeout: 5000 });
        await page.fill('input[id="name"]', `Board Test ${timestamp}`);
        await page.locator('[data-slot="dialog-content"] button[type="submit"]').click();
        await expect(page.locator('[data-slot="dialog-content"]')).toBeHidden({ timeout: 15000 });
        await expect(page.locator(`text=Board Test ${timestamp}`)).toBeVisible({ timeout: 10000 });

        // Open workspace
        await page.locator(`text=Board Test ${timestamp}`).click();
        await expect(page.locator('button:has-text("+ Buat Board")')).toBeVisible({ timeout: 10000 });
    });

    test('should create a new board', async ({ page }) => {
        const boardName = `Test Board ${Date.now()}`;

        await page.locator('button:has-text("+ Buat Board")').click();
        await expect(page.locator('[data-slot="dialog-content"]')).toBeVisible({ timeout: 5000 });
        await page.fill('input[id="name"]', boardName);
        await page.locator('[data-slot="dialog-content"] button[type="submit"]').click();
        await expect(page.locator('[data-slot="dialog-content"]')).toBeHidden({ timeout: 15000 });

        await expect(page.locator(`text=${boardName}`)).toBeVisible({ timeout: 10000 });
    });

    test('should open board and create column', async ({ page }) => {
        const boardName = `Column Test ${Date.now()}`;

        // Create board
        await page.locator('button:has-text("+ Buat Board")').click();
        await expect(page.locator('[data-slot="dialog-content"]')).toBeVisible({ timeout: 5000 });
        await page.fill('input[id="name"]', boardName);
        await page.locator('[data-slot="dialog-content"] button[type="submit"]').click();
        await expect(page.locator('[data-slot="dialog-content"]')).toBeHidden({ timeout: 15000 });
        await expect(page.locator(`text=${boardName}`)).toBeVisible({ timeout: 10000 });

        // Open board
        await page.locator(`text=${boardName}`).click();
        await expect(page.locator('button:has-text("Tambah Column")')).toBeVisible({ timeout: 10000 });

        // Create column
        await page.locator('button:has-text("Tambah Column")').click();
        const dialog = page.locator('[data-slot="dialog-content"]');
        await expect(dialog).toBeVisible({ timeout: 5000 });

        await dialog.locator('input[id="title"]').fill('To Do');

        // Click submit and wait for API response
        const submitPromise = page.waitForResponse(response =>
            response.url().includes('/api/boards') &&
            response.url().includes('/columns') &&
            (response.status() === 201 || response.status() === 200)
        );

        await dialog.locator('button[type="submit"]').click();
        await submitPromise;

        await expect(dialog).toBeHidden({ timeout: 15000 });

        // Should see column header (CardTitle renders as div)
        // Using generic text check which is robust
        await expect(page.locator(`div:has-text("To Do")`).first()).toBeVisible({ timeout: 10000 });
    });
});
