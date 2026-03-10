import { Request, Response, NextFunction } from "express";
import mongoose, { Model } from "mongoose";
import ApiError from "../utils/ApiError";

type Source = "body" | "query" | "both";

interface ValidationOptions<T extends mongoose.Document> {
  fieldName: string;
  model: Model<T>;
  source?: Source;
}
// query needs typing 
interface ValidateRequest extends Request {
  query: {
    [fieldName: string]: string | string[] | undefined;
  };
}

export function validateIds<T extends mongoose.Document>({
  fieldName,
  model,
  source = "both",
}: ValidationOptions<T>) {
  return async (req: ValidateRequest, res: Response, next: NextFunction) => {
    let rawIds;
    // ids extracted from body or query using dynamic keys 
    if (source === "body") rawIds = req.body[fieldName];
    else if (source === "query") rawIds = req.query[fieldName];
    else rawIds = req.body[fieldName] ?? req.query[fieldName];

    if (!rawIds) return next();

    // convert into array and check if its valid 
    const ids = Array.isArray(rawIds) ? rawIds : [rawIds];

    const allValid = ids.every((id) => mongoose.isValidObjectId(id));
    if (!allValid) {
      return res
        .status(400)
        .json(new ApiError(400, `Invalid ${fieldName} ID(s)`));
    }

    const foundDocs = await model.find({ _id: { $in: ids } });
    if (foundDocs.length !== ids.length) {
      return res
        .status(404)
        .json(new ApiError(404, `Some ${fieldName} ID(s) not found`));
    }

    // convert ids from string to array inside query or body  to maintain consistency for both single and multiple ids
    if (source === "body") req.body[fieldName] = ids;
    else req.query[fieldName] = ids;

    next();
  };
}
