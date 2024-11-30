import { Router } from "express";
import { registerUserController } from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.post('/register-user', registerUserController);

export default userRouter