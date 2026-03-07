import { Request, RequestHandler, Response } from "express";
import ApiResponse from "../utils/ApiResponse";
import User from "../models/user.model";
import ApiError from "../utils/ApiError";
import bcrypt from "bcrypt";
import { AUTH_FAILED, AUTH_REQUIRED, USER_EXISTS } from "../constants";
import { generateTokens, isPasswordStrong, verifyRefreshToken } from "../utils/helper";
import { clearCookieOptions, accessTokenCookieOptions, refreshTokenCookieOptions } from "../config";
import { asyncHandler } from "../utils/asyncHandler";

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
    throw new ApiError(401, AUTH_FAILED);
  }

  if (!userExists.isPasswordCorrect(password)) {
    throw new ApiError(401, AUTH_FAILED);
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

  isPasswordStrong(password)

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(409, USER_EXISTS);
  }

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
});

/**
 * Logout User
 * @param req
 * @param res
 * @returns
 */
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, AUTH_REQUIRED);
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
    throw new ApiError(401, AUTH_REQUIRED);
  }
  return res
    .status(200)
    .json(new ApiResponse(req.user, "Fetched current user details"));
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, AUTH_REQUIRED);
  }

  const { fullName, phoneNumber, avatar,password } = req.body;
  isPasswordStrong(password)
  const userId = req.user._id;

  const updateData: any = {};
  if (fullName !== undefined) updateData.fullName = fullName;
  if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
  // Handle password update separately with proper hashing
  if (password !== undefined) {
    // Hash the password before storing
    updateData.password = await bcrypt.hash(password, 12);
  }
  if(password !== undefined) updateData.password = password

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  const user = {
    _id: updatedUser._id,
    fullName: updatedUser.fullName,
    avatar: updatedUser.avatar,
    role: updatedUser.role,
    email: updatedUser.email,
    phoneNumber: updatedUser.phoneNumber
  };

  return res
    .status(200)
    .json(new ApiResponse({ data: user }, "Profile updated successfully"));
});
