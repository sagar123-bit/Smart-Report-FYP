import { createContext, useContext, useEffect, useState } from "react";
import { io as initSocket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "@/store/slices/getAllNotifications";

const LiveContext = createContext(null);

export const useLiveSocket = () => useContext(LiveContext);

const LiveSocketProvider = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [connection, setConnection] = useState(null);

  useEffect(() => {
    if (!user?._id || connection) return;

    const socketClient = initSocket(import.meta.env.VITE_SERVER_URL, {
      withCredentials: true,
      query: { user: user._id },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1200,
    });

    setConnection(socketClient);

    socketClient.on("connect", () => {
      console.log("Live socket connected:", socketClient.id);
    });

     socketClient.on("notification", async (notification) => {
      await dispatch(addNotification(notification));
    });

    


    socketClient.on("disconnect", () => {
      console.log("Live socket disconnected");
    });

    socketClient.on("connect_error", (err) => {
      console.error("Live socket error:", err);
    });

    return () => {
      socketClient.disconnect();
      setConnection(null);
    };
  }, [user?._id]);

  return (
    <LiveContext.Provider value={{ socket: connection }}>
      {children}
    </LiveContext.Provider>
  );
};

export default LiveSocketProvider;
