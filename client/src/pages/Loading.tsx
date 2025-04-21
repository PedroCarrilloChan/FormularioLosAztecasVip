import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { detectDevice } from "@/lib/utils";

export default function Loading() {
  const [, navigate] = useLocation();
  const [progress, setProgress] = useState(0);
  const [deviceDetected, setDeviceDetected] = useState<'ios' | 'android' | 'desktop' | null>(null);

  // Detectar dispositivo inmediatamente
  useEffect(() => {
    // Realizamos detección inmediata para evitar retrasos
    const deviceType = detectDevice();
    setDeviceDetected(deviceType);
    
    // Reducimos el tiempo de espera a 3 segundos
    const redirectTime = 3000;
    const interval = 30; // Actualizar cada 30ms
    const steps = redirectTime / interval;
    
    // Incrementar progreso gradualmente para dar feedback visual
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / steps);
        return newProgress > 100 ? 100 : newProgress;
      });
    }, interval);
    
    // Temporizador de redirección
    const timer = setTimeout(() => {
      // Redirigir según el tipo de dispositivo
      if (deviceType === 'ios') {
        navigate('/iphone-install');
      } else if (deviceType === 'android') {
        navigate('/android-install');
      } else {
        // Si es desktop, mostrar la página de selección
        navigate('/thank-you');
      }
    }, redirectTime);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  // Mensaje personalizado basado en el dispositivo detectado
  const getMessage = () => {
    if (!deviceDetected) return "Detectando su dispositivo...";
    
    switch(deviceDetected) {
      case 'ios':
        return "Preparando configuración para iPhone...";
      case 'android':
        return "Preparando configuración para Android...";
      default:
        return "Preparando configuración para su dispositivo...";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Fondo simplificado para mejor rendimiento */}
      <div className="absolute inset-0 w-full h-full z-0 bg-gradient-to-br from-blue-900 via-indigo-700 to-blue-900 overflow-hidden">
        {/* Elementos decorativos flotantes reducidos en móviles */}
        <div className="hidden md:block absolute top-1/4 left-1/5 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-blue-400/20 backdrop-blur-3xl animate-float" style={{animationDelay: '0s'}}></div>
        <div className="hidden md:block absolute bottom-1/4 right-1/5 w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-indigo-500/20 backdrop-blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Contenido centrado */}
      <div className="z-10 flex flex-col items-center justify-center px-4 text-center">
        {/* Tarjeta con efecto glassmorphism */}
        <div className="glass-card p-6 sm:p-8 rounded-xl sm:rounded-2xl backdrop-blur-md bg-white/15 border border-white/20 shadow-xl">
          {/* Icono de carga */}
          <div>
            <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 animate-spin text-white" />
          </div>
          
          {/* Mensajes con información personalizada */}
          <h2 className="mt-5 text-lg sm:text-xl font-medium text-white">
            {getMessage()}
          </h2>
          
          {/* Barra de progreso */}
          <div className="mt-6 w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#0A85FF] to-[#10A852] h-full transition-all duration-100 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="mt-2 text-sm text-white/80">
            {progress.toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  );
}