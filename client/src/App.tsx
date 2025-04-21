import { Switch, Route, useLocation } from "wouter";
import { lazy, Suspense, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { detectDevice } from "./lib/utils";

// Importar Home directamente para cargarlo de inmediato
import Home from "@/pages/Home";

// Cargar páginas secundarias de manera diferida
const Loading = lazy(() => import("@/pages/Loading"));
const ThankYou = lazy(() => import("@/pages/ThankYou"));
const IphoneInstall = lazy(() => import("@/pages/IphoneInstall"));
const AndroidInstall = lazy(() => import("@/pages/AndroidInstall"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Componente de carga mientras se cargan los componentes lazy
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-700 to-blue-900">
    <div className="flex flex-col items-center justify-center space-y-4 text-white">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
      <p className="text-lg font-medium">Cargando...</p>
    </div>
  </div>
);

function Router() {
  const [location] = useLocation();

  // Precarga las rutas relacionadas cuando se está en la ruta principal
  useEffect(() => {
    if (location === "/") {
      // Precargamos la página de carga que es la siguiente más probable
      const preloadLoading = import("@/pages/Loading");
      
      // En segundo plano y con menos prioridad, detectamos tipo de dispositivo
      // para precargar la página de instalación correspondiente
      setTimeout(() => {
        const device = detectDevice();
        if (device === 'ios') {
          import("@/pages/IphoneInstall");
        } else if (device === 'android') {
          import("@/pages/AndroidInstall");
        }
      }, 2000);
    }
  }, [location]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/loading" component={Loading} />
        <Route path="/thank-you" component={ThankYou} />
        <Route path="/iphone-install" component={IphoneInstall} />
        <Route path="/android-install" component={AndroidInstall} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;