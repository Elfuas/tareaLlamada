"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, ChevronRight, Activity, Lock } from 'lucide-react';

export default function Home() {
  const [targetRoom, setTargetRoom] = useState("");
  const router = useRouter();

  const onEnterRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetRoom.trim()) {
      // Redirección simple a la sala
      router.push(`/room/${targetRoom.trim().toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-8 font-mono">
      {/* Fondo con luces decorativas en tonos ambar/naranja */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[20%] right-[10%] w-[35%] h-[35%] bg-amber-900/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[20%] left-[5%] w-[30%] h-[30%] bg-zinc-800/20 blur-[80px] rounded-full"></div>
      </div>

      <main className="w-full max-w-sm">
        {/* Icono Principal Diferente */}
        <div className="flex justify-center mb-10">
          <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-full shadow-2xl">
            <Camera size={40} className="text-amber-500" />
          </div>
        </div>

        {/* Título y descripción con otros nombres */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-light mb-3">
            Portal<span className="text-amber-600 font-bold">Stream</span>
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Módulo de videoconferencia P2P para laboratorios de telemática.
          </p>
        </div>

        <form onSubmit={onEnterRoom} className="space-y-6">
          <div className="group">
            <label className="text-[10px] uppercase tracking-widest text-zinc-600 ml-1 mb-2 block">
              Identificador de sesión
            </label>
            <input
              type="text"
              placeholder="id-de-la-sala"
              className="w-full bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg text-white placeholder:text-zinc-700 focus:border-amber-600 outline-none transition-all"
              value={targetRoom}
              onChange={(e) => setTargetRoom(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-bold py-4 rounded-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl"
          >
            Acceder al Canal
            <ChevronRight size={18} />
          </button>
        </form>

        {/* Características Técnicas (Cambiadas) */}
        <div className="mt-16 flex flex-col gap-4">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/30 border border-zinc-900">
            <Activity size={18} className="text-amber-500 mt-1" />
            <div>
              <h4 className="text-xs font-bold text-zinc-300">Tiempo Real</h4>
              <p className="text-[10px] text-zinc-500">Arquitectura de baja demora vía UDP.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/30 border border-zinc-900">
            <Lock size={18} className="text-zinc-500 mt-1" />
            <div>
              <h4 className="text-xs font-bold text-zinc-300">P2P Encrypted</h4>
              <p className="text-[10px] text-zinc-500">Transmisión de medios cifrada.</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="mt-12 text-[10px] text-zinc-700 tracking-tighter uppercase">
        Laboratorio de Redes - 2026
      </footer>
    </div>
  );
}