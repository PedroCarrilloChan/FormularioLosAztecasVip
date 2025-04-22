import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { config } from "@/config";
import { userApi } from "@/lib/api";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function ThankYou() {
  const [, navigate] = useLocation();
  const [dataConfirmed, setDataConfirmed] = useState(false);

  // Obtener los datos del usuario registrado
  const { data: userData, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/user-data'],
    queryFn: userApi.getUserData,
    retry: 3,
    retryDelay: 1000
  });

  const handleConfirmData = async () => {
    try {
      // Mostrar el estado de confirmación inmediatamente para mejor UX
      setDataConfirmed(true);
      
      // Si tenemos un ID de chatbot, enviar la confirmación a la API
      if (userData?.chatbotUserId) {
        console.log(`Enviando confirmación para usuario: ${userData.chatbotUserId}`);
        const result = await userApi.confirmData();
        
        if (result.success) {
          console.log('Datos confirmados con éxito');
          
          // Esperar un breve tiempo para que el usuario vea el mensaje de confirmación
          // y luego cerrar la ventana
          setTimeout(() => {
            console.log('Cerrando ventana...');
            window.close();
            
            // Como respaldo, si window.close() no funciona (por políticas del navegador),
            // redirigir a una URL que pueda cerrar (ChatGPTBuilder u otra URL acordada)
            setTimeout(() => {
              // Si después de 300ms la ventana sigue abierta, intentamos redirigir
              window.location.href = "https://app.chatgptbuilder.io/close";
            }, 300);
          }, 1500); // 1.5 segundos para que el usuario vea la confirmación
        } else {
          console.error('Error al confirmar datos');
        }
      } else {
        console.warn('No hay ID de usuario de chatbot para confirmar');
      }
    } catch (error) {
      console.error('Error al confirmar datos:', error);
      // No revertimos el estado porque el usuario ya vio la confirmación
    }
  };

  const handleEditData = () => {
    // Redirigir al formulario de inicio
    navigate('/');
  };

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
          <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-32 sm:h-32 mx-auto mb-2 xs:mb-3 sm:mb-4">
            <img
              src={config.branding.logoUrl || "https://losaztecas.s3.us-east-1.amazonaws.com/Store+Card/Los+Aztecas+Transparent1.png"}
              alt={config.branding.name}
              className="w-full h-full object-contain drop-shadow-xl"
              loading="eager"
              width="80"
              height="80"
            />
          </div>
          
          {!dataConfirmed && (
            <>
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold">
                <span className="text-[#d94214] drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">¡Gracias!</span>
              </h1>
              <p className="text-sm xs:text-base sm:text-xl md:text-2xl text-[#592a16] font-medium max-w-md text-center drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
                Por favor verifica que tus datos sean correctos
              </p>
            </>
          )}
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
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#d94214]" />
              </div>
            ) : error || !userData ? (
              <div className="text-center py-4">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                <p className="text-[#592a16] font-medium">No se pudieron cargar tus datos. Por favor intenta nuevamente.</p>
                <Button 
                  className="mt-4 bg-[#d94214] hover:bg-[#c13a10] text-white"
                  onClick={() => refetch()}
                >
                  Reintentar
                </Button>
              </div>
            ) : (
              <>
                {!dataConfirmed ? (
                  <div className="bg-white/40 backdrop-blur-lg border border-white/50 p-4 sm:p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg sm:text-xl font-bold text-[#d94214] mb-4 text-center">
                      ¿Son estos datos correctos?
                    </h3>
                    
                    <div className="space-y-3">
                      <p className="text-[#592a16] font-medium">
                        <span className="font-bold">Nombre:</span> {userData.firstName} {userData.lastName}
                      </p>
                      <p className="text-[#592a16] font-medium">
                        <span className="font-bold">Email:</span> {userData.email}
                      </p>
                      <p className="text-[#592a16] font-medium">
                        <span className="font-bold">Teléfono:</span> {userData.phone}
                      </p>
                      <p className="text-[#592a16] font-medium">
                        <span className="font-bold">Fecha de cumpleaños:</span> {userData.birthMonth && userData.birthDay ? `${userData.birthMonth} ${userData.birthDay}` : 'No proporcionada'}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                      <Button 
                        className="flex-1 bg-[#2d8d47] hover:bg-[#236e38] text-white font-medium h-11 sm:h-12"
                        onClick={handleConfirmData}
                      >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Confirmar datos
                      </Button>
                      <Button 
                        className="flex-1 bg-[#d94214] hover:bg-[#c13a10] text-white font-medium h-11 sm:h-12"
                        onClick={handleEditData}
                      >
                        <XCircle className="mr-2 h-5 w-5" />
                        Corregir datos
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-green-50/50 backdrop-blur-md rounded-lg border border-green-100 relative">
                    <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
                    
                    {/* ID Elegant Badge */}
                    {userData.chatbotUserId && (
                      <div className="absolute bottom-1 right-1 bg-white/30 backdrop-blur-sm px-2 py-0.5 rounded-full border border-green-200/50 text-[10px] text-green-800/70 font-mono tracking-tight overflow-hidden">
                        ID: {userData.chatbotUserId}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            
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