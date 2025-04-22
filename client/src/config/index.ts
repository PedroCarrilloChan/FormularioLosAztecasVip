export const config = {
  // SmartPasses API Configuration (anteriormente Wallet Club)
  walletClub: {
    templateId: import.meta.env.VITE_WALLET_CLUB_TEMPLATE_ID || "4905908146798592",
    apiKey: import.meta.env.VITE_WALLET_CLUB_API_KEY || "itiwUSrHCAvxfqFUAzvANPPxSrBDQFvWLyPAWQylWhPAkYYvSCzFhbpcZqBwYKZp",
    baseUrl: "https://pass.smartpasses.io/api/v1",
  },
  // Company branding
  branding: {
    logoUrl: import.meta.env.VITE_COMPANY_LOGO_URL || "https://losaztecas.s3.us-east-1.amazonaws.com/Store+Card/Los+Aztecas+Transparent1.png", // URL del logo de Los Aztecas
    name: import.meta.env.VITE_COMPANY_NAME || "Los Aztecas", // Nombre de la empresa actualizado
    primaryColor: "hsl(14 79% 52%)", // Color primario (naranja de Los Aztecas)
    secondaryColor: "hsl(135 52% 36%)", // Color secundario (verde de Los Aztecas)
    tertiaryColor: "hsl(0 0% 25%)", // Color terciario (gris oscuro para textos)
    accentColor: "hsl(41 93% 64%)", // Color de acento (amarillo para bordes)
    heroUrl: import.meta.env.VITE_HERO_IMAGE_URL, // URL de la imagen de fondo del hero
    bottomImageUrl: import.meta.env.VITE_BOTTOM_IMAGE_URL, // URL de la imagen inferior
  },
  // External services
  externalServices: {
    androidInstallUrl: import.meta.env.VITE_ANDROID_INSTALL_URL || "https://android-instalacion-automatica-onlinemidafilia.replit.app/generateLink",
  },
  // ChatGPTBuilder configuration
  chatGPTBuilder: {
    accessToken: import.meta.env.VITE_CHATGPT_BUILDER_TOKEN || "1565855.C6RBAEhiHrV5b2ytPTg612PManzendsWY",
    defaultUserId: import.meta.env.VITE_CHATGPT_BUILDER_DEFAULT_USER_ID || "1000101715537032952",
    baseUrl: "https://app.chatgptbuilder.io/api",
  },
  // API endpoints
  api: {
    register: "/api/register",
    loyaltyData: "/api/loyalty-data",
    androidLink: "/api/android-link",
    sendToChatGPTBuilder: "/api/send-to-chatgpt-builder",
  }
};

// Tipos para TypeScript
export type Config = typeof config;