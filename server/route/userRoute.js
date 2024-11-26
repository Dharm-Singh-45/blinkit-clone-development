
import { Router } from "express";
import { loginUserController, logoutUserController, registerUserController, verifyEmailController } from "../controllers/userController.js";
import auth from "../middlewares/auth.js";

const userRouter = Router()

userRouter.post('/register',registerUserController)
userRouter.post('/verify-email',verifyEmailController)


userRouter.post('/login',loginUserController)
userRouter.get('/logout',auth,logoutUserController)





export default userRouter