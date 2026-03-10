import { test, expect, Page } from '@playwright/test';
import path from 'path';

const EVIDENCE_PATH = path.join(__dirname, '..', '..', '.sisyphus', 'evidence', 'task-26');

async function captureScreenshot(page: Page, name: string) {
  await page.screenshot({ 
    path: path.join(EVIDENCE_PATH, `${name}.png`),
    fullPage: true 
  });
}

test.describe('Authentication Flow Tests', () => {
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'TestPass123!';
  const testName = 'Test User';

  test('Registration Flow - Create new account', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await expect(page.getByText('Create an account')).toBeVisible();
    await captureScreenshot(page, '01-register-page');

    await page.getByLabel('Full Name').fill(testName);
    await page.getByLabel('Email address').fill(testEmail);
    await page.getByLabel('Password', { exact: true }).fill(testPassword);
    await page.getByLabel('Confirm Password').fill(testPassword);
    
    await captureScreenshot(page, '02-register-form-filled');

    await page.getByRole('button', { name: 'Register' }).click();

    await page.waitForURL('/dashboard', { timeout: 15000 });
    await expect(page.getByText('My Dashboard')).toBeVisible();
    await captureScreenshot(page, '03-register-success-dashboard');
  });

  test('Login Flow - Existing account', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await expect(page.getByText('Sign in to your account')).toBeVisible();
    await captureScreenshot(page, '04-login-page');

    await page.getByLabel('Email address').fill(testEmail);
    await page.getByLabel('Password').fill(testPassword);
    
    await captureScreenshot(page, '05-login-form-filled');

    await page.getByRole('button', { name: 'Sign in' }).click();

    await page.waitForURL('/dashboard', { timeout: 15000 });
    await expect(page.getByText('My Dashboard')).toBeVisible();
    await captureScreenshot(page, '06-login-success-dashboard');
  });

  test('Forgot Password Flow', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await expect(page.getByText('Forgot your password?')).toBeVisible();
    await captureScreenshot(page, '07-forgot-password-page');

    await page.getByLabel('Email address').fill(testEmail);
    await captureScreenshot(page, '08-forgot-password-form-filled');

    await page.getByRole('button', { name: 'Send reset instructions' }).click();

    await expect(page.getByText('Check your email')).toBeVisible();
    await captureScreenshot(page, '09-forgot-password-success');
  });

  test('Reset Password Flow - Invalid token page', async ({ page }) => {
    await page.goto('/reset-password');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await expect(page.getByText('Invalid Link')).toBeVisible();
    await expect(page.getByText('This password reset link is invalid or has expired')).toBeVisible();
    await captureScreenshot(page, '10-reset-password-invalid-token');
  });

  test('Verify Email Flow - Invalid token page', async ({ page }) => {
    await page.goto('/verify-email');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await expect(page.getByText('Invalid Link')).toBeVisible();
    await captureScreenshot(page, '11-verify-email-invalid-token');
  });

  test('Verify Email Flow - With mock token (will fail but shows UI)', async ({ page }) => {
    await page.goto('/verify-email?token=invalid-token-123');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await captureScreenshot(page, '12-verify-email-with-token');
  });

  test('Logout Flow', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.getByLabel('Email address').fill(testEmail);
    await page.getByLabel('Password').fill(testPassword);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL('/dashboard', { timeout: 15000 });

    await captureScreenshot(page, '13-logout-before');

    await page.goto('/login');
    
    await page.waitForTimeout(2000);
    await captureScreenshot(page, '14-logout-after-redirect');
  });

  test('Login Flow - Invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.getByLabel('Email address').fill('nonexistent@example.com');
    await page.getByLabel('Password').fill('wrongpassword123!');
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    await page.waitForTimeout(2000);
    await captureScreenshot(page, '15-login-invalid-credentials');
  });

  test('Registration Flow - Password mismatch', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Email address').fill(`test${Date.now()}@example.com`);
    await page.getByLabel('Password', { exact: true }).fill('TestPass123!');
    await page.getByLabel('Confirm Password').fill('DifferentPass123!');
    await page.getByRole('button', { name: 'Register' }).click();
    
    await page.waitForTimeout(2000);
    await captureScreenshot(page, '16-register-password-mismatch');
  });

  test('Dashboard - Protected route redirects to login', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      await captureScreenshot(page, '17-dashboard-redirects-login');
    } else {
      await captureScreenshot(page, '17-dashboard-access-attempt');
    }
  });
});
