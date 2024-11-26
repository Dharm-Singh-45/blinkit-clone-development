import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "../utils/verifiyEmailTemplate.js";


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

export const loginUserController = async(req,res) =>{
    const{email,password} = req.body

}