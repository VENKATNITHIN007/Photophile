import { NextFunction, Request, Response } from "express";
import { ERRORS } from "../constants/error";
import ApiError from "../utils/core/ApiError";
import User from "../models/user.model";
import { verifyToken } from "../utils/auth/jwt.util";

type AuthMiddlewareOptions = {
    requireVerifiedEmail?: boolean;
};

const createAuthMiddleware = ({ requireVerifiedEmail = true }: AuthMiddlewareOptions = {}) => {
    return async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        let bearerToken: string | undefined;

        if (authHeader) {
            const [scheme, token] = authHeader.trim().split(/\s+/);
            if (scheme?.toLowerCase() === "bearer" && token) {
                bearerToken = token;
            }
        }

        const token = req.cookies?.accessToken || bearerToken;

        if (!token) {
            throw new ApiError(401, ERRORS.AUTH.INVALID_TOKEN)
        }

        const decodedToken = verifyToken(token);

        if (!decodedToken) {
            return res.status(401).json(new ApiError(401, ERRORS.AUTH.REQUIRED));
        }

        const user = await User.findById(decodedToken._id);

        if (!user) {
            return res.status(401).json(new ApiError(401, ERRORS.AUTH.REQUIRED));
        }

        if (requireVerifiedEmail && !user.isEmailVerified && !req.path.endsWith("/logout")) {
            throw new ApiError(403, ERRORS.AUTH.EMAIL_NOT_VERIFIED);
        }

        req.user = user;

        next()

    } catch (error) {
        next(error)
    }
};
};

export const authMiddleware = createAuthMiddleware();
export const authMiddlewareAllowUnverified = createAuthMiddleware({ requireVerifiedEmail: false });
