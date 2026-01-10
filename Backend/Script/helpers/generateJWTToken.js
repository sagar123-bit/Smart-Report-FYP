import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export const generateJwtToken = (userId) => {
  if (!userId) {
    throw new Error("userId is required to generate JWT");
  }

  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
      issuer: "smart-report",
      audience: "user",
    }
  );
};

export const verifyJwtToken = (token) => {
  if (!token) {
    throw new Error("Token is required");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "smart-report",
      audience: "user",
    });

    return decoded; 
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};