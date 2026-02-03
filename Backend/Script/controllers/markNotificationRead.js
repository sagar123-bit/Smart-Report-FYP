import Notification from "../models/Notification.js";
export const markAllNotificationsRead = async (req, res) => {
  try {
    const authUser = req.user;

    if (!authUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await Notification.updateMany(
      { userId: authUser._id, read: false },
      { $set: { read: true } }
    );

    return res.status(200).json({
      message: `${result.modifiedCount} notifications marked as read`,
    });
  } catch (error) {
    console.error("Mark Notifications Read Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
