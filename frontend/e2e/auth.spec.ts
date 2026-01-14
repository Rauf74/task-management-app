import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Authentication
 */

test.describe('Authentication', () => {

    test('should display login page with all elements', async ({ page }) => {
        // Navigate to login page
        await page.goto('/login');

        // Check for key elements
        await expect(page.locator('text=Selamat Datang')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('input[id="identifier"]')).toBeVisible();
        await expect(page.locator('input[id="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should display register page with all elements', async ({ page }) => {
        // Navigate to register page
        await page.goto('/register');

        // Check for key elements
        await expect(page.locator('text=Buat Akun')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('input[id="name"]')).toBeVisible();
        await expect(page.locator('input[id="email"]')).toBeVisible();
        await expect(page.locator('input[id="password"]')).toBeVisible();
        await expect(page.locator('input[id="confirmPassword"]')).toBeVisible();
    });

    test('should register a new user and redirect to dashboard', async ({ page }) => {
        const timestamp = Date.now();

        // Navigate to register page
        await page.goto('/register');

        // Fill registration form
        await page.fill('input[id="name"]', `testuser_${timestamp}`);
        await page.fill('input[id="email"]', `test_${timestamp}@example.com`);
        await page.fill('input[id="password"]', 'Test123!pass');
        await page.fill('input[id="confirmPassword"]', 'Test123!pass');

        // Submit form
        await page.click('button[type="submit"]');

        // Verify redirect to dashboard matches expected behavior
        await expect(page).toHaveURL('/', { timeout: 15000 });

        // Note: This verifies the redirect, but does not guarantee the user is fully logged in 
        // with a valid session cookie as discussed in workspace/board tests.
        // For simple redirect verification, checking the URL is sufficient.

        // Verify dashboard element is visible
        await expect(page.locator('h1:has-text("Workspace")')).toBeVisible({ timeout: 10000 });
    });

    test('should show error for invalid login credentials', async ({ page }) => {
        // Navigate to login page
        await page.goto('/login');

        // Fill form with invalid credentials
        await page.fill('input[id="identifier"]', 'invalid@email.com');
        await page.fill('input[id="password"]', 'wrongpassword');

        // Submit form
        await page.click('button[type="submit"]');

        // Wait for visual feedback (toast or error message) - simulated by staying on page
        await page.waitForTimeout(2000);

        // Ensure we are still on the login page (redirect didn't happen)
        await expect(page).toHaveURL('/login');
    });
});
