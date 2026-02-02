import User from "../models/User.js";
import argon2 from "argon2";
import { generateJwtToken } from "../helpers/generateJWTToken.js";

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
  return res.status(404).json({ message: "User not found" });
}

if (user.status === "banned") {
  return res.status(403).json({ message: "Your account has been banned" });
}

if (
  user.userType === "police" &&
  user.policeData &&
  user.policeData.status === "pending"
) {
  return res
    .status(403)
    .json({ message: "Please wait for account verification" });
}

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid  password",
      });
    }

    const token = generateJwtToken(user.userId);

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000, 
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        userId: user.userId,
        email: user.email,
        userName: user.userName,
        userType: user.userType,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export default loginUser;
