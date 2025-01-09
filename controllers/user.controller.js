import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";

export async function registerUserController(request, response) {
  try {
    const { name, email, password } = request.body;

    // Validate input fields
    if (!name || !email || !password) {
      return response.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    // Check if user already exists
    const user = await UserModel.findOne({ email });
    if (user) {
      return response.status(400).json({
        message: "User already exists",
        error: true,
        success: false,
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user payload
    const payload = {
      name,
      email,
      password: hashedPassword,
    };

    // Save the new user in the database
    const newUser = new UserModel(payload);
    const save = await newUser.save();

    // Generate a verification URL
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

    // Send a verification email
    try {
      await sendEmail({
        sendTo: email,
        subject: "Verify your email",
        html: verifyEmailTemplate({ name, url: verifyEmailUrl }),
      });
      console.log("Verification email sent to:", email);
    } catch (emailError) {
      console.error(
        "Failed to send verification email:",
        emailError.message || emailError
      );
    }

    // Return success response
    return response.json({
      message: "User registered successfully",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    console.error("Error in registerUserController:", error.message || error);
    return response.status(500).json({
      message: "Server error. Please try again later.",
      error: true,
      success: false,
    });
  }
}

export async function verifyEmailController(request, response) {
  try {
    const code = request.body;
    const user = await UserModel.findOne({ _id: code });
    if (!user) {
      return response.status(400).json({
        message: "Invalid verification code",
        error: true,
        success: false,
      });
    }

    const updateUser = await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );

    return response.status(200).json({
      message: "Email verified successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: true,
    });
  }
}

// login Controller for user accounts

export async function loginController(request, response) {
  try {
    const { email, password } = request.body;

    if(!email || !password) {
      return response.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return response.status(400).json({
        message: "User not register",
        error: true,
        success: false,
      });
    }

    if (user.status !== "Active") {
      return response.status(400).json({
        message:
          "User account is not active. Please contact your administrator",
        error: true,
        success: false,
      });
    }

    // match password
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return response.status(400).json({
        message: "Invalid password",
        error: true,
        success: false,
      });
    }

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    response.cookie("accessToken", accessToken, cookieOptions);
    response.cookie("refreshToken", refreshToken, cookieOptions);

    return response.status(200).json({
      message: "Login successful",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
        user,
      }
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// logout controller
export async function logoutController(request, response){
try{
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  response.clearCookie("accessToken", cookieOptions);
  response.clearCookie("refreshToken", cookieOptions);

  return response.status(200).json({
    message: "Logout successful",
    error: false,
    success: true,
  })

}catch(error){
  return response.status(500).json({
    message: error.message || error,
    error: true,
    success: false,
  })
}
}
