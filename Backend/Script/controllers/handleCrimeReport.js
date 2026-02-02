import CrimeReport from "../models/CrimeReport.js";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";

class CrimeReportController {


  static createReport = async (req, res) => {
    try {
      const authUser = req.user;
      if (!authUser) return res.status(401).json({ message: "Unauthorized" });

      const {
        crimeType,
        description,
        incidentDate,
        incidentTime,
        locationAddress,
        latitude,
        longitude,
        province
      } = req.body;

      if (!crimeType || !description || !province || !incidentDate || !incidentTime || !locationAddress || !latitude || !longitude) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      const evidenceUrls = req.files?.map(file => `${authUser.userId}/crime-evidence/${file.filename}`) || [];

      const newReport = await CrimeReport.create({
        reportId: nanoid(10),
        reportedBy: authUser._id,
        crimeType,
        province,
        description,
        incidentDate: new Date(incidentDate),
        incidentTime,
        locationAddress,
        coordinates: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
        evidenceUrls,
        status: "pending",
        acceptedAt: null,
      });

      return res.status(201).json({
        message: "Crime report created successfully",
        report: newReport,
      });
    } catch (error) {
      console.error("Create Report Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };


  static updateReport = async (req, res) => {
  try {
    const authUser = req.user;
    const { reportId } = req.params;

    if (!authUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const report = await CrimeReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (report.reportedBy.toString() !== authUser._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (report.status !== "pending") {
      return res
        .status(403)
        .json({ message: "Only pending reports can be updated" });
    }

    const {
      crimeType,
      description,
      incidentDate,
      incidentTime,
      locationAddress,
      province, 
      latitude,
      longitude,
      existingEvidences = [],
      removedEvidences = [],
    } = req.body;

    if (crimeType) report.crimeType = crimeType;
    if (description) report.description = description;
    if (incidentDate) report.incidentDate = new Date(incidentDate);
    if (incidentTime) report.incidentTime = incidentTime;
    if (locationAddress) report.locationAddress = locationAddress;
    if (province) report.province = province; 

    if (latitude && longitude) {
      report.coordinates = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };
    }

    const removed = Array.isArray(removedEvidences)
      ? removedEvidences
      : removedEvidences
      ? [removedEvidences]
      : [];

    removed.forEach((evidencePath) => {
      const fullPath = path.resolve(`./Script/uploads/${evidencePath}`);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    const keptEvidence = Array.isArray(existingEvidences)
      ? existingEvidences
      : existingEvidences
      ? [existingEvidences]
      : [];

    const newEvidence =
      req.files?.map(
        (file) => `${authUser.userId}/crime-evidence/${file.filename}`
      ) || [];

    report.evidenceUrls = [...keptEvidence, ...newEvidence];

    await report.save();

    return res.status(200).json({
      message: "Crime report updated successfully",
      report,
    });
  } catch (error) {
    console.error("Update Report Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


static deleteReport = async (req, res) => {
  try {
    const authUser = req.user;
    const { reportId } = req.params;

    if (!authUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const report = await CrimeReport.findOne({ _id:reportId });
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const status = report.status;

    if (authUser.userType === "citizen") {
      if (!["pending", "rejected"].includes(status)) {
        return res.status(403).json({
          message: "You are not allowed to delete this report",
        });
      }

      if (report.reportedBy.toString() !== authUser._id.toString()) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    if (authUser.userType === "admin") {
      if (status === "in-progress") {
        return res.status(403).json({
          message: "Cannot delete report under investigation",
        });
      }
    }

    if (report.evidenceUrls?.length > 0) {
      report.evidenceUrls.forEach((evidencePath) => {
        const fullPath = path.resolve(`./Script/uploads/${evidencePath}`);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    await report.deleteOne();

    return res.status(200).json({
      message: "Crime report deleted successfully",
    });
  } catch (error) {
    console.error("Delete Report Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

static updateReportStatus = async (req, res) => {
  try {
    const authUser = req.user;
    const { reportId } = req.params;
    const { status } = req.body;

    if (!authUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const report = await CrimeReport.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (!["in-progress", "rejected", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    report.status = status;
    report.assignedTo = authUser._id;

    if (status === "in-progress") {
      report.acceptedAt = new Date();
    }

    if (status !== "in-progress") {
      report.acceptedAt = null;
    }

    await report.save();

    return res.status(200).json({
      message: "Report status updated successfully",
      report,
    });
  } catch (error) {
    console.error("Update Report Status Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

}

export default CrimeReportController;
