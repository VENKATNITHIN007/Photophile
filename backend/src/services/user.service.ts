import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { ERRORS } from "../constants/error";
import User, { IUser } from "../models/user.model";
import ApiError from "../utils/core/ApiError";
import { isPasswordStrong } from "../utils/auth/password.util";

type UserProfileUpdate = {
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
  password?: string;
  currentPassword?: string;
};

const mapUserToProfile = (user: IUser & { _id: Types.ObjectId }) => {
  return {
    _id: user._id,
    fullName: user.fullName,
    avatar: user.avatar,
    role: user.role,
    email: user.email,
    phoneNumber: user.phoneNumber,
  };
};

export const userService = {
  async updateProfile(userId: string | Types.ObjectId, update: UserProfileUpdate) {
    const { fullName, phoneNumber, avatar, password, currentPassword } = update;

    const updateData: Partial<Pick<IUser, "fullName" | "phoneNumber" | "avatar" | "password">> = {};

    if (fullName !== undefined) updateData.fullName = fullName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (avatar !== undefined) updateData.avatar = avatar;

    if (password !== undefined) {
      if (!currentPassword) {
        throw new ApiError(400, ERRORS.AUTH.CURRENT_PASSWORD_REQUIRED);
      }

      const user = await User.findById(userId).select("+password");
      if (!user) {
        throw new ApiError(404, ERRORS.AUTH.USER_NOT_FOUND);
      }

      const isCurrentPasswordValid = await user.isPasswordCorrect(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new ApiError(401, "Current password is incorrect");
      }

      isPasswordStrong(password);
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      throw new ApiError(404, ERRORS.AUTH.USER_NOT_FOUND);
    }

    return mapUserToProfile(updatedUser as IUser & { _id: Types.ObjectId });
  },
};
