import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
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
      
      // Verificar que tenemos datos de usuario
      if (userData) {
        console.log(`Enviando datos a ChatGPTBuilder para: ${userData.firstName} ${userData.lastName}`);
        
        try {
          // Enviar los datos directamente a ChatGPTBuilder API para actualizar el usuario existente
          const result = await userApi.sendToChatGPTBuilder(userData);
          
          if (result.success) {
            console.log('Datos enviados correctamente para actualizar el usuario en ChatGPTBuilder');
            
            // También enviamos la confirmación a nuestro backend para registrar la actualización
            try {
              await userApi.confirmData();
            } catch (backendError) {
              console.warn('Error al confirmar datos en backend, pero los datos se enviaron a ChatGPTBuilder:', backendError);
            }
            
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
            console.error('Error al enviar datos a ChatGPTBuilder');
          }
        } catch (apiError) {
          console.error('Error al enviar datos a ChatGPTBuilder:', apiError);
          // Mantenemos el estado de confirmación para no confundir al usuario
          // ya que visualmente ya se mostró la confirmación
        }
      } else {
        console.error('No hay datos de usuario para enviar');
      }
    } catch (error) {
      console.error('Error general en el proceso de confirmación:', error);
    }
  };

  const handleEditData = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col">
      {/* Background simplificado */}
      <div className="absolute inset-0 w-full h-full z-0 bg-gradient-to-br from-[#f8c04b] via-[#fbdea3] to-[#faebcf] overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-[1px]"></div>
      </div>

      {/* Contenido principal simplificado */}
      <div className="flex-1 container max-w-md mx-auto px-4 py-8 z-20 flex flex-col items-center justify-center">
        {/* Logo más abajo */}
        <div className="w-24 h-24 mx-auto mb-4 mt-12">
          <img
            src={config.branding.logoUrl || "https://losaztecas.s3.us-east-1.amazonaws.com/Store+Card/Los+Aztecas+Transparent1.png"}
            alt={config.branding.name}
            className="w-full h-full object-contain drop-shadow-md"
            loading="eager"
            width="96"
            height="96"
          />
        </div>
        
        <Card className="bg-white/60 backdrop-blur-md border border-white/40 w-full shadow-md rounded-xl">
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