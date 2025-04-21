import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { registrationSchema, months, days } from "@/lib/validation";
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
      phone: "",
      birthMonth: undefined,
      birthDay: undefined
    }
  });

  async function onSubmit(data: RegistrationData) {
    // Show immediate loading state for better mobile feedback
    const loadingToast = toast({
      title: "Processing...",
      description: "We are registering your information",
      duration: 10000, // Auto-closes after 10 seconds if there are issues
    });
    
    try {
      // Normalize phone
      const formattedPhone = data.phone.startsWith('+') ? data.phone : `+${data.phone}`;
      
      // Use AbortController for timeout on slow connections (improves mobile experience)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          phone: formattedPhone
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const result = await response.json();

      // Close loading toast
      loadingToast.dismiss();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Registration error');
      }

      // Redirect to loading page
      navigate('/loading');

    } catch (error) {
      // Close loading toast
      loadingToast.dismiss();
      
      // Mobile-optimized error messages (shorter and clearer)
      let errorMessage = "Registration error. Please try again.";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Connection is slow. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
    }
  }

  return (
    <div className="min-h-screen w-full relative flex flex-col">
      {/* Background optimized for Los Aztecas VIP */}
      <div className="absolute inset-0 w-full h-full z-0 bg-gradient-to-br from-[#f8c04b] via-[#fbdea3] to-[#faebcf] overflow-hidden">
        {/* Decorative elements - Only visible on more powerful devices */}
        <div className="hidden md:block absolute top-1/4 left-1/5 w-64 h-64 rounded-full bg-[#e94e24]/10 backdrop-blur-3xl animate-float" style={{animationDelay: '0s'}}></div>
        <div className="hidden md:block absolute top-2/3 right-1/4 w-96 h-96 rounded-full bg-[#2d8d47]/10 backdrop-blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="hidden md:block absolute bottom-1/3 left-1/3 w-72 h-72 rounded-full bg-[#da291c]/10 backdrop-blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        
        {/* Simpler version for mobile */}
        <div className="md:hidden absolute top-1/4 left-1/5 w-32 h-32 rounded-full bg-[#e94e24]/10 animate-float" style={{animationDelay: '0s'}}></div>
        <div className="md:hidden absolute bottom-1/4 right-1/5 w-40 h-40 rounded-full bg-[#2d8d47]/10 animate-float" style={{animationDelay: '1s'}}></div>
        
        {/* Mexican pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBoLTQweiIvPjxwYXRoIGQ9Ik0yMCAwdjQwTTAgMjBoNDAiIHN0cm9rZT0icmdiYSgyMTcsMzYsNDQsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        {/* Blur layer for glassmorphism effect - Less intense on mobile */}
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
          
          {/* Title with improved typography - Responsive */}
          <div className="text-center space-y-2 sm:space-y-4 w-full max-w-4xl px-2 sm:px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              <span className="block text-[#e94e24] drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">Los Aztecas VIP</span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-[#333] font-bold max-w-2xl mx-auto mt-2 drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
              Claim Your Free Rewards 🎉
            </p>
            
            {/* Rewards box */}
            <div className="mt-4 bg-white/80 backdrop-blur-sm border-2 border-dashed border-[#f0ad4e] rounded-xl p-4 sm:p-6 max-w-2xl mx-auto">
              <ul className="text-left space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-xl">🎁</span>
                  <div>
                    <span className="text-[#2d8d47] font-bold">FREE Small Cheese Dip</span>
                    <span className="text-gray-700"> – Just for joining!</span>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="text-xl">💵</span>
                  <div>
                    <span className="text-[#2d8d47] font-bold">$5</span>
                    <span className="text-gray-700"> for every friend you refer</span>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="text-xl">🎂</span>
                  <div>
                    <span className="text-[#2d8d47] font-bold">$10 Birthday Gift</span>
                    <span className="text-gray-700"> loaded to your VIP Pass – </span>
                    <span className="italic text-gray-700">a few days before your birthday</span>
                  </div>
                </li>
                
                <li className="flex items-start gap-3 pt-2 border-t border-[#f0ad4e]/30">
                  <div>
                    <span className="font-bold text-[#2d8d47]">PLUS:</span>
                    <span className="text-gray-700"> You could be the next </span>
                    <span className="font-bold text-[#2d8d47]">LUCKY WINNER</span>
                    <span className="text-gray-700"> to enjoy FREE food for a whole month </span>
                    <span className="text-xl">‼️</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Form with Mexican-themed colors */}
      <div className="relative z-10 flex-1 container max-w-lg mx-auto px-4 py-6 sm:py-8">
        <Card className="glass-card w-full backdrop-blur-xl bg-[#e94e24]/15 border border-[#f0ad4e]/40 shadow-2xl 
                        transform hover:shadow-2xl transition-all duration-300 rounded-xl sm:rounded-2xl">
          <CardHeader className="text-center p-4 sm:pb-2">
            <CardTitle className="text-xl sm:text-2xl font-bold text-[#e94e24]">Join Los Aztecas VIP</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-[#333] text-sm sm:text-base">First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} className="h-10 sm:h-11 bg-white/80 backdrop-blur-md shadow-sm text-[#333] font-medium border-[#f0ad4e]/40" />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm font-medium text-[#e94e24]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-[#333] text-sm sm:text-base">Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Smith" {...field} className="h-10 sm:h-11 bg-white/80 backdrop-blur-md shadow-sm text-[#333] font-medium border-[#f0ad4e]/40" />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm font-medium text-[#e94e24]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-[#333] text-sm sm:text-base">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                          className="h-10 sm:h-11 bg-white/80 backdrop-blur-md shadow-sm text-[#333] font-medium border-[#f0ad4e]/40"
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm font-medium text-[#e94e24]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-[#333] text-sm sm:text-base">Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          country={'us'}
                          preferredCountries={['us', 'mx']}
                          enableSearch={false}
                          disableSearchIcon={true}
                          autoFormat={true}
                          countryCodeEditable={false}
                          value={value}
                          onChange={(phone) => onChange(`+${phone}`)}
                          inputClass="w-full p-2 rounded-md border border-[#f0ad4e]/40 bg-white/80 backdrop-blur-md text-[#333] font-medium h-10 sm:h-11 shadow-sm"
                          containerClass="phone-input"
                          dropdownClass="bg-white/95 backdrop-blur-md"
                          buttonClass="border-[#f0ad4e]/40 bg-white/80"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm font-medium text-[#e94e24]" />
                    </FormItem>
                  )}
                />
                
                {/* Birthday fields (optional) - Important for birthday gift! */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="birthMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-[#333] text-sm sm:text-base flex items-center">
                          Birth Month <span className="text-[#2d8d47] text-xs ml-1">(for $10 gift!)</span>
                        </FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 sm:h-11 bg-white/80 backdrop-blur-md shadow-sm text-[#333] font-medium border-[#f0ad4e]/40">
                              <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white/95 backdrop-blur-md">
                            {months.map((month) => (
                              <SelectItem key={month} value={month} className="text-[#333]">
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs sm:text-sm font-medium text-[#e94e24]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-[#333] text-sm sm:text-base flex items-center">
                          Birth Day <span className="text-[#2d8d47] text-xs ml-1">(for $10 gift!)</span>
                        </FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 sm:h-11 bg-white/80 backdrop-blur-md shadow-sm text-[#333] font-medium border-[#f0ad4e]/40">
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white/95 backdrop-blur-md max-h-[200px]">
                            {days.map((day) => (
                              <SelectItem key={day} value={day} className="text-[#333]">
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs sm:text-sm font-medium text-[#e94e24]" />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full h-11 sm:h-12 text-base sm:text-lg font-medium bg-gradient-to-r from-[#e94e24] to-[#2d8d47] hover:shadow-lg
                             hover:shadow-[#e94e24]/30 transform hover:scale-[1.02] transition-all duration-300 mt-2 
                             disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    "Get FREE Rewards Now!"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}