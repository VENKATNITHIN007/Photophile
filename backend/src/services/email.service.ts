import { Resend } from "resend";
import { appConfig } from "../config";

// Initialize Resend client with API key
const resend = new Resend(appConfig.RESEND_API_KEY);

// Email configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000; // 1 second

/**
 * Interface for email send options
 */
export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content?: Buffer | string;
    path?: string;
  }>;
  idempotencyKey?: string;
}

/**
 * Interface for email send result
 */
export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Generate a unique idempotency key
 * @param prefix - Prefix for the key
 * @returns Unique idempotency key
 */
function generateIdempotencyKey(prefix = "email"): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}/${timestamp}/${random}`;
}

/**
 * Delay execution for specified milliseconds
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after delay
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if error is retryable (network errors, rate limits, server errors)
 * @param error - Error to check
 * @returns Whether the error is retryable
 */
function isRetryableError(error: unknown): boolean {
  if (error && typeof error === "object") {
    const err = error as { statusCode?: number; message?: string };
    // Retry on rate limits (429), server errors (5xx), or network issues
    if (err.statusCode && (err.statusCode >= 500 || err.statusCode === 429)) {
      return true;
    }
    // Check for network-related error messages
    const networkErrors = [
      "ECONNREFUSED",
      "ETIMEDOUT",
      "ENOTFOUND",
      "ECONNRESET",
      "EPIPE",
    ];
    if (err.message && networkErrors.some((e) => err.message?.includes(e))) {
      return true;
    }
  }
  return false;
}

/**
 * Helper: Validate that all required email fields are present.
 */
function validateOptions(options: SendEmailOptions) {
  if (!options.to) throw new Error("Recipient email is required");
  if (!options.subject) throw new Error("Email subject is required");
  if (!options.html && !options.text) {
    throw new Error("Email content (html or text) is required");
  }
}

/**
 * Helper: Build the final payload for the Resend API.
 */
function buildPayload(options: SendEmailOptions, from: string) {
  const payload: Record<string, any> = {
    from,
    to: Array.isArray(options.to) ? options.to : [options.to],
    subject: options.subject,
  };

  if (options.html) payload.html = options.html;
  if (options.text) payload.text = options.text;
  if (options.replyTo) payload.replyTo = options.replyTo;
  if (options.cc) payload.cc = options.cc;
  if (options.bcc) payload.bcc = options.bcc;
  if (options.attachments) payload.attachments = options.attachments;

  return payload;
}

/**
 * Core: Sends a single email with automatic retry logic.
 */
async function sendWithRetry(payload: any, idempotencyKey: string): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { data, error } = await resend.emails.send(payload, { idempotencyKey });

      if (error) throw new Error(error.message);
      if (data?.id) return data.id;

      throw new Error("No message ID returned from Resend");
    } catch (error) {
      lastError = error as Error;

      if (attempt === MAX_RETRIES || !isRetryableError(error)) {
        throw lastError;
      }

      const backoffDelay = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
      console.log(`[EMAIL] Attempt ${attempt} failed, retrying in ${backoffDelay}ms...`);
      await delay(backoffDelay);
    }
  }
  throw lastError || new Error("Unknown email error");
}

/**
 * Main: Send an email using Resend API.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  try {
    // 1. Validate
    validateOptions(options);

    // 2. Prepare
    const from = options.from || appConfig.RESEND_FROM_EMAIL;
    const idempotencyKey = options.idempotencyKey || generateIdempotencyKey();
    const payload = buildPayload(options, from);

    // 3. Mock Mode Check
    if (process.env.EMAIL_MOCK === "true") {
      console.log("[EMAIL MOCK] Email ready to send:", { to: payload.to, subject: payload.subject });
      return { success: true, messageId: `mock-${Date.now()}` };
    }

    // 4. Send (with retries)
    if (!appConfig.RESEND_API_KEY) {
      throw new Error("Email service is not configured (RESEND_API_KEY missing)");
    }

    const messageId = await sendWithRetry(payload, idempotencyKey);
    return { success: true, messageId };

  } catch (error: any) {
    console.error("[EMAIL ERROR] Final Failure:", error.message);
    return {
      success: false,
      error: error.message || "Failed to send email. Please try again later.",
    };
  }
}

/**
 * Send a batch of emails using Resend API
 * @param emails - Array of email options
 * @returns Promise resolving to array of send results
 */
export async function sendBatchEmails(
  emails: SendEmailOptions[]
): Promise<SendEmailResult[]> {
  // Resend supports batch sending up to 100 emails
  const BATCH_SIZE = 100;

  if (emails.length === 0) {
    return [];
  }

  if (emails.length > BATCH_SIZE) {
    console.warn(
      `[EMAIL WARN] Batch size ${emails.length} exceeds limit of ${BATCH_SIZE}. Processing in chunks.`
    );
  }

  // Process in batches
  const results: SendEmailResult[] = [];
  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);

    // Send emails in parallel within batch
    const batchResults = await Promise.all(
      batch.map((email) => sendEmail(email))
    );

    results.push(...batchResults);
  }

  return results;
}

/**
 * Verify email configuration
 * @returns Whether email service is properly configured
 */
export function isEmailConfigured(): boolean {
  return Boolean(appConfig.RESEND_API_KEY && appConfig.RESEND_FROM_EMAIL);
}

/**
 * Create an email service wrapper with default from address
 * @param defaultFrom - Default from email address
 * @returns Email service object with send method
 */
export function createEmailService(defaultFrom?: string) {
  const from = defaultFrom || appConfig.RESEND_FROM_EMAIL;

  return {
    send: (options: Omit<SendEmailOptions, "from">) =>
      sendEmail({ ...options, from }),
    sendBatch: (emails: Array<Omit<SendEmailOptions, "from">>) =>
      sendBatchEmails(emails.map((email) => ({ ...email, from }))),
    isConfigured: () => isEmailConfigured(),
  };
}

// Default export for convenience
export default {
  send: sendEmail,
  sendBatch: sendBatchEmails,
  isConfigured: isEmailConfigured,
  createService: createEmailService,
};
