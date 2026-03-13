import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDB from "./db";

import { createVersionRoute } from "./utils/helper/route.util";
import errorHandler from "./middlewares/errorHandler.middleware";
import ApiError from "./utils/ApiError";
import { apiRateLimiter } from "./middlewares/rateLimiter.middleware";

import userRouter from "./routes/user.router";
import photographerRouter from "./routes/photographer.route";
import portfolioRouter from "./routes/portfolio.route";
import reviewRouter from "./routes/review.route";
import bookingRouter from "./routes/booking.route";
import helmet from "helmet";

// Read allowed frontend origins from ORIGIN_HOSTS env variable.
// If it exists, convert the comma-separated string into an array and remove spaces.
// If it does not exist, fall back to default localhost origins.
const allowedHost = process.env.ORIGIN_HOSTS
  ? process.env.ORIGIN_HOSTS.split(",").map((h) => h.trim())
  : ["http://localhost:3000", "http://localhost:3002"];


const port = process.env.PORT || 3001;

const app = express();

if (process.env.TRUST_PROXY) {
  app.set("trust proxy", 1);
}

/**
 * Security middlewares learn more about headers 
 */
app.use(helmet())


app.use(express.json({ limit: "10MB" }));
app.use(express.urlencoded({ limit: "10MB", extended: true }));
app.use(cookieParser());

/**
 * Cors
 */
app.use(
  cors({
    origin: allowedHost,
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

/**
 * Rate limiting for API routes
 */
app.use("/api", apiRateLimiter);

/**
 * Routing
 */

app.use(createVersionRoute("users"), userRouter);
app.use(createVersionRoute("photographers"), photographerRouter);
app.use(createVersionRoute("portfolio"), portfolioRouter);
app.use(createVersionRoute("reviews"), reviewRouter);
app.use(createVersionRoute("bookings"), bookingRouter);

/**
 * Error Handing
 */
app.use(errorHandler);

/**
 * 404 errors
 */
app.use("*", function (req, res) {
  return res.status(404).json(new ApiError(404, "Page not found"));
});

connectToDB()
  .then(() => {
    app.listen(port, () => {
      console.info(
        `Dukan backend is running on http://localhost:${port} in ${app.settings.env} mode`,
      );
    });
  })
  .catch((err) => console.error(err));
