import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Authentication - Basic flow tests
 */

test.describe('Authentication', () => {

    test('should display login page with all elements', async ({ page }) => {
        await page.goto('/login');

        await expect(page.locator('text=Selamat Datang')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('input[id="identifier"]')).toBeVisible();
        await expect(page.locator('input[id="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should display register page with all elements', async ({ page }) => {
        await page.goto('/register');

        await expect(page.locator('text=Buat Akun')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('input[id="name"]')).toBeVisible();
        await expect(page.locator('input[id="email"]')).toBeVisible();
        await expect(page.locator('input[id="password"]')).toBeVisible();
        await expect(page.locator('input[id="confirmPassword"]')).toBeVisible();
    });

    test('should register a new user and redirect to dashboard', async ({ page }) => {
        const timestamp = Date.now();

        await page.goto('/register');
        await page.fill('input[id="name"]', `testuser_${timestamp}`);
        await page.fill('input[id="email"]', `test_${timestamp}@example.com`);
        await page.fill('input[id="password"]', 'Test123!pass');
        await page.fill('input[id="confirmPassword"]', 'Test123!pass');
        await page.click('button[type="submit"]');

        // Should redirect to dashboard
        await expect(page).toHaveURL('/', { timeout: 15000 });

        // Dashboard should show workspace header
        await expect(page.locator('h1:has-text("Workspace")')).toBeVisible({ timeout: 10000 });
    });

    test('should show error for invalid login credentials', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[id="identifier"]', 'invalid@email.com');
        await page.fill('input[id="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        // Should stay on login page
        await page.waitForTimeout(2000);
        await expect(page).toHaveURL('/login');
    });
});
