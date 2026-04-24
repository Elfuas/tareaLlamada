import { NextResponse } from 'next/server';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: "2145292",
  key: "9d0e9b3af88776172408",
  secret: "fc58688803210013e0a3",
  cluster: "us2",
  useTLS: true,
});

export async function POST(req: Request) {
  // Solo recibimos lo necesario para la conexión
  const { roomId, peerId, userName } = await req.json();

  // El evento es único para avisar presencia
  await pusher.trigger(`room-${roomId}`, 'user-joined', { 
    peerId, 
    userName 
  });

  return NextResponse.json({ status: "ok" });
}