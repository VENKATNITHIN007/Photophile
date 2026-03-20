import { Router } from "express";
import {
  currentUser,
  updateProfile,
} from "../controllers/user.controller";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { UpdateProfileSchema } from "../validations/auth.validation";
import { authMiddleware } from "../middlewares/auth.middleware";

const userRouter = Router();

// Protected routes
userRouter
  .use(authMiddleware)
  .get("/me", currentUser)
  .put("/profile", validateRequest(UpdateProfileSchema), updateProfile);

export default userRouter;
