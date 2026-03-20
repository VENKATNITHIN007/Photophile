import { Request, Response } from "express";
import { ERRORS } from "../constants/error";
import { authService } from "../services/auth.service";
import { accessTokenCookieOptions, clearCookieOptions, csrfCookieOptions, refreshTokenCookieOptions } from "../utils/auth/cookie.util";
import { generateSecureToken } from "../utils/auth/token.util";
import ApiError from "../utils/core/ApiError";
import ApiResponse from "../utils/core/ApiResponse";
import { asyncHandler } from "../utils/core/asyncHandler";
import { csrfCookieName } from "../middlewares/csrf.middleware";

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const csrfToken = generateSecureToken();

  return res
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .cookie(csrfCookieName, csrfToken, csrfCookieOptions);
};

const clearAuthCookies = (res: Response) => {
  return res
    .clearCookie("accessToken", clearCookieOptions)
    .clearCookie("refreshToken", clearCookieOptions)
    .clearCookie(csrfCookieName, clearCookieOptions);
};

export const issueCsrfToken = asyncHandler(async (_req: Request, res: Response) => {
  const csrfToken = generateSecureToken();

  return res
    .cookie(csrfCookieName, csrfToken, csrfCookieOptions)
    .status(200)
    .json(new ApiResponse({ csrfToken }, "CSRF token issued"));
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, tokens } = await authService.login(email, password);

  return setAuthCookies(res, tokens.accessToken, tokens.refreshToken).json(
    new ApiResponse({ user }, "You've been logged in successfully!"),
  );
});

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;
  const { user, tokens } = await authService.register(fullName, email, password);

  return setAuthCookies(res, tokens.accessToken, tokens.refreshToken)
    .status(201)
    .json(
      new ApiResponse(
        { user },
        "User has been registered and logged in successfully!",
      ),
    );
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, ERRORS.AUTH.REQUIRED);
  }

  await authService.logout(req.user._id!);

  return clearAuthCookies(res).json(
    new ApiResponse({}, "You've logged out successfully!"),
  );
});

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const rawRefreshToken = req.cookies?.refreshToken;

  if (!rawRefreshToken) {
    throw new ApiError(401, ERRORS.AUTH.REFRESH_TOKEN_REQUIRED);
  }

  try {
    const { tokens } = await authService.refreshAccessToken(rawRefreshToken);

    return setAuthCookies(res, tokens.accessToken, tokens.refreshToken).json(
      new ApiResponse(
        { accessToken: tokens.accessToken },
        "Access token refreshed successfully",
      ),
    );
  } catch (error) {
    clearAuthCookies(res);
    throw error;
  }
});

export const sendVerificationEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const { genericMessage } = await authService.sendVerificationEmail(email);

  return res.status(200).json(new ApiResponse({}, genericMessage));
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;
  await authService.verifyEmail(token);

  return res.status(200).json(new ApiResponse({}, "Email verified successfully"));
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const { genericMessage } = await authService.forgotPassword(email);

  return res.status(200).json(new ApiResponse({}, genericMessage));
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  await authService.resetPassword(token, newPassword);

  return res.status(200).json(
    new ApiResponse(
      {},
      "Password has been reset successfully. Please log in with your new password.",
    ),
  );
});
