import { NextFunction, Request, Response } from "express";
import { ERRORS } from "../constants/error";
import ApiError from "../utils/ApiError";

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json(new ApiError(401, ERRORS.AUTH.REQUIRED));
        }

        const loggedUser = req.user;

        const isAdminUser = loggedUser.role?.toLowerCase() === 'admin';

        if (!isAdminUser) {
            return res.status(403).json(new ApiError(403, ERRORS.AUTH.FORBIDDEN));
        }

        next();
    } catch (error) {
        throw new ApiError(500, "Internal Server Error");
    }
};