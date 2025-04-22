import { Switch, Route, Router as WouterRouter } from "wouter";
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

// Crear una base personalizada para el router que maneje correctamente los parámetros de la URL
const RouterBase = (props: any) => {
  // Esto asegura que los parámetros de la URL se mantengan al navegar
  const makePublicUrl = (path: string) => {
    const url = new URL(path, window.location.href);
    // Conservar los parámetros de URL actuales (como id)
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.forEach((value, key) => {
      if (key === 'id' || key === 'userId' || key === 'user') {
        url.searchParams.set(key, value);
      }
    });
    
    return url.pathname + url.search;
  };

  return <WouterRouter base={''} makeUrl={makePublicUrl} {...props} />;
};

function AppRouter() {
  return (
    <RouterBase>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/thank-you" component={ThankYou} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </RouterBase>
  );
}

function App() {
  // Registrar la URL actual para depuración
  console.log('🔄 App inicializada - URL:', window.location.href);
  console.log('🔄 Parámetros URL:', Object.fromEntries(new URLSearchParams(window.location.search).entries()));
  
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;