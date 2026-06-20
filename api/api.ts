import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Axios instance ──────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACK_URL,
});

api.interceptors.request.use(async (config: any) => {
  const raw = await AsyncStorage.getItem("ChatUserData");
  const userData = raw ? JSON.parse(raw) : null;
  config.headers.Authorization = `Bearer ${userData?.token ?? ""}`;
  return config;
});

// ─── Types ───────────────────────────────────────────────────
export interface Friend {
  id: string;
  name: string;
  dp?: string;
  chatId: string;
  isOnline: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface FriendRequest {
  _id: string;
  name: string;
  Dp?: string;
}

export interface Message {
  _id: string;
  chatId: string;
  msg: string;
  sender: string;
  time: string;
  createdAt?: string;
}

export interface SearchUser {
  _id: string;
  name: string;
}

// ─── Friends API ─────────────────────────────────────────────
export const friendsApi = {
  /** GET /friends — list accepted friends with lastMessage */
  getAll: () => api.get<Friend[]>("/friends"),

  /** POST /friends — send a friend request */
  sendRequest: (friendId: string) =>
    api.post<{ message: string }>("/friends", { friendId }),

  /** GET /friends/requests — incoming pending requests */
  getRequests: () => api.get<FriendRequest[]>("/friends/requests"),

  /** POST /friends/accept — accept a pending request */
  accept: (friendId: string) =>
    api.post<{ message: string }>("/friends/accept", { friendId }),

  /** POST /friends/reject — reject / cancel a request */
  reject: (friendId: string) =>
    api.post<{ message: string }>("/friends/reject", { friendId }),

  /** POST /friends/unfriend — remove friend from both sides */
  unfriend: (friendId: string) =>
    api.post<{ message: string }>("/friends/unfriend", { friendId }),
};

// ─── Messages API ────────────────────────────────────────────
export const messagesApi = {
  /** GET /message/:chatId — load full history (sorted asc) */
  getHistory: (chatId: string) =>
    api.get<Message[]>(`/message/${chatId}`),

  /** POST /message — persist a single message */
  send: (payload: { chatId: string; msg: string; sender: string; time: string }) =>
    api.post<Message>("/message", payload),
};

// ─── Users API ───────────────────────────────────────────────
export const usersApi = {
  /** POST /user — login or register */
  loginOrRegister: (body: { name: string; email: string; password: string }) =>
    api.post<{ name: string; token: string; id: string }>("/user", body),

  /** GET /user/:username — search users by name (partial, case-insensitive) */
  search: (username: string) =>
    api.get<SearchUser[]>(`/user/${username}`),
};

export { api };
