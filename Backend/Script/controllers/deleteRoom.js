import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Room from "../models/Room.js";
import Message from "../models/Message.js";

export const deleteCrimeReportRoom = async (req, res) => {
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

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Chat room not found",
      });
    }

    if (room.createdBy.toString() !== authUser._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this room",
      });
    }

    const messages = await Message.find({ room: roomId });

    for (const msg of messages) {
      if (
        (msg.kind === "image" || msg.kind === "file") &&
        msg.mediaUrl
      ) {
        const absolutePath = path.join(
          process.cwd(),
          "Script",
          "uploads",
          msg.mediaUrl
        );

        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath);
        }
      }
    }

    await Message.deleteMany({ room: roomId });

    await Room.findByIdAndDelete(roomId);

    return res.status(200).json({
      message: "Chat room and all related messages deleted successfully",
    });
  } catch (error) {
    console.error("Delete crime report room error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
