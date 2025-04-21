import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiAndroid, SiApple } from "react-icons/si";
import { config } from "@/config";
import { detectDevice } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export default function ThankYou() {
  const [, navigate] = useLocation();
  const deviceType = detectDevice();
  const isDesktop = deviceType === 'desktop';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8c04b] via-[#fbdea3] to-[#faebcf] relative">
      {/* Patrón mexicano de fondo para toda la página */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBoLTQweiIvPjxwYXRoIGQ9Ik0yMCAwdjQwTTAgMjBoNDAiIHN0cm9rZT0icmdiYSgyMTcsMzYsNDQsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-30 pointer-events-none"></div>
      
      {/* Elementos decorativos para toda la página */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-64 h-64 rounded-full bg-[#d94214]/10 animate-float" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-1/4 right-1/5 w-80 h-80 rounded-full bg-[#2d8d47]/10 animate-float" style={{animationDelay: '1.2s'}}></div>
        <div className="absolute top-3/4 left-1/3 w-72 h-72 rounded-full bg-[#f0ad4e]/20 animate-float" style={{animationDelay: '2.5s'}}></div>
      </div>
      
      {/* Header con los colores de Los Aztecas */}
      <div className="h-[30vh] sm:h-[35vh] md:h-[40vh] w-full relative overflow-hidden z-10">
        
        {/* Texto central con animación - Responsivo */}
        <div className="absolute inset-0 flex items-center justify-center flex-col px-4 space-y-2 sm:space-y-4">
          {/* Logo */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 p-2 mx-auto mb-4 bg-white/90 backdrop-blur-md rounded-xl shadow-lg">
            <img
              src={config.branding.logoUrl || "https://losaztecas.s3.us-east-1.amazonaws.com/Store+Card/Los+Aztecas+Transparent1.png"}
              alt={config.branding.name}
              className="w-full h-full object-contain"
              loading="eager"
            />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold">
            <span className="text-[#d94214] drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">¡Gracias!</span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-[#592a16] font-medium max-w-md text-center drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
            Tu registro ha sido completado exitosamente
          </p>
        </div>
      </div>

      {/* Contenido principal - Mejorado para responsividad */}
      <div className="flex-1 container max-w-2xl mx-auto px-4 py-6 sm:py-8 md:py-12 z-20">
        <Card className="bg-white/30 backdrop-blur-xl border border-white/40 w-full transform transition-all duration-300 shadow-xl relative overflow-hidden rounded-2xl before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/40 before:to-transparent before:opacity-50 before:z-0">
          <CardHeader className="text-center p-4 pb-2 relative z-10">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold">
              <span className="text-[#d94214] drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">Los Aztecas</span>
              <span className="text-[#2d8d47] drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]"> VIP</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-4 space-y-4 sm:space-y-6 md:space-y-8 relative z-10">
            {isDesktop && (
              <div className="bg-white/40 backdrop-blur-lg border border-white/50 p-3 sm:p-4 rounded-lg shadow-sm">
                <div className="flex items-start sm:items-center">
                  <AlertCircle className="h-5 w-5 text-[#d94214] mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <p className="text-xs sm:text-sm text-[#592a16] font-bold">
                    Recuerda que las tarjetas digitales son únicamente para dispositivos móviles. Por favor, accede desde tu teléfono Android o iPhone para completar la instalación.
                  </p>
                </div>
              </div>
            )}

            <p className="text-base sm:text-lg text-center text-[#592a16] font-bold drop-shadow-sm">
              Descarga nuestra tarjeta digital para comenzar a disfrutar de tus beneficios exclusivos como miembro VIP
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center py-2 sm:py-4">
              <Button 
                className="flex-1 max-w-xs mx-auto h-14 sm:h-16 text-base sm:text-lg font-medium transition-all duration-300 
                           hover:scale-105 active:scale-95 shadow-lg bg-gradient-to-r from-[#d94214] to-[#e05726] text-white 
                           border border-white/20 hover:from-[#c13a10] hover:to-[#d94214] backdrop-blur-md" 
                onClick={() => navigate('/android-install')}
              >
                <SiAndroid className="mr-2 sm:mr-3 h-6 sm:h-7 w-6 sm:w-7" />
                Android
              </Button>
              <Button 
                className="flex-1 max-w-xs mx-auto h-14 sm:h-16 text-base sm:text-lg font-medium transition-all duration-300 
                           hover:scale-105 active:scale-95 shadow-lg bg-gradient-to-r from-[#d94214] to-[#e05726] text-white 
                           border border-white/20 hover:from-[#c13a10] hover:to-[#d94214] backdrop-blur-md" 
                onClick={() => navigate('/iphone-install')}
              >
                <SiApple className="mr-2 sm:mr-3 h-6 sm:h-7 w-6 sm:w-7" />
                iPhone
              </Button>
            </div>

            {config.branding.bottomImageUrl && (
              <div className="mt-4 sm:mt-6 md:mt-8">
                <div className="p-1 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl">
                  <img
                    src={config.branding.bottomImageUrl}
                    alt="Imagen promocional"
                    className="max-w-full mx-auto rounded-md sm:rounded-lg shadow-inner"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}