import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Workspace - UI Display Tests
 * Note: Create/delete tests require test database setup
 */

test.describe('Workspace UI', () => {

    test('should display create workspace dialog', async ({ page }) => {
        const timestamp = Date.now();

        // Register first
        await page.goto('/register');
        await page.fill('input[id="name"]', `ws_user_${timestamp}`);
        await page.fill('input[id="email"]', `ws_${timestamp}@example.com`);
        await page.fill('input[id="password"]', 'Test123!pass');
        await page.fill('input[id="confirmPassword"]', 'Test123!pass');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('/', { timeout: 15000 });

        // Click create workspace button
        await page.locator('button:has-text("+ Buat Workspace")').click();

        // Verify dialog opened
        await expect(page.locator('text=Buat Workspace Baru')).toBeVisible({ timeout: 5000 });
        await expect(page.locator('input[id="name"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
    });
});
