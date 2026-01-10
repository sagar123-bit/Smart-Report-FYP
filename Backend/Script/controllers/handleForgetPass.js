import User from "../models/User.js";
import { nanoid } from "nanoid";
import sendForgetPassEmail from "../services/nodemailer/sendForgetPassEmail.js";

const handleForgetPass = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

 
    const user = await User.findOne({ email });
    if (!user) {
     
      return res.status(200).json({
        message: "If this email exists, a reset link has been sent",
      });
    }

    const resetToken = nanoid(32);


    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.resetUrl = resetToken;
    user.resetUrlExpires = expiresAt;
    await user.save();

    const resetLink = `${process.env.RESET_PASSWORD_URL}/${resetToken}`;


    await sendForgetPassEmail(email, resetLink);

    return res.status(200).json({
      message: "If this email exists, a reset link has been sent",
    });

  } catch (error) {
    console.error("Error in handleForgetPass", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export default handleForgetPass;
