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
  <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-700 to-blue-900">
    <div className="flex flex-col items-center justify-center space-y-4 text-white">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
      <p className="text-lg font-medium">Cargando...</p>
    </div>
  </div>
);

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/thank-you" component={ThankYou} />
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