import { Router } from "express";
import {
    issueCsrfToken,
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    sendVerificationEmail,
    verifyEmail,
    forgotPassword,
    resetPassword,
} from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { LoginSchema, RegisterSchema, ForgotPasswordSchema, ResetPasswordSchema, SendVerificationEmailSchema, VerifyEmailSchema } from "../validations/auth.validation";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authRateLimiter, sensitiveOpRateLimiter } from "../middlewares/rateLimiter.middleware";

const authRouter = Router();

// Public routes with stricter rate limiting for auth endpoints
authRouter
    .get("/csrf", issueCsrfToken)
    .post("/login", authRateLimiter, validateRequest(LoginSchema), loginUser)
    .post(
        "/register",
        authRateLimiter,
        validateRequest(RegisterSchema),
        registerUser,
    )
    .post("/refresh-token", sensitiveOpRateLimiter, refreshAccessToken)
    .post("/verify-email/send", sensitiveOpRateLimiter, validateRequest(SendVerificationEmailSchema), sendVerificationEmail)
    .post("/verify-email", sensitiveOpRateLimiter, validateRequest(VerifyEmailSchema), verifyEmail)
    .post("/forgot-password", sensitiveOpRateLimiter, validateRequest(ForgotPasswordSchema), forgotPassword)
    .post("/reset-password", sensitiveOpRateLimiter, validateRequest(ResetPasswordSchema), resetPassword)
    // Protected route section for logout since it requires the user token
    .use(authMiddleware)
    .post("/logout", logoutUser);

export default authRouter;
