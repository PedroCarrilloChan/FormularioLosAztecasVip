import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { loyaltyApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function AndroidInstall() {
  const { toast } = useToast();
  const [androidUrl, setAndroidUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const { data: loyaltyData, isLoading: isDataLoading } = useQuery({
    queryKey: ["/api/loyalty-data"],
    queryFn: loyaltyApi.getLoyaltyData,
    retry: false
  });

  useEffect(() => {
    const processUrl = async () => {
      if (!loyaltyData?.card?.url) {
        setError("No se encontró la URL de la tarjeta");
        return;
      }

      setIsProcessing(true);
      setError(null);
      try {
        console.log('Procesando URL para Android:', loyaltyData.card.url);

        // Primero modificamos la URL original
        const modifiedUrl = await loyaltyApi.getModifiedUrl(loyaltyData.card.url);
        console.log('URL modificada:', modifiedUrl);

        // Luego generamos el link especial para Android
        const androidLink = await loyaltyApi.getAndroidInstallLink(modifiedUrl);
        console.log('Link para Android generado:', androidLink);

        setAndroidUrl(androidLink);
        setRetryCount(0); // Resetear el contador de intentos si es exitoso
      } catch (error) {
        console.error('Failed to process Android URL:', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : "Error al procesar la URL de instalación";

        setError(errorMessage);
        toast({
          variant: "destructive",
          title: `Error (Intento ${retryCount + 1})`,
          description: errorMessage
        });
      } finally {
        setIsProcessing(false);
      }
    };

    if (loyaltyData && !androidUrl && !isProcessing) {
      processUrl();
    }
  }, [loyaltyData, androidUrl, toast, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setAndroidUrl(""); // Esto provocará que useEffect intente procesar la URL nuevamente
  };

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6 space-y-6">
          <h1 className="text-2xl font-bold text-center">
            Genial {loyaltyData?.firstName},
          </h1>

          <p className="text-center">
            ¡Por favor, sigue estos 2 sencillos pasos para agregar tu tarjeta VIP a la app Wallet!
          </p>

          <div className="bg-primary/5 p-4 rounded-lg space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="font-semibold">Paso 1:</p>
                <p>Clic en el botón azul que dice "instalar" como se muestra en la imagen:</p>
                <img
                  src="/path/to/android-step1.png"
                  alt="Paso 1 instalación Android"
                  className="rounded-lg mx-auto"
                />
              </div>

              <div className="space-y-2">
                <p className="font-semibold">Paso 2:</p>
                <p>Clic en el botón azul que dice "continuar" como se muestra en la imagen:</p>
                <img
                  src="/path/to/android-step2.png"
                  alt="Paso 2 instalación Android"
                  className="rounded-lg mx-auto"
                />
              </div>
            </div>
          </div>

          <p className="text-center">
            ¡Para iniciar la instalación, simplemente haz clic en el botón de abajo! 👇
          </p>

          {error ? (
            <div className="space-y-4">
              <p className="text-sm text-destructive text-center">
                {error}
              </p>
              <Button 
                className="w-full"
                onClick={handleRetry}
              >
                Intentar nuevamente
              </Button>
            </div>
          ) : (
            <Button 
              className="w-full"
              disabled={isProcessing || !androidUrl}
              onClick={() => androidUrl && window.open(androidUrl, '_blank')}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Obtener mi tarjeta"
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}