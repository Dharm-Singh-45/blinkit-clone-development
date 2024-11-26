
import { Router } from "express";
import { loginUserController, registerUserController, verifyEmailController } from "../controllers/userController.js";

const userRouter = Router()

userRouter.post('/register',registerUserController)
userRouter.post('/verify-email',verifyEmailController)


userRouter.post('/login',loginUserController)





export default userRouter