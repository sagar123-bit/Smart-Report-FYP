import UserBeforeRegister from "../models/userBeforeRegister.js";
import User from "../models/User.js";
import { generateToken } from "../helpers/generateToken.js";
import argon2 from "argon2";
import { sendVerificationEmail } from "../services/nodemailer/sendVerificationEmail.js";


const handleUserBeforeRegister = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { email, password, ...rest } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        user: null,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
        user: null,
      });
    }

 
    const hashedPassword = await argon2.hash(password);

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);


    const checkValidation = await UserBeforeRegister.findOne({ email });

    if (checkValidation) {
      checkValidation.validationToken = token;
      checkValidation.tokenTime = expiresAt;
      checkValidation.password = hashedPassword;
      Object.assign(checkValidation, rest);

      await checkValidation.save();
      await sendVerificationEmail(email, token);

      return res.status(200).json({
        message: "Verification token resent",
        user: checkValidation?.email,
      });
    }


    const newUser = await UserBeforeRegister.create({
      email,
      password: hashedPassword,
      ...rest,
      validationToken: token,
      tokenTime: expiresAt,
    });
    await sendVerificationEmail(email, token);
    return res.status(201).json({
      message: "User stored successfully",
      user: newUser?.email,
    });

  } catch (error) {
    console.error("Error on handleUserBeforeRegister", error);
    return res.status(500).json({
      message: "Server Error",
      user: null,
    });
  }
};

export default handleUserBeforeRegister;
