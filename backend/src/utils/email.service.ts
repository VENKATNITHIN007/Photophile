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
 * Send an email using Resend API with retry logic
 * @param options - Email send options
 * @returns Promise resolving to send result
 */
export async function sendEmail(
  options: SendEmailOptions
): Promise<SendEmailResult> {
  // Validate required fields
  if (!options.to) {
    return { success: false, error: "Recipient email is required" };
  }

  if (!options.subject) {
    return { success: false, error: "Email subject is required" };
  }

  if (!options.html && !options.text) {
    return { success: false, error: "Email content (html or text) is required" };
  }

  // Use configured from email as default
  const from = options.from || appConfig.RESEND_FROM_EMAIL;

  // Generate idempotency key if not provided
  const idempotencyKey = options.idempotencyKey || generateIdempotencyKey();

  // Normalize recipients to array
  const to = Array.isArray(options.to) ? options.to : [options.to];

  // Check if we're in test/mock mode
  const isTestEnvironment = process.env.EMAIL_MOCK === "true";

  if (isTestEnvironment) {
    console.log("[EMAIL MOCK] Would send email:", {
      to,
      subject: options.subject,
      from,
      idempotencyKey,
    });
    return { success: true, messageId: `mock-${Date.now()}` };
  }

  // Check if Resend is configured
  if (!appConfig.RESEND_API_KEY) {
    console.error("[EMAIL ERROR] RESEND_API_KEY is not configured");
    return { success: false, error: "Email service is not configured" };
  }

  let lastError: Error | null = null;

  // Retry loop with exponential backoff
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[EMAIL] Sending email attempt ${attempt}/${MAX_RETRIES} to:`, to);

      // Build email payload dynamically with only defined fields
      const emailPayload: Record<string, unknown> = {
        from,
        to,
        subject: options.subject,
      };

      // Only add optional fields if they are defined
      if (options.html) emailPayload.html = options.html;
      if (options.text) emailPayload.text = options.text;
      if (options.replyTo) emailPayload.replyTo = options.replyTo;
      if (options.cc) emailPayload.cc = options.cc;
      if (options.bcc) emailPayload.bcc = options.bcc;
      if (options.attachments) emailPayload.attachments = options.attachments;

      const { data, error } = await resend.emails.send(
        emailPayload as unknown as Parameters<typeof resend.emails.send>[0],
        {
          idempotencyKey,
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      if (data?.id) {
        console.log(`[EMAIL] Successfully sent email with ID: ${data.id}`);
        return { success: true, messageId: data.id };
      }

      throw new Error("No message ID returned from Resend");
    } catch (error) {
      lastError = error as Error;

      const isRetryable = isRetryableError(error);
      const isLastAttempt = attempt === MAX_RETRIES;

      console.error(`[EMAIL ERROR] Attempt ${attempt} failed:`, {
        error: lastError.message,
        isRetryable,
        isLastAttempt,
      });

      // Don't retry on the last attempt or if error is not retryable
      if (isLastAttempt || !isRetryable) {
        break;
      }

      // Calculate exponential backoff delay
      const backoffDelay = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
      console.log(`[EMAIL] Retrying in ${backoffDelay}ms...`);
      await delay(backoffDelay);
    }
  }

  // All retries exhausted or non-retryable error
  console.error(`[EMAIL ERROR] Failed to send email after ${MAX_RETRIES} attempts`);

  // Return generic error message to client, log detailed error internally
  return {
    success: false,
    error: "Failed to send email. Please try again later.",
  };
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
