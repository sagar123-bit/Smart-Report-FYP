import Notification from "../models/Notification.js";

export const deleteNotification = async (req, res) => {
  try {
    const authUser = req.user;
    const { notificationId } = req.params;

    if (!authUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId: authUser._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Delete Notification Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
