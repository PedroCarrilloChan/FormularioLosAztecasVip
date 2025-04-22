import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { config } from "@/config";
import { userApi } from "@/lib/api";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";

export default function ThankYou() {
  const [, navigate] = useLocation();
  const [dataConfirmed, setDataConfirmed] = useState(false);
  const [closing, setClosing] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);

  // Obtener los datos del usuario registrado
  const { data: userData, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/user-data'],
    queryFn: userApi.getUserData,
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
  }, [dataConfirmed]); // Se ejecuta cuando cambia dataConfirmed
  
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

  const handleConfirmData = () => {
    console.log('🎯 BOTÓN CONFIRMAR PRESIONADO');
    
    // Primero mostramos la confirmación visual
    setDataConfirmed(true);
    
    // Después de un momento, iniciamos la animación de cierre
    setTimeout(() => {
      console.log('⭐ Iniciando animación de cierre...');
      setClosing(true);
    }, 1200);
  };

  const handleEditData = () => {
    navigate('/');
  };

  return (
    <div ref={mainRef} className="min-h-screen w-full relative flex flex-col">
      {/* Background simplificado */}
      <div className="absolute inset-0 w-full h-full z-0 bg-gradient-to-br from-[#f8c04b] via-[#fbdea3] to-[#faebcf] overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-[1px]"></div>
      </div>

      {/* Contenido principal correctamente espaciado */}
      <div className="flex-1 container max-w-md mx-auto px-4 py-6 z-20 flex flex-col items-center justify-center">
        {/* Logo con tamaño ajustado */}
        <div className="w-24 h-24 mx-auto mb-4 mt-6">
          <img
            src={config.branding.logoUrl || "https://losaztecas.s3.us-east-1.amazonaws.com/Store+Card/Los+Aztecas+Transparent1.png"}
            alt={config.branding.name}
            className="w-full h-full object-contain drop-shadow-md"
            loading="eager"
            width="96"
            height="96"
          />
        </div>
        
        <Card ref={cardRef} className="bg-white/60 backdrop-blur-md border border-white/40 w-full shadow-md rounded-xl transition-all duration-700">
          <CardContent className="p-4 space-y-4 relative">
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
              <>
                {!dataConfirmed ? (
                  <div className="space-y-4">
                    <h3 className="text-base font-medium text-[#d94214] text-center">
                      ¿Son estos datos correctos?
                    </h3>
                    
                    <div className="space-y-2 bg-white/50 p-3 rounded-lg">
                      <p className="text-[#592a16] text-sm">
                        <span className="font-medium">Nombre:</span> {userData.firstName} {userData.lastName}
                      </p>
                      <p className="text-[#592a16] text-sm">
                        <span className="font-medium">Email:</span> {userData.email}
                      </p>
                      <p className="text-[#592a16] text-sm">
                        <span className="font-medium">Teléfono:</span> {userData.phone}
                      </p>
                      <p className="text-[#592a16] text-sm">
                        <span className="font-medium">Cumpleaños:</span> {userData.birthMonth && userData.birthDay ? `${userData.birthMonth} ${userData.birthDay}` : 'No proporcionado'}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button 
                        className="w-full bg-[#2d8d47] hover:bg-[#236e38] text-white text-sm h-10"
                        onClick={handleConfirmData}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Confirmar
                      </Button>
                      <Button 
                        className="w-full bg-[#d94214] hover:bg-[#c13a10] text-white text-sm h-10"
                        onClick={handleEditData}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Corregir
                      </Button>
                    </div>
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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}