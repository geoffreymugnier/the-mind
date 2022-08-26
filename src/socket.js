import { writable } from "svelte/store";
import io from "socket.io-client";

export const socket = io("http://localhost:3000");
