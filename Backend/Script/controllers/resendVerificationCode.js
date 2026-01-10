import UserBeforeRegister from "../models/userBeforeRegister.js";
import User from "../models/User.js";
import { generateToken } from "../helpers/generateToken.js";
import { sendVerificationEmail } from "../services/nodemailer/sendVerificationEmail.js";

const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }


    const verifiedUser = await User.findOne({ email });
    if (verifiedUser) {
      return res.status(409).json({
        message: "User already verified. Please login.",
      });
    }

    const tempUser = await UserBeforeRegister.findOne({ email });
    if (!tempUser) {
      return res.status(404).json({
        message: "No pending verification found for this email",
      });
    }


    const token = generateToken();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

    tempUser.validationToken = token;
    tempUser.tokenTime = expiresAt;

    await tempUser.save();
    await sendVerificationEmail(email, token);

    return res.status(200).json({
      message: "Verification code resent successfully",
      email,
    });
  } catch (error) {
    console.error("Error resending verification code", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export default resendVerificationCode;
