import { appConfig } from "../../config";
import { parseDurationToMs } from "../core/time.util";

const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
const cookieSameSite = (process.env.COOKIE_SAMESITE || "strict").toLowerCase();
const resolvedSameSite = (cookieSameSite === "none" || cookieSameSite === "lax" || cookieSameSite === "strict")
    ? (cookieSameSite as "none" | "lax" | "strict")
    : "strict";

export const clearCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: resolvedSameSite,
    domain: cookieDomain,
    path: "/",
};

export const accessTokenCookieOptions = {
    ...clearCookieOptions,
    maxAge: parseDurationToMs(appConfig.ACCESS_TOKEN_EXPIRY, 24 * 60 * 60 * 1000),
};

export const refreshTokenCookieOptions = {
    ...clearCookieOptions,
    maxAge: parseDurationToMs(appConfig.REFRESH_TOKEN_EXPIRY, 7 * 24 * 60 * 60 * 1000),
};

export const csrfCookieOptions = {
    httpOnly: false,
    secure: clearCookieOptions.secure,
    sameSite: clearCookieOptions.sameSite,
    domain: clearCookieOptions.domain,
    path: "/",
    maxAge: parseDurationToMs(appConfig.REFRESH_TOKEN_EXPIRY, 7 * 24 * 60 * 60 * 1000),
};
