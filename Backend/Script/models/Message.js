import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const messageSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    kind: {
      type: String,
      enum: ["text", "image", "file"],
      required: true,
    },

    body: {
      type: String,
      required: function () {
        return this.kind === "text";
      },
    },

    mediaUrl: {
      type: String,
      required: function () {
        return this.kind === "image" || this.kind === "file";
      },
    },

    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
  },
  { timestamps: true }
);

const Message = models.Message || model("Message", messageSchema);
export default Message;
