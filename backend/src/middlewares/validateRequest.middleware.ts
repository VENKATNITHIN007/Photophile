import { NextFunction, Request, Response } from "express";
import {  ZodType } from "zod";

/**
 * this validates the request data using zod validations before the data reaching controller 
 */
export const validateRequest = (schema: ZodType) => {
    return function (req: Request, res: Response, next: NextFunction) {

        try {
            schema.parse({
                ...req.body,
                ...req.files,
                ...req.file,
            })

            next()
        } catch (error) {
            next(error);
        }
    }
}

