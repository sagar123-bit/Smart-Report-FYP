import User from "../models/User.js";

export const updateUserProfile = async (req, res) => {
  try {
    const authUser = req.user; 
    // console.log("Authenticated User:", authUser);

    if (!authUser) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const {
      userName,
      phoneNumber,
      province,
      district,
      policeData,
    } = req.body;

    if (!userName || !phoneNumber || !province || !district) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    if (phoneNumber.length !== 10) {
      return res.status(400).json({
        message: "Phone number must be 10 digits",
      });
    }


    const updateFields = {
      userName,
      phoneNumber,
      province,
      district,
    };

    if (authUser.userType === "police") {
      if (!policeData?.rank || !policeData?.station) {
        return res.status(400).json({
          message: "Police rank and station are required",
        });
      }

      updateFields.policeData = {
        rank: policeData.rank,
        station: policeData.station,
      };
    }

    if (authUser.userType !== "police") {
      updateFields.$unset = { policeData: "" };
    }

    const updatedUser = await User.findByIdAndUpdate(
      authUser._id,
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -resetToken -resetTokenExpires");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
