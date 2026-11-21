import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@/types/socket";

export type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:8080";

let socket: GameSocket | null = null;

/**
 * One socket per browser tab, created on first use. Only call this from effects
 * or event handlers: client components also render on the server, where no
 * connection should be opened.
 */
export function getSocket(): GameSocket {
  socket ??= io(SERVER_URL);
  return socket;
}
