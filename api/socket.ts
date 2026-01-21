import AsyncStorage from "@react-native-async-storage/async-storage";
import {io, Socket }from "socket.io-client"


const SOCKET_URL = process.env.EXPO_PUBLIC_BACK_URL!;

let socket: Socket;

export const connectSocket = async () => {
  const data = await AsyncStorage.getItem("ChatUserData");
  const user = data ? JSON.parse(data) : null;

  socket = io(SOCKET_URL, {
    transports: ["websocket"], // IMPORTANT for RN
    autoConnect: true,
    auth: {
      token: user?.token || "",
    },
  });

  return socket;
};

export const getSocket = () => socket;