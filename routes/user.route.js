import { Router } from "express";
import {
  registerUserController,
  verifyEmailController,
  loginController,
  logoutController,
} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const userRouter = Router();

userRouter.post("/register-user", registerUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginController);
userRouter.get("/logout", authMiddleware, logoutController);

export default userRouter;
