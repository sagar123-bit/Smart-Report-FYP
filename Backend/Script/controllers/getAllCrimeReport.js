import CrimeReport from "../models/CrimeReport.js";

const getAllCrimeReports = async (req, res) => {
  try {
    const crimeReports = await CrimeReport.find()
      .sort({ createdAt: -1 })
      .select("-__v")
      .populate({
        path: "reportedBy",
        select: "-password -__v",
      })
      .populate({
        path: "assignedTo",
        select: "-password -__v",
      });

    return res.status(200).json({
      message: "Crime reports fetched successfully",
      count: crimeReports.length,
      reports: crimeReports,
    });

  } catch (error) {
    console.error("Error fetching crime reports", error);
    return res.status(500).json({
      message: "Server error",
      reports: null,
    });
  }
};

export default getAllCrimeReports;
