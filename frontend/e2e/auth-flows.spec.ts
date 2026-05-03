import { test, expect } from '@playwright/test';

/**
 * End-to-End Authentication Flow Tests.
 * Matches the production-grade refactor: AuthShell, LoginForm, and Server Components.
 */
test.describe('Authentication Flows', () => {
  // Generate a fresh email for each test run to avoid collisions
  const testEmail = `tester-${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  const testName = 'Production Tester';

  test('Registration Flow - Success to Pending Verification', async ({ page }) => {
    await page.goto('/register');
    
    // Check for new refactored UI elements
    await expect(page.getByText('Create an account')).toBeVisible();
    await expect(page.getByText('Join Photophile and start showcasing')).toBeVisible();

    // Fill form
    await page.getByLabel('Full Name').fill(testName);
    await page.getByLabel('Email address').fill(testEmail);
    await page.getByLabel('Password', { exact: true }).fill(testPassword);
    await page.getByLabel('Confirm Password').fill(testPassword);
    
    await page.getByRole('button', { name: 'Register' }).click();

    // Verify correct production redirect
    await page.waitForURL('/verify-email/pending');
    await expect(page.getByText('Verify email')).toBeVisible();
    await expect(page.getByText(testEmail)).toBeVisible();
  });

  test('Login Flow - Success to Dashboard', async ({ page }) => {
    await page.goto('/login');
    
    // Check for new refactored UI text
    await expect(page.getByText('Welcome back')).toBeVisible();

    await page.getByLabel('Email address').fill(testEmail);
    await page.getByLabel('Password').fill(testPassword);
    
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Verification happens on dashboard
    await page.waitForURL('/dashboard');
    await expect(page.getByText('My Dashboard')).toBeVisible();
  });

  test('Security - Redirect Authenticated user away from Login', async ({ page }) => {
    // 1. Log in first
    await page.goto('/login');
    await page.getByLabel('Email address').fill(testEmail);
    await page.getByLabel('Password').fill(testPassword);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL('/dashboard');

    // 2. Try to go back to /login manually
    await page.goto('/login');
    
    // 3. Middleware should kick us back to dashboard
    await page.waitForURL('/dashboard');
    await expect(page.getByText('My Dashboard')).toBeVisible();
  });

  test('Security - Guest cannot access Dashboard', async ({ page }) => {
    // Clear cookies to be sure we are a guest
    await page.context().clearCookies();
    
    await page.goto('/dashboard');
    
    // Should be redirected to login with a return URL
    await page.waitForURL(/\/login\?redirect=%2Fdashboard/);
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('Login Flow - Invalid Credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel('Email address').fill('wrong@user.com');
    await page.getByLabel('Password').fill('WrongPass123!');
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Check for toast/error message
    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('Forgot Password - Success state', async ({ page }) => {
    await page.goto('/forgot-password');
    
    await expect(page.getByText('Reset Password')).toBeVisible();
    await page.getByLabel('Email address').fill(testEmail);
    await page.getByRole('button', { name: 'Send reset instructions' }).click();

    // Verify success view inside the AuthShell
    await expect(page.getByText('Check your email')).toBeVisible();
    await expect(page.getByText('Back to login')).toBeVisible();
  });

  test('Reset Password - Invalid/Expired Token UI', async ({ page }) => {
    // Access with no token
    await page.goto('/reset-password');
    
    await expect(page.getByText('Invalid Link')).toBeVisible();
    await expect(page.getByText('expired after 1 hour')).toBeVisible();
    await expect(page.getByText('Request new reset link')).toBeVisible();
  });

  test('Verify Email - Invalid Token UI', async ({ page }) => {
    await page.goto('/verify-email?token=bad-token');
    
    // Should show error state
    await expect(page.getByText('Verification Failed')).toBeVisible();
    await expect(page.getByText('Back to Login')).toBeVisible();
  });
});
