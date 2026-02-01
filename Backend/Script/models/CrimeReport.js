import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const coordinatesSchema = new Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { _id: false } 
);

const crimeReportSchema = new Schema(
  {
    reportId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    crimeType: {
      type: String,
      required: true,
      enum: [
        "theft/burglary",
        "assault",
        "fraud/scam",
        "harassment",
        "cyber-crime",
        "drug-related",
        "domestic-violence",
        "public-disorder",
        "traffic-violation",
        "property-damage",
        "other",
      ],
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    incidentDate: {
      type: Date,
      required: true,
    },


    incidentTime: {
      type: String, 
      required: true,
    },

    locationAddress: {
      type: String,
      required: true,
      trim: true,
    },

    coordinates: {
      type: coordinatesSchema,
      required: true,
    },

    evidenceUrls: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "rejected"],
      default: "pending",
    },

    acceptedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const CrimeReport = models.CrimeReport || model("CrimeReport", crimeReportSchema);
export default CrimeReport;
