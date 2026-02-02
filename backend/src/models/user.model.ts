import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  _id?: mongoose.Types.ObjectId;

  email: string;
  phoneNumber?: string;

  fullName: string;
  avatar?: string;

  password: string;
  refreshToken?: string;

  // OTP / verification
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;

  role?: "user" | "admin";

  createdAt?: Date;
  updatedAt?: Date;
}

type userModel = Model<IUser>

type UserMethods = {
  isPasswordCorrect: (password: string) => Promise<boolean>
}

const userSchema = new Schema<IUser, userModel, UserMethods>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minLength: [2, "Full name must be at least 2 characters long"],
      maxLength: [50, "Full name cannot exceed 50 characters"],
      match: [/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"]
    },

    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      index: true,
      trim: true,
      sparse: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"]
    },

    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    password: {
      type: String,
      select: false,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters long"],
      maxLength: [70, "Password cannot exceed 70 characters"],
      // validate: {
      //   validator: function (password) {
      //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password);
      //   },
      //   message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      // }
    },

    refreshToken: {
      type: String,
      select: false,
    },

    avatar: {
      type: String,
      trim: true,
      default: null,
      validate: {
        validator: function (url) {
          if (!url) return true;
          return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(url);
        },
        message: "Please provide a valid URL for the avatar"
      }
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string,): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};


userSchema.set('toJSON', {
  transform: (doc, ret) => {
    const { password, refreshToken, __v, ...rest } = ret;

    return rest;
  },
});


userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  return user;
};


export const User = mongoose.model("User", userSchema);

export default User;