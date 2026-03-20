import { Request, Response } from "express";
import { ERRORS } from "../constants/error";
import { userService } from "../services/user.service";
import ApiError from "../utils/core/ApiError";
import ApiResponse from "../utils/core/ApiResponse";
import { asyncHandler } from "../utils/core/asyncHandler";

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

  const updatedUser = await userService.updateProfile(req.user._id!, req.body);

  return res
    .status(200)
    .json(new ApiResponse({ data: updatedUser }, "Profile updated successfully"));
});
