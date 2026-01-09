import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export const policeSchema = new Schema(
  {
    policeId: {
      type: String,
      required: function () {
        return this.userType === "police";
      },
    },
    rank: {
      type: String,
      required: function () {
        return this.userType === "police";
      },
    },
    station: {
      type: String,
      required: function () {
        return this.userType === "police";
      },
    },
  },
  { _id: false } 
);


const UserSchema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["citizen", "police","admin"],
      default: "citizen",
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    policeData: {
      type: policeSchema,
      required: function () {
        return this.userType === "police";
      },
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
