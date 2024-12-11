import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "../utils/verifiyEmailTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generateOtp from "../utils/generateOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from 'jsonwebtoken'

/* Register User */

export const registerUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Fill Full Form",
        error: true,
        success: false,
      });
    }

    // Check if the email is already registered
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.json({
        message: "Already registered email",
        error: true,
        success: false,
      });
    }

    // Hash the password before saving
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    // Prepare user data for saving
    const payload = {
      name,
      email,
      password: hashPassword,
    };

    // Save the new user to the database
    const newUser = new UserModel(payload);
    const save = await newUser.save();

    // Generate email verification URL
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`;

    // Send verification email
    await sendEmail({
      sendTo: email,
      subject: "Verify email from Blinkit",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    return res.json({
      message: "User registered successfully",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    // Handle server errors
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/* Verify email */

export const verifyEmailController = async (req, res) => {
  try {
    const { code } = req.body;
    // Check if the user exists with the given code

    const user = await UserModel.findOne({ _id: code });

    if (!user) {
      return res.status(400).json({
        message: "Invalid code",
        error: true,
        success: false,
      });
    }
    // Update the user's email verification status
    await UserModel.findOne(
      { _id: code },
      {
        verify_email: true,
      }
    );
    return res.json({
      message: "Verify Email Done",
      success: true,
      error: false,
    });
  } catch (error) {
    // Handle server errors
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

/* Login user  */

export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "provide email and password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(400).json({
        message: "User not registered",
        error: true,
        success: false,
      });
    }

    if (user.status !== "Active") {
      return res.status(400).json({
        message: "Contact to Admin",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        message: "Check your Password",
        error: true,
        success: false,
      });
    }

    const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
      last_login_date : new Date()
    })
    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", accessToken, cookiesOption);
    res.cookie("refreshToken", refreshToken, cookiesOption);

    return res.json({
      message: "Login Successfully",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/* Logout user */

export const logoutUserController = async (req, res) => {
  try {
    const userId = req.userId; // middleware

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.clearCookie("accessToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
      refresh_token: "",
    });

    res.json({
      message: "Logout SuccessFully",
      error: false,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/*  upload user avatar */

export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.userId; // auth middleware
    const image = req.file; // multer middleware
    const upload = await uploadImageCloudinary(image);

    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      avatar: upload.url,
    });

    return res.json({
      message: "upload profile",
      success:true,
      error:false,
      data: {
        _id: userId,
        avatar: upload.url,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/*  update user details */

export const updateUserDetails = async (req, res) => {
  try {
    const userId = req.userId; // auth middleware
    const { name, email, mobile, password } = req.body;
    let hashPassword = "";
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashPassword = await bcryptjs.hash(password, salt);
    }

    const updateUser = await UserModel.updateOne(
      { _id: userId },
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: hashPassword }),
      }
    );
    return res.json({
      message: "Updated user successfully",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: true,
    });
  }
};

/* Forgot password */

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "email id not available",
        error: true,
        success: false,
      });
    }
    const otp = generateOtp();
    const expireTime = new Date() + 60 * 60 * 1000; //1h

    const update = await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: new Date(expireTime).toISOString(),
    });
    await sendEmail({
      sendTo: email,
      subject: "Forgot password from blinkIt",
      html: forgotPasswordTemplate({ name: user.name, otp: otp }),
    });

    return res.json({
      message: "check your email",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/* verify forgot password otp */

export const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "provide required field email, otp",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "email id not available",
        error: true,
        success: false,
      });
    }

    const currentTime = new Date().toISOString();
    if (user.forgot_password_expiry < currentTime) {
      return res.status(400).json({
        message: "otp expired",
        error: true,
        success: false,
      });
    }
    if (otp !== user.forgot_password_otp) {
      return res.status(400).json({
        message: "invalid otp",
        error: true,
        success: false,
      });
    }
    // if otp is not expired
    // otp === user.forgot_password_otp
    const updateUSer = await UserModel.findByIdAndUpdate(user?._id,{
      forgot_password_otp: '',
      forgot_password_expiry:''
    })

    return res.json({
      message: "Verify otp successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/* reset the password */

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message:
          "provide required field email, new password, confirm new Password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "email id not available",
        error: true,
        success: false,
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "new password and confirm password not match",
        error: true,
        success: false,
      });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(newPassword, salt);

    const update = await UserModel.findOneAndUpdate(user._id, {
      password: hashPassword,
    });
    return res.json({
      message: "password update successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/* refresh token controller */

export const refreshToken = async (req, res) => {
  try {
    const refreshToken =
      req.cookies.refreshToken || req.headers?.authorization?.split(" ")[1];

    if (!refreshToken) {
      return res.status(401).json({
        message: "Invalid Token",
        error: true,
        success: false,
      });
    }

    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN
    );

    if (!verifyToken) {
      return res.status(401).json({
        message: "Token is expired",
        error: true,
        success: false,
      });
    }
    const userId = verifyToken?._id;

    const newAccessToken = await generateAccessToken(userId);

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", newAccessToken, cookiesOption);

    return res.json({
      message:"New Access Token Generated",
      error: false,
      success:true,
      data:{
        accessToken : newAccessToken
      }
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};



/* Get login user details */

export const userDetails = async(req,res)=>{
  try {
    const userId = req.userId

    const user = await UserModel.findById(userId).select('-password -refresh_token')

    return res.json({
      message:"user Details",
      data:user,
      error:false,
      success:true
    })
  } catch (error) {
    
    return res.status(500).json({
      message:"something went wrong",
      error : true
    })
  }
}
