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
