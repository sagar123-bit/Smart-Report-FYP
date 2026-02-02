import User from "../models/User.js";
import { sendPoliceVerificationEmail } from "../services/nodemailer/sendPoliceVerificationEmail.js";

export const verifyPolice = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.userType !== "police") {
      return res.status(400).json({ message: "User is not a police officer" });
    }

    await sendPoliceVerificationEmail(user.email, status);

    if (status === "rejected") {
      await User.findByIdAndDelete(userId);
      return res.status(200).json({
        message: "Police officer rejected and account deleted successfully",
      });
    }

    user.policeData.status = status;
    await user.save();

    res.status(200).json({
      message: "Police officer verified successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
