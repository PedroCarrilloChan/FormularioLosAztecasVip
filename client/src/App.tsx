import { Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";

// Páginas de la aplicación
import Home from "@/pages/Home";
import ThankYou from "@/pages/ThankYou";

// Componente de carga mientras se cargan las páginas
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-[#f8c04b] via-[#fbdea3] to-[#faebcf]">
    <div className="flex flex-col items-center justify-center space-y-4 text-[#d94214]">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#d94214]"></div>
      <p className="text-lg font-medium">Cargando...</p>
    </div>
  </div>
);

function App() {
  // Obtenemos la ruta actual de la URL
  const path = window.location.pathname;
  console.log('🔄 App inicializada - Ruta:', path);
  console.log('🔄 URL completa:', window.location.href);
  
  // Capturar el ID de la URL como parte del proceso de iniciación
  const urlParams = new URLSearchParams(window.location.search);
  const chatbotUserId = urlParams.get('id') || urlParams.get('userId') || '';
  console.log('🔄 ID detectado:', chatbotUserId);

  // Función para renderizar la página correcta basado en la ruta
  const renderPage = () => {
    // Si la ruta es /thank-you, mostramos la página de confirmación
    if (path === '/thank-you') {
      return <ThankYou />;
    }
    
    // Por defecto, mostramos la página principal (Home)
    return <Home />;
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<PageLoader />}>
        {renderPage()}
      </Suspense>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;