import Notification from "../models/Notification.js";

export const getAllNotifications = async (req, res) => {
  try {
    const authUser = req.user;

    if (!authUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const notifications = await Notification.find().sort({ createdAt: -1 })
     .populate("userId", "userName email");
    //  console.log("Notifications fetched:", notifications);

    return res.status(200).json({
      notifications,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
