import { io } from "socket.io-client";
import React from "react";
import { BASE_URL } from "../utils/config";
export const socket = io(BASE_URL);
export const SocketContext = React.createContext();
