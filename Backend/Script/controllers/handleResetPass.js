import User from "../models/User.js";
import argon2 from "argon2";

const handleResetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    console.log(token,newPassword)

    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Token and new password are required",
      });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset link",
      });
    }


    const isSame = await argon2.verify(user.password, newPassword);
    if (isSame) {
      return res.status(400).json({
        message: "New password cannot be the same as old password",
      });
    }

    const hashedPassword = await argon2.hash(newPassword);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully. You can now login.",
    });

  } catch (error) {
    console.error("Error in handleResetPassword", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export default handleResetPassword;
