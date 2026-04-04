import { Router } from "express";
import {
  currentUser,
  updateProfile,
} from "../controllers/user.controller";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { UpdateProfileSchema } from "../validations/auth.validation";
import { authMiddleware, authMiddlewareAllowUnverified } from "../middlewares/auth.middleware";

const userRouter = Router();

userRouter.get("/me", authMiddlewareAllowUnverified, currentUser);

userRouter
  .use(authMiddleware)
  .put("/profile", validateRequest(UpdateProfileSchema), updateProfile);

export default userRouter;
