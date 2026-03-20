import appConfig from "../../config";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import ApiError from "../core/ApiError";
import User from "../../models/user.model";
import type { JWT_AUTH } from "../../types/user";
import bcrypt from "bcrypt";
import { ERRORS } from "../../constants/error";

// in auth middleware 
// it is used in many places later 
export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, appConfig.ACCESS_TOKEN_SECRET) as JWT_AUTH;
    } catch (error) {
        console.log("JWT Error", error);

        if (error instanceof TokenExpiredError) {
            throw new ApiError(401, ERRORS.JWT.EXPIRED);
        }

        if (error instanceof JsonWebTokenError) {
            throw new ApiError(401, ERRORS.JWT.INVALID);
        }

        throw new ApiError(401, ERRORS.JWT.INVALID);
    }
};
// to generate new acess token after expiration 
export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, appConfig.REFRESH_TOKEN_SECRET) as JWT_AUTH;
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            throw new ApiError(401, ERRORS.JWT.REFRESH_EXPIRED);
        }

        if (error instanceof JsonWebTokenError) {
            throw new ApiError(401, ERRORS.JWT.REFRESH_INVALID);
        }

        throw new ApiError(401, ERRORS.JWT.REFRESH_INVALID);
    }
};
// login controller 
// if auto login after register then in register controller 
export const generateTokens = async (userData: JWT_AUTH) => {
    if (!userData) {
        throw new Error("Data is missing");
    }

    try {
        const accessToken = generateAccessToken(userData);

        const refreshToken = generateRefreshToken(userData);

        /**
         * Update refresh token to database
         */

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await User.findByIdAndUpdate(userData._id, {
            $set: { refreshToken: hashedRefreshToken },
        });

        return { accessToken, refreshToken };
    } catch (error) {
        if (error instanceof Error) {
            throw new ApiError(500, error.message);
        }

        throw new ApiError(500, ERRORS.JWT.GENERATION_FAILED);
    }
};

// inside genreate token 
// after acess token expired using verify refresh token to generate new access token 
export const generateAccessToken = (payload: JWT_AUTH) => {
    return jwt.sign(payload, appConfig.ACCESS_TOKEN_SECRET, {
        expiresIn: appConfig.ACCESS_TOKEN_EXPIRY as `${number}${'d' | 'h' | 'm' | 's'}`,
    });
};
// inside generate token 
// token rotation(optional)
export const generateRefreshToken = (payload: JWT_AUTH) => {
    return jwt.sign(payload, appConfig.REFRESH_TOKEN_SECRET, {
        expiresIn: appConfig.REFRESH_TOKEN_EXPIRY as `${number}${'d' | 'h' | 'm' | 's'}`,
    });
};