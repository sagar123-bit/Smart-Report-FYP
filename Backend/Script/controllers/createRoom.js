import Room from "../models/Room.js";
import CrimeReport from "../models/CrimeReport.js";

export const createCrimeReportRoom = async (req, res) => {
  try {
    const authUser = req.user;
    const { reportId, otherUserId } = req.body;

    if (!authUser || !reportId || !otherUserId) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    if (authUser._id.toString() === otherUserId) {
      return res.status(400).json({
        message: "You cannot create a room with ownself",
      });
    }

    const report = await CrimeReport.findById(reportId);

    if (!report) {
      return res.status(404).json({
        message: "Crime report not found",
      });
    }

    const existingRoom = await Room.findOne({
      "relatedReport.reportId": report._id,
      participants: { $all: [authUser._id, otherUserId] },
    });

    if (existingRoom) {
      return res.status(200).json({
        message: "Chat room already exists",
        room: existingRoom,
      });
    }

    const room = await Room.create({
      participants: [authUser._id, otherUserId],
      createdBy: authUser._id,
      relatedReport: {
        reportId: report._id,
        crimeType: report.crimeType,
        province: report.province,
      },
      chats: [],
      lastChat: null,
    });

    return res.status(201).json({
      message: "Chat room created successfully",
      room,
    });
  } catch (error) {
    console.error("Create Crime Report Room Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
