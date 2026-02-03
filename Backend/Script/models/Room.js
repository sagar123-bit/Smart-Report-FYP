import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const roomSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    relatedReport: {
      reportId: {
        type: Schema.Types.ObjectId,
        ref: "CrimeReport",
        required: true,
      },
      crimeType: {
        type: String,
        required: true,
      },
      province: {
        type: String,
        required: true,
      },
    },

    chats: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],

    lastChat: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  { timestamps: true }
);

const Room = models.Room || model("Room", roomSchema);
export default Room;
