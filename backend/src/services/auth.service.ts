import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { ERRORS } from "../constants/error";
import { appConfig } from "../config";
import User, { IUser } from "../models/user.model";
import { sendEmail } from "./email.service";
import { getPasswordResetTemplate, getVerificationEmailTemplate } from "../templates/email.template";
import ApiError from "../utils/core/ApiError";
import { generateTokens, verifyRefreshToken } from "../utils/auth/jwt.util";
import { generateSecureToken, hashToken } from "../utils/auth/token.util";
import { parseDurationToMs } from "../utils/core/time.util";
import { isPasswordStrong } from "../utils/auth/password.util";
import type { JWT_AUTH } from "../types/user";

type AuthUser = {
  _id: Types.ObjectId;
  fullName: string;
  avatar?: string | null;
  role?: "user" | "photographer";
  isEmailVerified: boolean;
};

const mapUserToAuth = (user: IUser & { _id: Types.ObjectId }): AuthUser => ({
  _id: user._id,
  fullName: user.fullName,
  avatar: user.avatar,
  role: user.role,
  isEmailVerified: user.isEmailVerified ?? false,
});

export const authService = {
  async login(email: string, password: string) {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new ApiError(401, ERRORS.AUTH.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, ERRORS.AUTH.WRONG_PASSWORD);
    }

    const authUser = mapUserToAuth(user);
    const tokens = await generateTokens(authUser as JWT_AUTH);

    return { user: authUser, tokens };
  },

  async register(fullName: string, email: string, password: string) {
    isPasswordStrong(password);

    try {
      const user = await User.create({ fullName, email, password });

      if (!user._id) {
        throw new ApiError(500, ERRORS.AUTH.REGISTRATION_FAILED);
      }

      const authUser = mapUserToAuth(user as IUser & { _id: Types.ObjectId });
      const tokens = await generateTokens(authUser as JWT_AUTH);

      // Automatically trigger verification email sending (don't await to avoid registration lag) calls the below function
      this.sendVerificationEmail(user.email).catch((err) => {
        console.error("[AUTO-EMAIL ERROR] Failed to trigger verification email:", err);
      });

      return { user: authUser, tokens };
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: number }).code === 11000
      ) {
        throw new ApiError(409, ERRORS.AUTH.USER_EXISTS);
      }
      throw error;
    }
  },

  async logout(userId: string | Types.ObjectId) {
    const user = await User.findByIdAndUpdate(userId, {
      $set: {
        refreshToken: undefined,
      },
    });

    if (!user) {
      throw new ApiError(404, ERRORS.AUTH.USER_NOT_FOUND);
    }
  },

  async refreshAccessToken(rawRefreshToken: string) {
    const decodedToken = verifyRefreshToken(rawRefreshToken);

    const user = await User.findById(decodedToken._id).select("+refreshToken");

    if (!user || !user.refreshToken) {
      throw new ApiError(401, ERRORS.AUTH.REFRESH_TOKEN_INVALID);
    }

    const isValidToken = await bcrypt.compare(rawRefreshToken, user.refreshToken);
    if (!isValidToken) {
      await User.findByIdAndUpdate(user._id, { $set: { refreshToken: undefined } });
      throw new ApiError(401, ERRORS.AUTH.REFRESH_TOKEN_INVALID);
    }

    const authUser = mapUserToAuth(user as IUser & { _id: Types.ObjectId });
    const tokens = await generateTokens(authUser as JWT_AUTH);

    return { user: authUser, tokens };
  },

  async sendVerificationEmail(email: string) {
    const genericMessage = "If an account exists, a verification email has been sent";

    const user = await User.findOne({ email }).select(
      "+emailVerificationToken +emailVerificationExpires +isEmailVerified",
    );

    if (!user || user.isEmailVerified) {
      return { genericMessage };
    }

    const verificationToken = generateSecureToken();
    const hashedToken = hashToken(verificationToken);

    const verificationExpiryMs = parseDurationToMs(
      appConfig.EMAIL_VERIFICATION_EXPIRY,
      24 * 60 * 60 * 1000,
    );
    const verificationExpires = new Date(Date.now() + verificationExpiryMs);

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    const emailTemplate = getVerificationEmailTemplate(verificationToken, appConfig.APP_BASE_URL);
    const emailResult = await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    if (!emailResult.success) {
      console.error("[EMAIL ERROR] Failed to send verification email:", {
        userId: user._id,
        email: user.email,
        error: emailResult.error,
      });
    }

    return { genericMessage };
  },

  async verifyEmail(token: string) {
    if (!token) {
      throw new ApiError(400, ERRORS.AUTH.VERIFICATION_TOKEN_INVALID);
    }

    const tokenHash = hashToken(token);

    const user = await User.findOne({
      emailVerificationToken: tokenHash,
      emailVerificationExpires: { $gt: new Date() },
    }).select("+emailVerificationToken +emailVerificationExpires +isEmailVerified");

    if (!user) {
      throw new ApiError(400, ERRORS.AUTH.VERIFICATION_TOKEN_INVALID);
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
  },

  async forgotPassword(email: string) {
    const genericMessage = "If an account exists, a password reset email has been sent";

    const user = await User.findOne({ email }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return { genericMessage };
    }

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const resetToken = generateSecureToken();
    const hashedToken = hashToken(resetToken);

    const resetExpiryMs = parseDurationToMs(appConfig.PASSWORD_RESET_EXPIRY, 60 * 60 * 1000);
    const resetExpires = new Date(Date.now() + resetExpiryMs);

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    const emailTemplate = getPasswordResetTemplate(resetToken, appConfig.APP_BASE_URL);
    const emailResult = await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    if (!emailResult.success) {
      console.error("[EMAIL ERROR] Failed to send password reset email:", {
        userId: user._id,
        email: user.email,
        error: emailResult.error,
      });
    }

    return { genericMessage };
  },

  async resetPassword(token: string, newPassword: string) {
    if (!token) {
      throw new ApiError(400, ERRORS.AUTH.RESET_TOKEN_INVALID);
    }

    if (!newPassword) {
      throw new ApiError(400, ERRORS.AUTH.PASSWORD_REQUIRED);
    }

    isPasswordStrong(newPassword);

    const tokenHash = hashToken(token);

    const user = await User.findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    }).select("+passwordResetToken +passwordResetExpires +refreshToken");

    if (!user) {
      throw new ApiError(400, ERRORS.AUTH.RESET_TOKEN_INVALID);
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken = undefined;

    await user.save();
  },
};
