import Notification from "../models/Notification.js";

export const clearAllNotifications = async (req, res) => {
  try {
    const authUser = req.user;

    if (!authUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Notification.deleteMany({ userId: authUser._id });

    return res.status(200).json({
      message: "All notifications cleared successfully",
    });
  } catch (error) {
    console.error("Clear Notifications Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
