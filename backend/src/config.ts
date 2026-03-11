import "dotenv/config"

export const appConfig = {
    // NODE_ENV is set to 'production' when the app is running in production environment by platforms, otherwise it is undefined, so we need to check for both conditions to enable debug mode in development and when APP_DEBUG is set to true , the second condition is useful for enabling debug mode in staging environment where NODE_ENV is set to 'production' but we still want to see debug logs
    debug: process.env.NODE_ENV !== "production" || String(process.env.APP_DEBUG).toLowerCase() === "true",

    // Access Token
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "1d",

    // Refresh Token
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "7d",

    // Database
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",

    // MongoDB Database
    MONGO_URL: process.env.MONGO_URL|| "mongodb://localhost:27017",

    DB_NAME: process.env.DB_NAME || "dukan",

    // Email Configuration (Resend)
    RESEND_API_KEY: process.env.RESEND_API_KEY || "",
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || "",
    APP_BASE_URL: process.env.APP_BASE_URL || "http://localhost:3000",
    EMAIL_VERIFICATION_EXPIRY: process.env.EMAIL_VERIFICATION_EXPIRY || "24h",
    PASSWORD_RESET_EXPIRY: process.env.PASSWORD_RESET_EXPIRY || "1h",
}

export const clearCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
}

export const accessTokenCookieOptions = {
    ...clearCookieOptions,
    maxAge: 24 * 60 * 60 * 1000,
};

export const refreshTokenCookieOptions = {
    ...clearCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export default appConfig;

// Validate required email configuration
if (!appConfig.RESEND_API_KEY) {
    console.error("[ERROR] RESEND_API_KEY is required but not set");
    if (process.env.NODE_ENV === "production") {
        process.exit(1);
    }
}

if (!appConfig.RESEND_FROM_EMAIL) {
    console.error("[ERROR] RESEND_FROM_EMAIL is required but not set");
    if (process.env.NODE_ENV === "production") {
        process.exit(1);
    }
}