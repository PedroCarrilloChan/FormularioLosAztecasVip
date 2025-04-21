import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { registrationSchema } from "@/lib/validation";
import type { RegistrationData } from "@/lib/validation";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { config } from "@/config";
import { detectDevice } from "@/lib/utils";

export default function Home() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: ""
    }
  });

  async function onSubmit(data: RegistrationData) {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          phone: data.phone.startsWith('+') ? data.phone : `+${data.phone}`
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error en el registro');
      }

      // Redirigir a la página de carga
      navigate('/loading');

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Error en el registro. Por favor intente nuevamente."
      });
    }
  }

  return (
    <div className="min-h-screen w-full relative flex flex-col">
      {/* Fondo dinámico con diseño de glassmorphism - Optimizado para móviles */}
      <div className="absolute inset-0 w-full h-full z-0 bg-gradient-to-br from-blue-900 via-indigo-700 to-blue-900 overflow-hidden">
        {/* Elementos decorativos flotantes - Solo visibles en dispositivos más potentes */}
        <div className="hidden md:block absolute top-1/4 left-1/5 w-64 h-64 rounded-full bg-blue-400/20 backdrop-blur-3xl animate-float" style={{animationDelay: '0s'}}></div>
        <div className="hidden md:block absolute top-2/3 right-1/4 w-96 h-96 rounded-full bg-indigo-500/20 backdrop-blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="hidden md:block absolute bottom-1/3 left-1/3 w-72 h-72 rounded-full bg-purple-500/20 backdrop-blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        
        {/* Versión más simple para móviles */}
        <div className="md:hidden absolute top-1/4 left-1/5 w-32 h-32 rounded-full bg-blue-400/20 animate-float" style={{animationDelay: '0s'}}></div>
        <div className="md:hidden absolute bottom-1/4 right-1/5 w-40 h-40 rounded-full bg-indigo-500/20 animate-float" style={{animationDelay: '1s'}}></div>
        
        {/* Patrón de grid superpuesto */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-800/20 to-transparent mix-blend-overlay"></div>
        
        {/* Capa de difuminado para crear efecto glassmorfismo - Menos intenso en móviles */}
        <div className="absolute inset-0 backdrop-blur-[1px] md:backdrop-blur-[2px]"></div>
      </div>

      {/* Header con logo y título - Mejorado para responsividad */}
      <div className="relative z-10 w-full overflow-hidden py-6 sm:py-8 md:pt-12 md:pb-8">
        <div className="container mx-auto flex flex-col items-center justify-center px-4">
          {/* Logo con sombra - Tamaño adaptativo */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full glass-card p-2 animate-float shadow-2xl mb-4 sm:mb-6 md:mb-8">
            <img
              src={config.branding.logoUrl || "https://via.placeholder.com/200"}
              alt={config.branding.name}
              className="w-full h-full rounded-full object-cover"
              loading="eager"
              fetchPriority="high"
              width="144" 
              height="144"
            />
          </div>
          
          {/* Título con tipografía mejorada - Responsivo */}
          <div className="text-center space-y-2 sm:space-y-4 w-full max-w-4xl px-2 sm:px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              <span className="block sm:inline text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">Smart</span>{" "}
              <span className="block sm:inline text-[#10A852] drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">Passes</span>{" "}
              <span className="block sm:inline text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">-</span>{" "}
              <span className="block sm:inline text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">Un Método Directo</span>{" "}
              <span className="block sm:inline text-[#0A85FF] drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">para Tarjetas Digitales</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white font-medium max-w-2xl mx-auto mt-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
              Programas de Lealtad y ¡Mucho Más!
            </p>
          </div>
        </div>
      </div>

      {/* Formulario con efecto glassmorphism - Mejorado para responsividad */}
      <div className="relative z-10 flex-1 container max-w-lg mx-auto px-4 py-6 sm:py-8">
        <Card className="glass-card w-full backdrop-blur-xl bg-white/15 border border-white/20 shadow-2xl 
                        transform hover:shadow-2xl transition-all duration-300 rounded-xl sm:rounded-2xl">
          <CardHeader className="text-center p-4 sm:pb-2">
            <CardTitle className="text-xl sm:text-2xl font-bold text-white">Registro</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-white text-sm sm:text-base">Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan" {...field} className="h-10 sm:h-11 bg-white/40 backdrop-blur-md shadow-sm text-blue-900 font-medium" />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm font-medium text-red-300" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-white text-sm sm:text-base">Apellido</FormLabel>
                      <FormControl>
                        <Input placeholder="Pérez" {...field} className="h-10 sm:h-11 bg-white/40 backdrop-blur-md shadow-sm text-blue-900 font-medium" />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm font-medium text-red-300" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-white text-sm sm:text-base">Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="juan@ejemplo.com"
                          {...field}
                          className="h-10 sm:h-11 bg-white/40 backdrop-blur-md shadow-sm text-blue-900 font-medium"
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm font-medium text-red-300" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-white text-sm sm:text-base">Número de Teléfono</FormLabel>
                      <FormControl>
                        <PhoneInput
                          country={'mx'}
                          preferredCountries={['mx', 'us']}
                          enableSearch={true}
                          value={value}
                          onChange={(phone) => onChange(`+${phone}`)}
                          inputClass="w-full p-2 rounded-md border border-white/30 bg-white/40 backdrop-blur-md text-blue-900 font-medium h-10 sm:h-11 shadow-sm"
                          containerClass="phone-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm font-medium text-red-300" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-11 sm:h-12 text-base sm:text-lg font-medium bg-gradient-to-r from-[#0A85FF] to-[#10A852] hover:shadow-lg
                             hover:shadow-[#0A85FF]/30 transform hover:scale-[1.02] transition-all duration-300 mt-2"
                >
                  Registrarse
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}