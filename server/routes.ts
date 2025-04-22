import type { Express } from "express";
import { createServer, type Server } from "http";
import fetch from "node-fetch";

// Array auxiliar para mapear nombres de meses a números - definido globalmente
const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  app.post('/api/register', async (req, res) => {
    try {
      const { firstName, lastName, email, phone, birthMonth, birthDay, chatbotUserId } = req.body;

      if (!firstName || !lastName || !email || !phone) {
        return res.status(400).json({ 
          success: false,
          error: 'Faltan campos requeridos' 
        });
      }
      
      // Guardar el ID del chatbot si está disponible para usarlo en confirmación
      const userId = chatbotUserId || '000000000000'; // Valor por defecto si no se proporciona
      
      console.log('⚠️ DATOS DEL BODY:', JSON.stringify(req.body, null, 2));
      console.log('⚠️ CHATBOT USER ID RECIBIDO:', chatbotUserId);
      console.log('⚠️ USER ID A UTILIZAR:', userId);

      console.log('Datos de registro:', {
        firstName,
        lastName,
        email,
        phone,
        birthMonth,
        birthDay,
        chatbotUserId
      });
      
      try {
        // Si hay fecha de nacimiento, la procesamos
        let formattedBirthDate = '';
        
        if (birthMonth && birthDay) {
          // Convertir month name a número de mes (January -> 01, February -> 02, etc.)
          const monthNumber = (MONTHS.indexOf(birthMonth) + 1).toString().padStart(2, '0');
          
          // Formato: YYYY-MM-DD (siempre usando 1980 como año)
          formattedBirthDate = `1980-${monthNumber}-${birthDay.padStart(2, '0')}`;
        }
        
        console.log('Enviando datos a ChatGPTBuilder.io:', {
          phone,
          firstName,
          lastName,
          email,
          formattedBirthDate
        });
        
        // Preparamos las acciones para el API si hay fecha de nacimiento
        const actions = formattedBirthDate ? [
          {
            action: "set_field_value",
            field_name: "WC_UserBirthday",
            value: formattedBirthDate
          }
        ] : [];
        
        // Llamamos a la API de ChatGPTBuilder
        const chatGptResponse = await fetch("https://app.chatgptbuilder.io/api/users", {
          method: "POST",
          headers: {
            "accept": "application/json",
            "X-ACCESS-TOKEN": "1565855.C6RBAEhiHrV5b2ytPTg612PManzendsWY",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            phone: phone,
            first_name: firstName,
            last_name: lastName,
            email: email,
            ...(formattedBirthDate && { WC_UserBirthday: formattedBirthDate }),
            actions: actions
          })
        });
        
        const chatGptData = await chatGptResponse.json();
        console.log('Respuesta de ChatGPTBuilder.io:', JSON.stringify(chatGptData, null, 2));
        
        // Obtener el ID del usuario de la respuesta de la API si está disponible
        // De lo contrario, usar el ID que se pasó en la URL
        const apiUserId = (chatGptData && typeof chatGptData === 'object' && 'data' in chatGptData && chatGptData.data && typeof chatGptData.data === 'object' && 'id' in chatGptData.data) 
            ? String(chatGptData.data.id) 
            : userId;
        
        console.log(`ID de usuario para segunda llamada: ${apiUserId}`);
        
        // Guardamos los datos en la sesión para poder accederlos en la página de éxito
        req.session.userData = {
          firstName,
          lastName,
          email,
          phone,
          birthMonth,
          birthDay,
          chatbotUserId: apiUserId
        };
        
        res.json({ success: true });
      } catch (error) {
        console.error('Error al enviar datos a ChatGPTBuilder.io:', error);
        res.status(500).json({ 
          success: false,
          error: 'Error al procesar la información. Por favor intente nuevamente.'
        });
      }
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error en el registro. Por favor intente nuevamente.' 
      });
    }
  });

  app.get('/api/user-data', (req, res) => {
    // Forzar cabeceras para asegurar que la respuesta es JSON
    res.setHeader('Content-Type', 'application/json');
    
    console.log('Datos de usuario en sesión:', req.session.userData);
    
    if (req.session.userData) {
      res.json(req.session.userData);
    } else {
      // Crear datos de ejemplo temporales para desarrollo (solo para pruebas)
      const tempData = {
        firstName: "Usuario",
        lastName: "De Prueba",
        email: "ejemplo@correo.com",
        phone: "+1234567890",
        birthMonth: "January",
        birthDay: "1",
        chatbotUserId: "000000000000"
      };
      
      // Guardar en sesión y devolver
      req.session.userData = tempData;
      res.json(tempData);
    }
  });
  
  // Endpoint para confirmar los datos (actualizado para el nuevo endpoint de ChatGPTBuilder)
  app.post('/api/confirm-data', async (req, res) => {
    try {
      if (!req.session.userData || !req.session.userData.chatbotUserId) {
        return res.status(400).json({
          success: false,
          error: 'No hay datos de usuario en la sesión o falta el ID'
        });
      }
      
      const userId = req.session.userData.chatbotUserId;
      
      // Llamamos a la API de ChatGPTBuilder para enviar mensaje
      console.log(`⭐⭐⭐ CONFIRMACIÓN DE DATOS ⭐⭐⭐`);
      console.log(`⭐ ID de usuario: ${userId}`);
      console.log(`⭐ Datos completos: ${JSON.stringify(req.session.userData, null, 2)}`);
      
      // Este endpoint ahora es simplemente para registrar la confirmación en el backend
      // El envío real de datos a ChatGPTBuilder se hace directamente desde el frontend
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error al confirmar datos:', error);
      res.status(500).json({
        success: false,
        error: 'Error al confirmar los datos. Por favor intente nuevamente.'
      });
    }
  });
  
  // Endpoint para enviar datos a ChatGPTBuilder (para pruebas y como alternativa)
  app.post('/api/send-to-chatgpt-builder', async (req, res) => {
    try {
      if (!req.body || !req.body.userData) {
        return res.status(400).json({
          success: false,
          error: 'No se proporcionaron datos de usuario'
        });
      }
      
      const { userData } = req.body;
      const userId = userData.chatbotUserId || (req.session.userData ? req.session.userData.chatbotUserId : null);
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'No se proporcionó ID de usuario para ChatGPTBuilder'
        });
      }
      
      console.log(`📡 Enviando datos a ChatGPTBuilder API para usuario ${userId}`);
      console.log(`📡 Datos: ${JSON.stringify(userData, null, 2)}`);
      
      // Preparación de datos para ChatGPTBuilder
      const payload = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        email: userData.email
      };
      
      // Agregar datos de cumpleaños si están disponibles
      if (userData.birthMonth && userData.birthDay) {
        payload.birth_month = userData.birthMonth;
        payload.birth_day = userData.birthDay;
      }
      
      // Realizar la llamada a la API
      const url = `https://app.chatgptbuilder.io/api/users/${userId}/send_content`;
      console.log(`📡 URL: ${url}`);
      console.log(`📡 Payload: ${JSON.stringify(payload, null, 2)}`);
      
      const chatGptResponse = await fetch(url, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "X-ACCESS-TOKEN": "1565855.C6RBAEhiHrV5b2ytPTg612PManzendsWY",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      const chatGptData = await chatGptResponse.json();
      console.log('📡 Respuesta de ChatGPTBuilder:', JSON.stringify(chatGptData, null, 2));
      
      res.json({ 
        success: true,
        data: chatGptData
      });
    } catch (error) {
      console.error('Error al enviar datos a ChatGPTBuilder:', error);
      res.status(500).json({
        success: false,
        error: 'Error al enviar datos a ChatGPTBuilder.'
      });
    }
  });

  return httpServer;
}