import { notFound } from "next/navigation";
import { GameScreen } from "@/components/game/GameScreen";

// The backend names rooms with nanoid(7). Rejecting anything else keeps stray
// URLs (/about, /favicon.ico...) from opening an empty room on the server.
const ROOM_ID = /^[A-Za-z0-9_-]{7}$/;

export default async function RoomPage({ params }: PageProps<"/[roomID]">) {
  const { roomID } = await params;
  if (!ROOM_ID.test(roomID)) notFound();
  return <GameScreen roomID={roomID} />;
}
