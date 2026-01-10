import UserBeforeRegister from "../models/userBeforeRegister.js";
import User from "../models/User.js";
import { nanoid } from "nanoid";

const verifyUserAndCreateAccount = async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({
        message: "Email and token are required",
      });
    }

    const tempUser = await UserBeforeRegister.findOne({ email });

    if (!tempUser) {
      return res.status(404).json({
        message: "Verification session not found",
      });
    }

    if (tempUser.validationToken !== token) {
      return res.status(400).json({
        message: "Invalid verification token",
      });
    }

    if (tempUser.tokenTime < new Date()) {
      return res.status(400).json({
        message: "Verification token expired",
      });
    }

    const alreadyExists = await User.findOne({ email });
    if (alreadyExists) {
      return res.status(409).json({
        message: "User already verified",
      });
    }

    const userId = `USR_${nanoid(10)}`;


    const userPayload = {
      userId,
      userName: tempUser.userName,
      email: tempUser.email,
      phoneNumber: tempUser.phoneNumber,
      province: tempUser.province,
      district: tempUser.district,
      password: tempUser.password,
      userType: tempUser.userType,
    };

    if (tempUser.userType === "police") {
      userPayload.policeData = {
        policeId: tempUser.policeData.policeId,
        rank: tempUser.policeData.rank,
        station: tempUser.policeData.station,
      };
    }

    const newUser = await User.create(userPayload);

    await UserBeforeRegister.deleteOne({ email });

    return res.status(201).json({
      message: "Account verified and created successfully",
      user: {
        id: newUser._id,
        userId: newUser.userId,
        email: newUser.email,
        userName: newUser.userName,
        userType: newUser.userType,
      },
    });
  } catch (error) {
    console.error("Error verifying user", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "UserId collision, please retry",
      });
    }

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export default verifyUserAndCreateAccount;
