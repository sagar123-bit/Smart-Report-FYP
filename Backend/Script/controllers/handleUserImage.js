import User from "../models/User.js";
import fs from "fs";
import path from "path";

class ProfileImage {
 static updateProfileImage = async (req, res) => {
    try {
      const user = req.user;

      if (!req.file) {
        return res.status(400).json({ message: "File is required" });
      }

      if (user?.userImage) {
        const oldImagePath = path.resolve(`./Script/uploads/${user.userImage}`);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      const imagePath = `${user.userId}/user-image/${req.file.filename}`;

      await User.findByIdAndUpdate(
        user._id,
        { userImage: imagePath },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        message: "Profile image updated successfully",
        image: imagePath,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
  static deleteProfileImage = async (req, res) => {
    try {
      const user = req.user;

      if (!user?.userImage) {
        return res.status(400).json({ message: "No profile image found" });
      }

      const filePath = path.resolve(`./Script/uploads/${user.userImage}`);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await User.findByIdAndUpdate(user._id, { $unset: { userImage: "" } });

      return res.status(200).json({
        message: "Profile image removed successfully",
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
}

export default ProfileImage;
