import { Server } from "socket.io";
import Message from "../../models/Message.js";
import Room from "../../models/Room.js";
import Notification from "../../models/Notification.js";

let io;
const onlineMap = new Map();

export const pushNotification = async (payload) => {
  const saved = await Notification.create(payload);
  await saved.populate({
    path: "userId",
    select: "userName email",
  });

  const targetSocket = onlineMap.get(payload.userId.toString());
  if (targetSocket) {
    io.to(targetSocket).emit("notification", saved);
  }
};

const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (client) => {
    const { user } = client.handshake.query;

    if (user) {
      onlineMap.set(user, client.id);
      console.log(`User ${user} connected with socket ID: ${client.id}`);
    }

    client.on("enterRoom", async (roomId) => {
      try {
        const room = await Room.findById(roomId);
        if (!room) {
          return client.emit("roomError", { roomId });
        }

        const allowed = room.participants.some(
          (id) => id.toString() === user
        );

        if (!allowed) {
          return client.emit("roomError", { roomId });
        }

        client.join(roomId);
        console.log(`User ${user} joined room: ${roomId}`);
        client.emit("roomEntered", { roomId });
      } catch {
         console.error("Error joining room:", error);
        client.emit("roomError", { roomId });
      }
    });

    client.on("exitRoom", (roomId) => {
        console.log(`User ${user} left room: ${roomId}`);
      client.leave(roomId);
    });

    client.on("postMessage", async (payload) => {
  try {
    const { roomId, text, type, mediaUrl, sender } = payload;

    if (!roomId || !sender) {
      return client.emit("sendError");
    }

    const room = await Room.findById(roomId);
    if (!room) return client.emit("sendError");

    const allowed = room.participants.some((id) => id.toString() === sender);
    if (!allowed) return client.emit("sendError");

    const msgPayload = {
      from: sender,
      room: roomId,
      kind: type || "text",
    };

    if (msgPayload.kind === "text") {
      if (!text?.trim()) return client.emit("sendError");
      msgPayload.body = text;
    } else if (msgPayload.kind === "image" || msgPayload.kind === "file") {
      if (!mediaUrl) return client.emit("sendError");
      msgPayload.mediaUrl = mediaUrl;
    } else {
      return client.emit("sendError");
    }

    const created = await Message.create(msgPayload);

    room.lastChat = created._id;
    room.chats.push(created._id);
    await room.save();

    const populated = await Message.findById(created._id).populate(
      "from",
      "userName userImage email"
    );

    io.to(roomId).emit("incomingMessage", populated);

    room.participants.forEach((participantId) => {
      if (participantId.toString() !== sender) {
        pushNotification({
          userId: participantId,
          title: "New Message",
          content: `${populated.from.userName} sent a message`,
          read: false,
        });
      }
    });

    client.emit("sentAck", {
      roomId,
      messageId: created._id,
    });

  } catch (error) {
    console.error("Error posting message:", error);
    client.emit("sendError");
  }
});


    client.on("disconnect", () => {
      for (const [key, value] of onlineMap.entries()) {
        if (value === client.id) {
          onlineMap.delete(key);
          break;
        }
      }
    });
  });
};

export { io, onlineMap };
export default initSocketServer;
