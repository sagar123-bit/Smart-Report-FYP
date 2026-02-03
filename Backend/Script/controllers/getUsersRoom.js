import Room from "../models/Room.js";
import mongoose from "mongoose";

export const getMyCrimeReportRooms = async (req, res) => {
  try {
    const authUser = req.user;

    if (!authUser?._id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const userObjectId = authUser._id;

    if (!mongoose.Types.ObjectId.isValid(userObjectId)) {
      return res.status(400).json({
        message: "Invalid user identifier",
      });
    }

    const rooms = await Room.find({
      participants: userObjectId,
    })
      .populate([
        {
          path: "participants",
          select: "userName email userImage userType",
        },
        {
          path: "createdBy",
          select: "userName email userImage",
        },
        {
          path: "relatedReport.reportId",
          select: "crimeType province status",
        },
        {
          path: "lastChat",
          populate: {
            path: "from",
            select: "userName userImage",
          },
        },
      ])
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("Fetch Crime Report Rooms Error:", error);
    return res.status(500).json({
      message: "Failed to load chat rooms",
    });
  }
};
