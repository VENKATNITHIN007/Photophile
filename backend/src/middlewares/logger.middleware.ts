import { Request, Response, NextFunction } from "express";

/**
 * Simple request logger middleware to track incoming API traffic
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on("finish", () => {
        const elapsed = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${elapsed}ms`);
    });

    next();
};
