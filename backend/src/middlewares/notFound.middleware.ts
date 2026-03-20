import { Request, Response } from "express";
import ApiError from "../utils/core/ApiError";

export const notFoundMiddleware = (req: Request, res: Response) => {
    return res.status(404).json(new ApiError(404, "Page not found"));
};
