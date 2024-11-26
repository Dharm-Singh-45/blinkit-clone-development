
import { Router } from "express";
import { forgotPasswordController, loginUserController, logoutUserController, registerUserController, updateUserDetails, uploadAvatar, verifyEmailController } from "../controllers/userController.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const userRouter = Router()

userRouter.post('/register',registerUserController)
userRouter.post('/verify-email',verifyEmailController)


userRouter.post('/login',loginUserController)
userRouter.get('/logout',auth,logoutUserController)

// update avatar
userRouter.put('/upload-avatar',auth,upload.single('avatar'),uploadAvatar)

// update user details
userRouter.put('/update-user',auth,updateUserDetails)

// FORGOT PASSWORD 
userRouter.post('/forgot-password',forgotPasswordController)





export default userRouter