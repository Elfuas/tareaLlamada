"use client";
import { useEffect, useRef, useState, use } from 'react';
import { Peer } from 'peerjs';
import Pusher from 'pusher-js';
import { Video, VideoOff, LogOut, UserCheck } from 'lucide-react';

interface Participant {
  uid: string;
  stream: MediaStream;
}

export default function SimpleCallPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  
  // Nombres de estado cambiados
  const [userStream, setUserStream] = useState<MediaStream | null>(null);
  const [others, setOthers] = useState<Participant[]>([]);
  const myVideoRef = useRef<HTMLVideoElement>(null);

  const [alias, setAlias] = useState("");
  const [isReady, setIsReady] = useState(false);
  
  const peerRef = useRef<Peer | null>(null);

  useEffect(() => {
    if (!isReady) return;

    let p: Peer;
    // Configuración de Pusher con tus credenciales
    const pusherClient = new Pusher("9d0e9b3af88776172408", { cluster: "us2" });
    const channel = pusherClient.subscribe(`room-${roomId}`);

    const startMedia = async () => {
      try {
        const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setUserStream(media);
        if (myVideoRef.current) myVideoRef.current.srcObject = media;

        // Servidores STUN para redes
        p = new Peer({ config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] } });
        peerRef.current = p;

        p.on('open', (id) => {
          // Registro en la API simplificada
          fetch('/api/room', {
            method: 'POST',
            body: JSON.stringify({ roomId, peerId: id, userName: alias })
          });
        });

        // Detectar entrada de otros
        channel.bind('user-joined', (data: { peerId: string }) => {
          if (data.peerId !== p.id) {
            const call = p.call(data.peerId, media);
            call.on('stream', (incoming) => {
              setOthers(prev => [...prev.filter(c => c.uid !== data.peerId), { uid: data.peerId, stream: incoming }]);
            });
          }
        });

        // Responder llamadas
        p.on('call', (call) => {
          call.answer(media);
          call.on('stream', (incoming) => {
            setOthers(prev => [...prev.filter(c => c.uid !== call.peer), { uid: call.peer, stream: incoming }]);
          });
        });

      } catch (err) {
        console.error("Error de periféricos", err);
      }
    };

    startMedia();
    return () => { 
      p?.destroy(); 
      pusherClient.disconnect(); 
    };
  }, [isReady]);

  // Pantalla de Lobby (Acceso)
  if (!isReady) {
    return (
      <div className="h-screen bg-zinc-900 flex items-center justify-center p-6 font-sans">
        <div className="bg-zinc-800 border border-zinc-700 p-8 rounded-xl w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6 text-amber-500">
            <UserCheck size={28} />
            <h2 className="text-xl font-semibold text-white">Nueva Llamada</h2>
          </div>
          <p className="text-zinc-400 text-sm mb-4">Ingresa tu nombre para comenzar la sesión de video.</p>
          <input 
            className="w-full bg-zinc-900 border border-zinc-600 p-3 rounded text-white mb-6 focus:border-amber-500 outline-none transition-colors"
            placeholder="Nombre..."
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
          />
          <button 
            onClick={() => alias.trim() && setIsReady(true)}
            className="w-full bg-amber-600 p-3 rounded font-bold text-white hover:bg-amber-500 transition-colors shadow-lg"
          >
            Unirse a la sala
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-zinc-950 flex flex-col p-4 gap-4">
      {/* Contenedor de Videos */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
        {/* Video Local */}
        <div className="relative bg-zinc-900 rounded-lg overflow-hidden ring-1 ring-amber-500/30 shadow-xl aspect-video">
          <video ref={myVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-3 left-3 bg-amber-600 px-2 py-1 rounded text-[10px] font-black text-white uppercase tracking-tighter">
            PROPIO: {alias}
          </div>
        </div>

        {/* Videos Remotos */}
        {others.map((participant) => (
          <div key={participant.uid} className="relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 aspect-video">
            <video 
              autoPlay 
              playsInline 
              ref={(el) => { if (el) el.srcObject = participant.stream; }} 
              className="w-full h-full object-cover" 
            />
          </div>
        ))}
      </div>

      {/* Barra de Herramientas Inferior */}
      <div className="h-20 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center px-8">
        <button 
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-6 py-2 rounded-full text-white font-bold transition-all"
        >
          <LogOut size={20} /> Terminar Sesión
        </button>
      </div>
    </div>
  );
}