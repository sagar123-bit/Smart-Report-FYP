import mongoose from "mongoose";
import Room from "../models/Room.js";
import Message from "../models/Message.js";

export const getCrimeReportRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const authUser = req.user;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({
        message: "Invalid room id",
      });
    }

    if (!authUser?._id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const room = await Room.findById(roomId)
      .populate({
        path: "participants",
        select: "_id userName userImage userType",
      })
      .populate({
        path: "createdBy",
        select: "_id userName userImage",
      })
      .populate({
        path: "relatedReport.reportId",
        select: "crimeType province status",
      })
      .populate({
        path: "lastChat",
        populate: {
          path: "from",
          select: "userName userImage",
        },
      });

    if (!room) {
      return res.status(404).json({
        message: "Chat room not found",
      });
    }

    const isParticipant = room.participants.some(
      (p) => p._id.toString() === authUser._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are not allowed to access this room",
      });
    }

    const messages = await Message.find({ room: roomId })
      .populate({
        path: "from",
        select: "_id userName userImage",
      })
      .sort({ createdAt: 1 });

    const otherParticipant = room.participants.find(
      (p) => p._id.toString() !== authUser._id.toString()
    );

    return res.status(200).json({
      success: true,
      messages,
      room: {
        id: room._id,
        participants: room.participants,
        otherParticipant,
        createdBy: room.createdBy,
        relatedReport: room.relatedReport,
        lastChat: room.lastChat,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get crime report room messages error:", error);
    return res.status(500).json({
      message: "Failed to load chat messages",
    });
  }
};
