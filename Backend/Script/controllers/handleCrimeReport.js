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
        longitude
      } = req.body;

      if (!crimeType || !description || !incidentDate || !incidentTime || !locationAddress || !latitude || !longitude) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      const evidenceUrls = req.files?.map(file => `${authUser.userId}/crime-evidence/${file.filename}`) || [];

      const newReport = await CrimeReport.create({
        reportId: nanoid(10),
        reportedBy: authUser._id,
        crimeType,
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

      if (!authUser) return res.status(401).json({ message: "Unauthorized" });

      const report = await CrimeReport.findOne({ reportId });
      if (!report) return res.status(404).json({ message: "Report not found" });

      if (report.status !== "pending") {
        return res.status(403).json({ message: "Only pending reports can be updated" });
      }

      if (report.reportedBy.toString() !== authUser._id.toString() && authUser.userType !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      const { crimeType, description, incidentDate, incidentTime, locationAddress, latitude, longitude } = req.body;

      if (crimeType) report.crimeType = crimeType;
      if (description) report.description = description;
      if (incidentDate) report.incidentDate = new Date(incidentDate);
      if (incidentTime) report.incidentTime = incidentTime;
      if (locationAddress) report.locationAddress = locationAddress;
      if (latitude && longitude) {
        report.coordinates = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
      }


      if (req.files && req.files.length > 0) {
        // Delete old evidence files
        if (report.evidenceUrls && report.evidenceUrls.length > 0) {
          report.evidenceUrls.forEach(evidencePath => {
            const fullPath = path.resolve(`./Script/uploads/${evidencePath}`);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
          });
        }

        const newEvidence = req.files.map(file => `${authUser.userId}/crime-evidence/${file.filename}`);
        report.evidenceUrls = newEvidence;
      }

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

      if (!authUser) return res.status(401).json({ message: "Unauthorized" });

      const report = await CrimeReport.findOne({ reportId });
      if (!report) return res.status(404).json({ message: "Report not found" });


      if (authUser.userType === "citizen") {
        if (!["pending", "rejected"].includes(report.status)) {
          return res.status(403).json({ message: "You cannot delete reports under investigation or resolved" });
        }
        if (report.reportedBy.toString() !== authUser._id.toString()) {
          return res.status(403).json({ message: "Forbidden" });
        }
      }


      if (authUser.userType === "admin") {
        if (report.status === "under-investigation") {
          return res.status(403).json({ message: "Cannot delete reports under investigation" });
        }
      }


      if (report.evidenceUrls && report.evidenceUrls.length > 0) {
        report.evidenceUrls.forEach(evidencePath => {
          const fullPath = path.resolve(`./Script/uploads/${evidencePath}`);
          if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        });
      }

      await report.remove();

      return res.status(200).json({ message: "Crime report deleted successfully" });
    } catch (error) {
      console.error("Delete Report Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default CrimeReportController;
