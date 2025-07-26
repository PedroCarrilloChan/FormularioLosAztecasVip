import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

// Esta función está bien, la dejamos como está
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// Esta función es para desarrollo, la dejamos como está
export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: {
      middlewareMode: true,
      hmr: { server },
    },
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(`src="/src/main.tsx"`, `src="/src/main.tsx?v=${nanoid()}"`)
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

// --- ESTA ES LA FUNCIÓN CORREGIDA ---
export function serveStatic(app: Express) {
  // Cuando el servidor corre desde la carpeta 'dist', __dirname es /.../dist/server.
  // Necesitamos apuntar a la carpeta del cliente, que estará en /.../dist/client.
  const clientDistPath = path.resolve(__dirname, "..", "client");

  // Verifica si la carpeta del cliente existe para evitar errores
  if (!fs.existsSync(clientDistPath)) {
    throw new Error(
      `No se encontró el directorio del cliente: ${clientDistPath}. Asegúrate de haber ejecutado 'npm run build' correctamente.`
    );
  }

  // 1. Sirve los archivos estáticos (JS, CSS, etc.) desde la carpeta del cliente.
  app.use(express.static(clientDistPath));

  // 2. Para cualquier otra petición, sirve el index.html principal de React.
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(clientDistPath, "index.html"));
  });
}