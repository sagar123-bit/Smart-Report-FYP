import User from "../models/User.js";

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      userName,
      phoneNumber,
      province,
      district,
      policeData
    } = req.body;

    const updateFields = {};

    if (userName !== undefined) updateFields.userName = userName;
    if (phoneNumber !== undefined) updateFields.phoneNumber = phoneNumber;
    if (province !== undefined) updateFields.province = province;
    if (district !== undefined) updateFields.district = district;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.userType === "police" && policeData) {
      updateFields.policeData = {
        policeId: policeData.policeId || user.policeData?.policeId,
        rank: policeData.rank || user.policeData?.rank,
        station: policeData.station || user.policeData?.station,
        status: user.policeData?.status || "pending"
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    ).select("-password -resetToken -resetTokenExpires");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message
    });
  }
};