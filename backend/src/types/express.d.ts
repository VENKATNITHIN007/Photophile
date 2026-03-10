import type { Multer } from "multer";
import type { UserType } from "./user";
import type { IPhotographer } from "../models/photographer.model";


/**
 * Extend Express Request type to include custom properties
 * used in the application (authenticated user, photographer, and multer files).
 */

declare module "express" {
  interface Request {
    user?: UserType;
    photographer?: IPhotographer & { _id: import("mongoose").Types.ObjectId };
    file?: Express.Multer.File;
    files?:
      | Express.Multer.File[]
      | { [fieldname: string]: Express.Multer.File[] };
  }
}
