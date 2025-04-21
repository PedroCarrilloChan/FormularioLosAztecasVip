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
      const { firstName, lastName, email, phone, birthMonth, birthDay } = req.body;

      if (!firstName || !lastName || !email || !phone) {
        return res.status(400).json({ 
          success: false,
          error: 'Faltan campos requeridos' 
        });
      }

      console.log('Datos de registro:', {
        firstName,
        lastName,
        email,
        phone,
        birthMonth,
        birthDay
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
        
        // Guardamos los datos en la sesión para poder accederlos en la página de éxito
        req.session.userData = {
          firstName,
          lastName,
          email,
          phone,
          createdAt: new Date().toISOString()
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
        createdAt: new Date().toISOString()
      };
      
      // Guardar en sesión y devolver
      req.session.userData = tempData;
      res.json(tempData);
    }
  });

  return httpServer;
}