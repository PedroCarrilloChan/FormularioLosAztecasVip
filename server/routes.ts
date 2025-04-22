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
      
      // Guardamos los datos del usuario en el objeto userData
      const userData = {
        firstName,
        lastName,
        email,
        phone,
        birthMonth,
        birthDay,
        chatbotUserId: userId
      };
      
      // NUEVO: Enviar datos a ChatGPTBuilder durante el registro
      try {
        console.log('📱 Enviando datos a ChatGPTBuilder durante el registro...');
        
        // Preparar formato de fecha de nacimiento
        let formattedBirthDate = '';
        if (birthMonth && birthDay) {
          const monthNumber = (MONTHS.indexOf(birthMonth) + 1).toString().padStart(2, '0');
          formattedBirthDate = `1980-${monthNumber}-${birthDay.padStart(2, '0')}`;
          console.log('📱 Fecha de nacimiento formateada:', formattedBirthDate);
        }
        
        // Crear acciones para actualizar los campos
        const actions = [
          {
            action: "set_field_value",
            field_name: "first_name",
            value: firstName
          },
          {
            action: "set_field_value",
            field_name: "last_name",
            value: lastName
          },
          {
            action: "set_field_value",
            field_name: "email",
            value: email
          },
          {
            action: "set_field_value",
            field_name: "phone",
            value: phone
          },
          {
            action: "set_field_value",
            field_name: "full_name",
            value: `${firstName} ${lastName}`
          },
          // Acción para iniciar el flujo específico
          {
            action: "send_flow",
            flow_id: 1736197240632
          }
        ];
        
        // Agregar acción de cumpleaños si está disponible
        if (formattedBirthDate) {
          actions.push({
            action: "set_field_value",
            field_name: "WC_UserBirthday",
            value: formattedBirthDate
          });
        }
        
        // Preparar payload para ChatGPTBuilder
        const payload = {
          phone: phone,
          first_name: firstName,
          last_name: lastName,
          email: email,
          actions: actions
        };
        
        // Agregar campo de cumpleaños si disponible
        if (formattedBirthDate) {
          (payload as any).WC_UserBirthday = formattedBirthDate;
        }
        
        // Realizar la llamada a la API
        const url = `https://app.chatgptbuilder.io/api/users/${userId}/send_content`;
        console.log(`📱 URL: ${url}`);
        console.log(`📱 Payload: ${JSON.stringify(payload, null, 2)}`);
        
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
        console.log('📱 Respuesta de ChatGPTBuilder:', JSON.stringify(chatGptData, null, 2));
        
        // Marcar en el objeto userData que los datos ya fueron enviados
        (userData as any).dataSentToChatGPT = true;
      } catch (apiError) {
        console.error('Error al enviar datos a ChatGPTBuilder durante el registro:', apiError);
        // Continuamos con el proceso aunque haya error para que el usuario pueda ver sus datos
      }
      
      // Guardar los datos en sesión para mostrarlos en página de confirmación
      console.log('Guardando datos de formulario en sesión para posterior confirmación');
      req.session.userData = userData;
      
      res.json({ success: true });
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
  
  // Endpoint para confirmar los datos y enviar a ChatGPTBuilder
  app.post('/api/confirm-data', async (req, res) => {
    try {
      if (!req.session.userData || !req.session.userData.chatbotUserId) {
        return res.status(400).json({
          success: false,
          error: 'No hay datos de usuario en la sesión o falta el ID'
        });
      }
      
      const userData = req.session.userData;
      const userId = userData.chatbotUserId;
      
      // Llamamos a la API de ChatGPTBuilder para enviar mensaje
      console.log(`⭐⭐⭐ CONFIRMACIÓN DE DATOS ⭐⭐⭐`);
      console.log(`⭐ ID de usuario: ${userId}`);
      console.log(`⭐ Datos completos: ${JSON.stringify(userData, null, 2)}`);
      
      // Preparar formato de fecha de nacimiento
      let formattedBirthDate = '';
      if (userData.birthMonth && userData.birthDay) {
        // Convertir month name a número de mes (January -> 01, February -> 02, etc.)
        const monthNumber = (MONTHS.indexOf(userData.birthMonth) + 1).toString().padStart(2, '0');
        // Formato: YYYY-MM-DD (usando 1980 como año)
        formattedBirthDate = `1980-${monthNumber}-${userData.birthDay.padStart(2, '0')}`;
      }
      
      // Crear acciones para actualizar los campos
      const actions = [
        {
          action: "set_field_value",
          field_name: "first_name",
          value: userData.firstName
        },
        {
          action: "set_field_value",
          field_name: "last_name",
          value: userData.lastName
        },
        {
          action: "set_field_value",
          field_name: "email",
          value: userData.email
        },
        {
          action: "set_field_value",
          field_name: "phone",
          value: userData.phone
        },
        {
          action: "set_field_value",
          field_name: "full_name",
          value: `${userData.firstName} ${userData.lastName}`
        },
        // Acción para iniciar un flujo específico en ChatGPTBuilder
        {
          action: "send_flow",
          flow_id: 1736197240632
        }
      ];
      
      // Agregar acción de cumpleaños si está disponible
      if (formattedBirthDate) {
        actions.push({
          action: "set_field_value",
          field_name: "WC_UserBirthday",
          value: formattedBirthDate
        });
      }
      
      // Preparación de datos para ChatGPTBuilder
      const payload = {
        phone: userData.phone,
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        actions: actions
      };
      
      // Agregar campo de cumpleaños si está disponible
      if (formattedBirthDate) {
        (payload as any).WC_UserBirthday = formattedBirthDate;
      }
      
      // Realizar la llamada a la API
      const url = `https://app.chatgptbuilder.io/api/users/${userId}/send_content`;
      console.log(`⭐ URL: ${url}`);
      console.log(`⭐ Payload: ${JSON.stringify(payload, null, 2)}`);
      
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
      console.log('⭐ Respuesta de ChatGPTBuilder:', JSON.stringify(chatGptData, null, 2));
      
      res.json({ 
        success: true,
        data: chatGptData
      });
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
      
      // Preparar formato de fecha de nacimiento
      let formattedBirthDate = '';
      if (userData.birthMonth && userData.birthDay) {
        // Convertir month name a número de mes (January -> 01, February -> 02, etc.)
        const monthNumber = (MONTHS.indexOf(userData.birthMonth) + 1).toString().padStart(2, '0');
        // Formato: YYYY-MM-DD (usando 1980 como año)
        formattedBirthDate = `1980-${monthNumber}-${userData.birthDay.padStart(2, '0')}`;
      }
      
      // Crear acciones para actualizar los campos
      const actions = [
        {
          action: "set_field_value",
          field_name: "first_name",
          value: userData.firstName
        },
        {
          action: "set_field_value",
          field_name: "last_name",
          value: userData.lastName
        },
        {
          action: "set_field_value",
          field_name: "email",
          value: userData.email
        },
        {
          action: "set_field_value",
          field_name: "phone",
          value: userData.phone
        },
        {
          action: "set_field_value",
          field_name: "full_name",
          value: `${userData.firstName} ${userData.lastName}`
        },
        // Acción para iniciar un flujo específico en ChatGPTBuilder
        {
          action: "send_flow",
          flow_id: 1736197240632
        }
      ];
      
      // Agregar acción de cumpleaños si está disponible
      if (formattedBirthDate) {
        actions.push({
          action: "set_field_value",
          field_name: "WC_UserBirthday",
          value: formattedBirthDate
        });
      }
      
      // Preparación de datos para ChatGPTBuilder
      const payload = {
        phone: userData.phone,
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        actions: actions
      };
      
      // Agregar campo de cumpleaños si está disponible
      if (formattedBirthDate) {
        (payload as any).WC_UserBirthday = formattedBirthDate;
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