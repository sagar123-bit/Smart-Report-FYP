import User from "../models/User.js";
import { verifyJwtToken } from "../helpers/generateJWTToken.js";

const authMiddleware = async (req, res, next) => {
  req.user = null;
  try {
    const token = req.cookies?.auth_token;

    if (token) {
      try {
        const decoded = verifyJwtToken(token);
        const { userId } = decoded;

        if (userId) {
          const user = await User.findOne({ userId }).select("-password");
          if (user) {
            req.user = user;
          }
        }
      } catch (err) {}
    }

    next();
  } catch (error) {
    next();
  }
};

export default authMiddleware;
