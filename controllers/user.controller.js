import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";

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
      console.error("Failed to send verification email:", emailError.message || emailError);
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


// import UserModel from "../models/user.model.js";
// import bcrypt from "bcryptjs";
// import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
// import sendEmail from "../config/sendEmail.js";

// export async function registerUserController(request, response) {
//   try {
//     const { name, email, password } = request.body;

//     // Validate input fields
//     if (!name || !email || !password) {
//       return response.status(400).json({
//         message: "All fields are required",
//         error: true,
//         success: false,
//       });
//     }


//     // Check if user already exists
//     const user = await UserModel.findOne({ email });

//     if (user) {
//       return response.status(400).json({
//         message: "User already exists",
//         error: true,
//         success: false,
//       });
//     }

//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create a new user payload
//     const payload = {
//       name,
//       email,
//       password: hashedPassword,
//     };

//      // Save the new user in the database
//     const newUser = new UserModel(payload);
//     const save = await newUser.save();

//     // Generate a verification URL
//     const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

//     const verifyEmail = await sendEmail({
//       sendTo: email,
//       subject: "Verify your email",
//       html: verifyEmailTemplate({ name, url: verifyEmailUrl }),
//     });

//     return response.json({
//       message: "User registered successfully",
//       error: false,
//       success: true,
//       data: save,
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//     console.error(error);
//   }
// }
