import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Workspace Management
 */

test.describe('Workspace Management', () => {

    test.beforeEach(async ({ page }) => {
        const timestamp = Date.now();
        const email = `ws_${timestamp}@example.com`;
        const password = 'Test123!pass';

        // 1. Register first
        await page.goto('/register');
        await page.fill('input[id="name"]', `ws_user_${timestamp}`);
        await page.fill('input[id="email"]', email);
        await page.fill('input[id="password"]', password);
        await page.fill('input[id="confirmPassword"]', password);
        await page.click('button[type="submit"]');

        // Wait for redirect to login or dashboard
        // Note: Current app redirects to / but without token. 
        // We must manually login to get the cookie.

        await page.goto('/login');
        await page.fill('input[id="identifier"]', email);
        await page.fill('input[id="password"]', password);
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL('/', { timeout: 15000 });
        // Verify we are truly logged in by checking for an element that requires auth data or just the header
        await expect(page.locator('h1:has-text("Workspace")')).toBeVisible({ timeout: 10000 });
    });

    test('should display dashboard with workspace header', async ({ page }) => {
        await expect(page.locator('h1:has-text("Workspace")')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('button:has-text("+ Buat Workspace")')).toBeVisible();
    });

    test('should create a new workspace', async ({ page }) => {
        const workspaceName = `Test Workspace ${Date.now()}`;

        await page.waitForLoadState('networkidle');

        // Click trigger button
        await page.locator('button:has-text("+ Buat Workspace")').click();

        // Wait for dialog
        const dialog = page.locator('[data-slot="dialog-content"]');
        await expect(dialog).toBeVisible({ timeout: 5000 });

        // Fill form
        await dialog.locator('input[id="name"]').fill(workspaceName);

        // Click submit
        await dialog.locator('button[type="submit"]').click();

        // Wait for dialog to close
        await expect(dialog).toBeHidden({ timeout: 15000 });

        // Should see workspace in list
        await expect(page.locator(`text=${workspaceName}`)).toBeVisible({ timeout: 10000 });
    });

    test('should open workspace detail page', async ({ page }) => {
        const workspaceName = `Detail Test ${Date.now()}`;

        await page.waitForLoadState('networkidle');

        // Create workspace
        await page.locator('button:has-text("+ Buat Workspace")').click();
        const dialog = page.locator('[data-slot="dialog-content"]');
        await expect(dialog).toBeVisible({ timeout: 5000 });
        await dialog.locator('input[id="name"]').fill(workspaceName);
        await dialog.locator('button[type="submit"]').click();

        await expect(dialog).toBeHidden({ timeout: 15000 });
        await expect(page.locator(`text=${workspaceName}`)).toBeVisible({ timeout: 10000 });

        // Click on workspace card
        await page.locator(`text=${workspaceName}`).click();

        // Should see board create button
        await expect(page.locator('button:has-text("+ Buat Board")')).toBeVisible({ timeout: 10000 });
    });
});
