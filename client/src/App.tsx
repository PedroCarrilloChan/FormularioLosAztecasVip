import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

// Importar Home directamente para cargarlo de inmediato
import Home from "@/pages/Home";

// Cargar páginas secundarias de manera diferida
const ThankYou = lazy(() => import("@/pages/ThankYou"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Componente de carga mientras se cargan los componentes lazy
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-[#f8c04b] via-[#fbdea3] to-[#faebcf]">
    <div className="flex flex-col items-center justify-center space-y-4 text-[#d94214]">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#d94214]"></div>
      <p className="text-lg font-medium">Cargando...</p>
    </div>
  </div>
);

// Función auxiliar para preservar parámetros de URL al navegar
const preserveParams = (to: string): string => {
  try {
    // Obtener los parámetros actuales
    const currentParams = new URLSearchParams(window.location.search);
    const chatbotId = currentParams.get('id') || currentParams.get('userId') || '';
    
    // Si hay un ID y estamos navegando a una ruta interna, lo añadimos
    if (chatbotId && !to.includes('://')) {
      // Si la URL destino ya tiene parámetros, añadimos el ID
      if (to.includes('?')) {
        return `${to}&id=${chatbotId}`;
      } else {
        return `${to}?id=${chatbotId}`;
      }
    }
    return to;
  } catch (error) {
    console.error('Error preservando parámetros:', error);
    return to;
  }
};

// Hook personalizado para uso en otros componentes
export const usePreserveParams = () => {
  return {
    preserveParams
  };
};

function App() {
  // Registrar la URL actual para depuración
  console.log('🔄 App inicializada - URL:', window.location.href);
  console.log('🔄 Parámetros URL:', Object.fromEntries(new URLSearchParams(window.location.search).entries()));
  
  // Interceptamos la navegación para preservar parámetros
  const originalPushState = window.history.pushState;
  if (!window.historyPatchApplied) {
    window.history.pushState = function(state, title, url) {
      // Si la URL es un string, tratamos de preservar los parámetros
      if (typeof url === 'string') {
        url = preserveParams(url);
      }
      return originalPushState.call(this, state, title, url);
    };
    window.historyPatchApplied = true;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/thank-you" component={ThankYou} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      <Toaster />
    </QueryClientProvider>
  );
}

// Añadir esta propiedad a Window para TypeScript
declare global {
  interface Window {
    historyPatchApplied?: boolean;
  }
}

export default App;