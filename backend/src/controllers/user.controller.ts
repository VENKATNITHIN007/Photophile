import { Request, RequestHandler, Response } from "express";
import ApiResponse from "../utils/ApiResponse";
import User from "../models/user.model";
import ApiError from "../utils/ApiError";
import bcrypt from "bcrypt";
import { ERRORS } from "../constants/error";
import { isPasswordStrong } from "../utils/helper/password.util";
import { generateTokens, verifyRefreshToken } from "../utils/helper/jwt.util";
import { clearCookieOptions, accessTokenCookieOptions, refreshTokenCookieOptions, appConfig } from "../config";
import { asyncHandler } from "../utils/asyncHandler";
import { generateSecureToken, hashToken, verifyToken } from "../utils/helper/token.util";
import { sendEmail } from "../utils/email.service";
import { getVerificationEmailTemplate, getPasswordResetTemplate } from "../templates/email.template";



/**
 * Login user
 * @param req
 * @param res
 * @returns
 */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email }).select("+password");
  if (!userExists) {
    throw new ApiError(401, ERRORS.AUTH.INVALID_CREDENTIALS );
  }

  if (!userExists.isPasswordCorrect(password)) {
    throw new ApiError(401, ERRORS.AUTH.WRONG_PASSWORD);
  }

  const user = {
    _id: userExists._id,
    fullName: userExists.fullName,
    avatar: userExists.avatar,
    role: userExists.role,
  };

  const { accessToken, refreshToken } = await generateTokens(user);

  return res
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(
      new ApiResponse(
        { user },
        "You've been logged in successfully!",
      ),
    );
});

/**
 * Register a new User
 * @param req
 * @param res
 * @returns
 */
export const registerUser: RequestHandler = asyncHandler(async (req, res) => {
  const { email, password, fullName } = req.body;

  // Validate password strength
  isPasswordStrong(password);

  try {
    // Attempt to create user directly
    // Unique index on email will prevent duplicates atomically
    const user = await User.create({
      fullName,
      email,
      password,
    });

    if (!user._id) {
      throw new ApiError(500, "Something went wrong while registering user");
    }

    // Auto-login: Generate tokens for the newly registered user
    const userData = {
      _id: user._id,
      fullName: user.fullName,
      avatar: user.avatar,
      role: user.role,
    };

    const { accessToken, refreshToken } = await generateTokens(userData);

    return res
      .status(201)
      .cookie("accessToken", accessToken, accessTokenCookieOptions)
      .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
      .json(
        new ApiResponse(
          { user: userData },
          "User has been registered and logged in successfully!",
        ),
      );
  } catch (error: any) {
    // Handle duplicate key error (MongoDB error code 11000)
    if (error.code === 11000 && error.keyPattern?.email) {
      throw new ApiError(409, ERRORS.AUTH.USER_EXISTS);
    }
    
    // Re-throw other errors
    throw error;
  }
});

/**
 * Logout User
 * @param req
 * @param res
 * @returns
 */
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, ERRORS.AUTH.REQUIRED);
  }

  const userId = req.user._id;
  const user = await User.findByIdAndUpdate(userId, {
    $set: {
      refreshToken: undefined,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  return res
    .clearCookie("accessToken", clearCookieOptions)
    .clearCookie("refreshToken", clearCookieOptions)
    .json(new ApiResponse({}, "You've logged out successfully!"));
});

/**
 * Refresh access token
 * @param req
 * @param res
 * @returns
 */
export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  const decodedToken = verifyRefreshToken(refreshToken);
  const user = await User.findById(decodedToken._id).select("+refreshToken");

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  if (!user.refreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const isValidToken = await bcrypt.compare(refreshToken, user.refreshToken);
  if (!isValidToken) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const userData = {
    _id: user._id,
    fullName: user.fullName,
    avatar: user.avatar,
    role: user.role,
  };

  const { accessToken, refreshToken: newRefreshToken } = await generateTokens(userData);

  return res
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions)
    .json(
      new ApiResponse(
        { accessToken },
        "Access token refreshed successfully",
      ),
    );
});

export const currentUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, ERRORS.AUTH.REQUIRED);
  }
  return res
    .status(200)
    .json(new ApiResponse(req.user, "Fetched current user details"));
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, ERRORS.AUTH.REQUIRED);
  }

  const { fullName, phoneNumber, avatar, password, currentPassword } = req.body;
  const userId = req.user._id;

  // Build update data
  const updateData: any = {};
  if (fullName !== undefined) updateData.fullName = fullName;
  if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
  if (avatar !== undefined) updateData.avatar = avatar;

  // Handle password update with verification
  if (password !== undefined) {
    // Require current password for security
    if (!currentPassword) {
      throw new ApiError(400, "Current password is required to change password");
    }

    // Fetch user with password to verify
    const user = await User.findById(userId).select("+password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await user.isPasswordCorrect(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new ApiError(401, "Current password is incorrect");
    }

    // Validate and hash new password
    isPasswordStrong(password);
    updateData.password = await bcrypt.hash(password, 12);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  const userResponse = {
    _id: updatedUser._id,
    fullName: updatedUser.fullName,
    avatar: updatedUser.avatar,
    role: updatedUser.role,
    email: updatedUser.email,
    phoneNumber: updatedUser.phoneNumber
  };

  return res
    .status(200)
    .json(new ApiResponse({ data: userResponse }, "Profile updated successfully"));
});


/**
 * Send verification email to user
 * Send verification email to user
 * Send verification email to user
 * @param req
 * @param res
 * @returns
 */
export const sendVerificationEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  // Always return generic success message to prevent email enumeration
  const genericMessage = "If an account exists, a verification email has been sent";

  // Find user by email (select verification fields which are not selected by default)
  const user = await User.findOne({ email }).select("+emailVerificationToken +emailVerificationExpires +isEmailVerified");

  // If user doesn't exist, return generic success (don't reveal user existence)
  if (!user) {
    return res
      .status(200)
      .json(new ApiResponse({}, genericMessage));
  }

  // If already verified, still return success but don't send email
  // This prevents revealing whether the email is verified or not
  if (user.isEmailVerified) {
    return res
      .status(200)
      .json(new ApiResponse({}, genericMessage));
  }

  // Generate secure token and hash it
  const verificationToken = generateSecureToken();
  const hashedToken = await hashToken(verificationToken);

  // Calculate expiry time (24 hours from now)
  const expiryHours = parseInt(appConfig.EMAIL_VERIFICATION_EXPIRY) || 24;
  const verificationExpires = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

  // Save hashed token and expiry to user document
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = verificationExpires;
  await user.save();

  // Get email template
  const baseUrl = appConfig.APP_BASE_URL;
  const emailTemplate = getVerificationEmailTemplate(verificationToken, baseUrl);

  // Send verification email
  const emailResult = await sendEmail({
    to: user.email,
    subject: emailTemplate.subject,
    html: emailTemplate.html,
    text: emailTemplate.text,
  });

  // If email fails, log error but still return generic success
  // Don't reveal internal errors to the client
  if (!emailResult.success) {
    console.error("[EMAIL ERROR] Failed to send verification email:", {
      userId: user._id,
      email: user.email,
      error: emailResult.error,
    });
  } else {
    console.log("[EMAIL] Verification email sent successfully to:", user.email);
  }

  // Return generic success message regardless of outcome
  return res
    .status(200)
    .json(new ApiResponse({}, genericMessage));
});

/**
 * Verify email with token
 * Verifies user's email address using the provided verification token
 * @param req
 * @param res
 * @returns
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    throw new ApiError(400, ERRORS.AUTH.VERIFICATION_TOKEN_INVALID);
  }

  // Find user by querying all users and checking tokens
  // We need to select the verification fields which are not selected by default
  const users = await User.find({
    emailVerificationToken: { $exists: true, $ne: null },
    emailVerificationExpires: { $exists: true, $ne: null },
  }).select("+emailVerificationToken +emailVerificationExpires +isEmailVerified email");

  // Find the user with matching token using bcrypt compare
  let matchedUser = null;
  for (const user of users) {
    if (user.emailVerificationToken) {
      const isMatch = await verifyToken(token, user.emailVerificationToken);
      if (isMatch) {
        matchedUser = user;
        break;
      }
    }
  }

  // If no user found with matching token, return generic error
  // Don't reveal whether token is invalid or expired
  if (!matchedUser) {
    throw new ApiError(400, ERRORS.AUTH.VERIFICATION_TOKEN_INVALID);
  }

  // Check if token has expired
  if (matchedUser.emailVerificationExpires && matchedUser.emailVerificationExpires < new Date()) {
    throw new ApiError(400, ERRORS.AUTH.VERIFICATION_TOKEN_INVALID);
  }

  // Check if already verified
  if (matchedUser.isEmailVerified) {
    // Still clear the token fields for security
    matchedUser.emailVerificationToken = undefined;
    matchedUser.emailVerificationExpires = undefined;
    await matchedUser.save();
    
    return res
      .status(200)
      .json(new ApiResponse({}, "Email verified successfully"));
  }

  // Mark email as verified and clear token fields
  matchedUser.isEmailVerified = true;
  matchedUser.emailVerificationToken = undefined;
  matchedUser.emailVerificationExpires = undefined;
  await matchedUser.save();

  return res
    .status(200)
    .json(new ApiResponse({}, "Email verified successfully"));
});

/**
 * Forgot password - initiates password reset process
 * Sends password reset email with secure token
 * Returns generic success message to prevent email enumeration
 * @param req
 * @param res
 * @returns
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  // Always return generic success message to prevent email enumeration
  const genericMessage = "If an account exists, a password reset email has been sent";

  // Find user by email (select password reset fields which are not selected by default)
  const user = await User.findOne({ email }).select("+passwordResetToken +passwordResetExpires");

  // If user doesn't exist, return generic success (don't reveal user existence)
  if (!user) {
    return res
      .status(200)
      .json(new ApiResponse({}, genericMessage));
  }

  // Invalidate any existing reset tokens by clearing them first
  // This ensures only one active reset token per user
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Generate secure token and hash it
  const resetToken = generateSecureToken();
  const hashedToken = await hashToken(resetToken);

  // Calculate expiry time (1 hour from now)
  const expiryHours = parseInt(appConfig.PASSWORD_RESET_EXPIRY) || 1;
  const resetExpires = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

  // Save hashed token and expiry to user document
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = resetExpires;
  await user.save();

  // Get email template
  const baseUrl = appConfig.APP_BASE_URL;
  const emailTemplate = getPasswordResetTemplate(resetToken, baseUrl);

  // Send password reset email
  const emailResult = await sendEmail({
    to: user.email,
    subject: emailTemplate.subject,
    html: emailTemplate.html,
    text: emailTemplate.text,
  });

  // If email fails, log error but still return generic success
  // Don't reveal internal errors to the client
  if (!emailResult.success) {
    console.error("[EMAIL ERROR] Failed to send password reset email:", {
      userId: user._id,
      email: user.email,
      error: emailResult.error,
    });
  } else {
    console.log("[EMAIL] Password reset email sent successfully to:", user.email);
  }

  // Return generic success message regardless of outcome
  return res
    .status(200)
    .json(new ApiResponse({}, genericMessage));
});