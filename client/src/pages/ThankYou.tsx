import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { config } from '@/config';

export default function ThankYou() {
  const [location] = useLocation();
  const [closing, setClosing] = useState(false);
  
  // Referencias para la animación
  const cardRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  
  // Extraer ID del parámetro
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || '';
  
  const { data: userData, isLoading, error, refetch } = useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      const res = await fetch('/api/user-data');
      if (!res.ok) throw new Error('Error loading user data');
      return res.json();
    },
    retry: 3,
    retryDelay: 1000
  });
  
  // Guardar la altura original del elemento
  useEffect(() => {
    if (cardRef.current) {
      // Guardamos la altura original en un atributo data-
      const height = cardRef.current.getBoundingClientRect().height;
      cardRef.current.style.maxHeight = `${height}px`;
      cardRef.current.setAttribute('data-original-height', `${height}`);
    }
  }, [userData]); // Se ejecuta cuando llegan los datos
  
  // Efecto para animar el cierre
  useEffect(() => {
    if (closing && cardRef.current && mainRef.current) {
      // Aseguramos que la tarjeta tenga su altura original al inicio
      const originalHeight = cardRef.current.getAttribute('data-original-height') || '300';
      cardRef.current.style.maxHeight = `${originalHeight}px`;
      
      // Pequeño retraso antes de comenzar la animación
      setTimeout(() => {
        // Animar el cierre del card como un acordeón vertical
        cardRef.current!.style.transition = "all 0.9s ease";
        cardRef.current!.style.maxHeight = "0px";
        cardRef.current!.style.margin = "0";
        cardRef.current!.style.padding = "0";
        cardRef.current!.style.overflow = "hidden";
        cardRef.current!.style.opacity = "0";
        
        // Animar también el contenedor principal reduciéndolo verticalmente
        setTimeout(() => {
          if (mainRef.current) {
            mainRef.current.style.transition = "all 0.7s ease";
            mainRef.current.style.maxHeight = "0px";
            mainRef.current.style.overflow = "hidden";
            mainRef.current.style.opacity = "0";
            
            // Después de la animación, dejar una página en blanco sin 'File not found'
            setTimeout(() => {
              // Remover todos los elementos de la página para una página blanca limpia
              document.body.innerHTML = "";
              document.body.style.backgroundColor = "white";
            }, 800);
          }
        }, 300);
      }, 100);
    }
  }, [closing]);

  // Iniciar animación de cierre automáticamente después de mostrar la palomita
  useEffect(() => {
    if (userData && !isLoading && !error) {
      // Después de un momento, iniciamos la animación de cierre
      const timer = setTimeout(() => {
        console.log('⭐ Iniciando animación de cierre...');
        setClosing(true);
      }, 2000); // Esperar 2 segundos antes de cerrar
      
      return () => clearTimeout(timer);
    }
  }, [userData, isLoading, error]);

  return (
    <div ref={mainRef} className="min-h-screen w-full relative flex flex-col">
      {/* Background simplificado */}
      <div className="absolute inset-0 w-full h-full z-0 bg-gradient-to-br from-[#f8c04b] via-[#fbdea3] to-[#faebcf] overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-[1px]"></div>
      </div>

      {/* Contenido principal muy compacto */}
      <div className="flex-1 container max-w-md mx-auto px-2 py-1 z-20 flex flex-col items-center justify-center">
        {/* Logo pequeño */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 mt-2">
          <img
            src={config.branding.logoUrl || "https://losaztecas.s3.us-east-1.amazonaws.com/Store+Card/Los+Aztecas+Transparent1.png"}
            alt={config.branding.name}
            className="w-full h-full object-contain drop-shadow-md"
            loading="eager"
            width="64"
            height="64"
          />
        </div>
        
        <Card ref={cardRef} className="bg-white/60 backdrop-blur-md border border-white/40 w-full shadow-md rounded-xl transition-all duration-700">
          <CardContent className="p-3 space-y-2 relative">
            {isLoading ? (
              <div className="flex justify-center items-center py-6">
                <Loader2 className="h-8 w-8 animate-spin text-[#d94214]" />
              </div>
            ) : error || !userData ? (
              <div className="text-center py-4">
                <XCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
                <p className="text-[#592a16]">Error al cargar datos.</p>
                <Button 
                  className="mt-3 bg-[#d94214] hover:bg-[#c13a10] text-white"
                  onClick={() => refetch()}
                >
                  Reintentar
                </Button>
              </div>
            ) : (
              <div className="text-center py-6 bg-green-50/50 backdrop-blur-md rounded-lg border border-green-100 relative">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                
                {/* ID discreto */}
                {userData.chatbotUserId && (
                  <div className="text-center text-[8px] text-green-800/20 mt-3 font-mono">
                    ref:{userData.chatbotUserId}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}