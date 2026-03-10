/** @file Email templates for Photophile
 * Contains HTML and plain text templates for various email types
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * Generates email verification template
 * @param token - The verification token (base64url encoded)
 * @param baseUrl - The application base URL
 * @returns Email template with subject, HTML, and plain text
 */
export const getVerificationEmailTemplate = (
  token: string,
  baseUrl: string
): EmailTemplate => {
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

  const subject = "Verify your Photophile account";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your Photophile account</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background-color: #f8f9fa;
      color: #333333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .email-wrapper {
      background-color: #ffffff;
      border-radius: 12px;
      padding: 48px 40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .logo {
      text-align: center;
      margin-bottom: 32px;
    }
    .logo-text {
      font-size: 28px;
      font-weight: 700;
      color: #1a1a1a;
      letter-spacing: -0.5px;
    }
    .logo-accent {
      color: #6366f1;
    }
    h1 {
      font-size: 24px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 16px 0;
      text-align: center;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
      color: #4b5563;
      margin: 0 0 24px 0;
      text-align: center;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    .link-fallback {
      background-color: #f3f4f6;
      border-radius: 8px;
      padding: 16px;
      margin: 24px 0;
      word-break: break-all;
    }
    .link-fallback p {
      font-size: 14px;
      color: #6b7280;
      margin: 0 0 8px 0;
    }
    .link-fallback a {
      color: #6366f1;
      text-decoration: none;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      font-size: 14px;
      color: #9ca3af;
      margin: 0;
    }
    .expiry-note {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 12px 16px;
      margin: 24px 0;
      border-radius: 0 8px 8px 0;
    }
    .expiry-note p {
      font-size: 14px;
      color: #92400e;
      margin: 0;
      text-align: left;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-wrapper">
      <div class="logo">
        <span class="logo-text">Photo<span class="logo-accent">phile</span></span>
      </div>
      
      <h1>Verify your email address</h1>
      
      <p>Thanks for signing up for Photophile! Please click the button below to verify your email address and complete your registration.</p>
      
      <div class="button-container">
        <a href="${verificationUrl}" class="button">Verify Email Address</a>
      </div>
      
      <div class="link-fallback">
        <p>Or copy and paste this link into your browser:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
      </div>
      
      <div class="expiry-note">
        <p>⏰ This verification link will expire in 24 hours for security reasons.</p>
      </div>
      
      <p style="font-size: 14px; color: #6b7280;">If you didn't create an account with Photophile, you can safely ignore this email.</p>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} Photophile. All rights reserved.</p>
        <p style="margin-top: 8px;">Connecting photographers with clients worldwide.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Verify your Photophile account

Thanks for signing up for Photophile! Please visit the link below to verify your email address:

${verificationUrl}

This verification link will expire in 24 hours for security reasons.

If you didn't create an account with Photophile, you can safely ignore this email.

© ${new Date().getFullYear()} Photophile. All rights reserved.
  `.trim();

  return { subject, html, text };
};

/**
 * Generates password reset template
 * @param token - The reset token (base64url encoded)
 * @param baseUrl - The application base URL
 * @returns Email template with subject, HTML, and plain text
 */
export const getPasswordResetTemplate = (
  token: string,
  baseUrl: string
): EmailTemplate => {
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  const subject = "Reset your Photophile password";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your Photophile password</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background-color: #f8f9fa;
      color: #333333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .email-wrapper {
      background-color: #ffffff;
      border-radius: 12px;
      padding: 48px 40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .logo {
      text-align: center;
      margin-bottom: 32px;
    }
    .logo-text {
      font-size: 28px;
      font-weight: 700;
      color: #1a1a1a;
      letter-spacing: -0.5px;
    }
    .logo-accent {
      color: #6366f1;
    }
    h1 {
      font-size: 24px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 16px 0;
      text-align: center;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
      color: #4b5563;
      margin: 0 0 24px 0;
      text-align: center;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    .link-fallback {
      background-color: #f3f4f6;
      border-radius: 8px;
      padding: 16px;
      margin: 24px 0;
      word-break: break-all;
    }
    .link-fallback p {
      font-size: 14px;
      color: #6b7280;
      margin: 0 0 8px 0;
    }
    .link-fallback a {
      color: #6366f1;
      text-decoration: none;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      font-size: 14px;
      color: #9ca3af;
      margin: 0;
    }
    .security-note {
      background-color: #fee2e2;
      border-left: 4px solid #ef4444;
      padding: 12px 16px;
      margin: 24px 0;
      border-radius: 0 8px 8px 0;
    }
    .security-note p {
      font-size: 14px;
      color: #991b1b;
      margin: 0;
      text-align: left;
    }
    .expiry-note {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 12px 16px;
      margin: 24px 0;
      border-radius: 0 8px 8px 0;
    }
    .expiry-note p {
      font-size: 14px;
      color: #92400e;
      margin: 0;
      text-align: left;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-wrapper">
      <div class="logo">
        <span class="logo-text">Photo<span class="logo-accent">phile</span></span>
      </div>
      
      <h1>Reset your password</h1>
      
      <p>We received a request to reset your Photophile password. Click the button below to create a new password.</p>
      
      <div class="button-container">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </div>
      
      <div class="link-fallback">
        <p>Or copy and paste this link into your browser:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      </div>
      
      <div class="expiry-note">
        <p>⏰ This reset link will expire in 1 hour for security reasons.</p>
      </div>
      
      <div class="security-note">
        <p>🔒 If you didn't request a password reset, please ignore this email or contact support if you have concerns. Your password will remain unchanged.</p>
      </div>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} Photophile. All rights reserved.</p>
        <p style="margin-top: 8px;">Connecting photographers with clients worldwide.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Reset your Photophile password

We received a request to reset your Photophile password. Visit the link below to create a new password:

${resetUrl}

This reset link will expire in 1 hour for security reasons.

If you didn't request a password reset, please ignore this email or contact support if you have concerns. Your password will remain unchanged.

© ${new Date().getFullYear()} Photophile. All rights reserved.
  `.trim();

  return { subject, html, text };
};
