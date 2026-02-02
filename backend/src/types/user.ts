import { IUser } from "../models/user.model";

export interface fileTypes extends Express.Multer.File {
    media: Express.Multer.File[];
    cover: Express.Multer.File[];
}

/**
 * JWT Auth Payload
 */
export type JWT_AUTH = Pick<IUser,"_id" | "fullName" | "avatar" | "role">;


/**
 * RoleType
 */
export type RoleType = "user" | "admin";