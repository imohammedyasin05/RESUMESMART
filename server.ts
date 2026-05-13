import express, { Request } from "express";
import path from "path";
import cors from "cors";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import { PDFParse } from "pdf-parse";

// Global Error Handlers for debugging
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (reason, _promise) => {
  console.error("UNHANDLED REJECTION:", reason);
});

const upload = multer({ storage: multer.memoryStorage() });

// PDF Parse Wrapper
async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    
    // Attempt cleanup if possible
    try {
      await parser.destroy();
    } catch (e) {
      console.warn("PDFParse destroy failed (non-critical):", e);
    }
    
    return data.text || "";
  } catch (err) {
    console.error("Internal PDF Parsing Error:", err);
    throw err;
  }
}

async function startServer() {
  console.log("Starting Resume Analyzer Server...");
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Logging Middleware
  app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // Health Check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", message: "Resume API is live" });
  });

  // PDF Extraction Route
  app.post("/api/extract-pdf", upload.single("resume"), async (req: Request, res) => {
    console.group("PDF Upload Request");
    try {
      const file = (req as any).file;
      if (!file) {
        console.error("No file in request");
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log(`Processing file: ${file.originalname} (${file.size} bytes)`);
      const text = await extractPdfText(file.buffer);
      
      if (!text) {
        console.warn("PDF extraction returned empty text");
        return res.status(422).json({ error: "Could not extract text from this PDF. It might be an image-only PDF." });
      }

      console.log("Extraction successful, sending text content");
      res.json({ text });
    } catch (error) {
      console.error("PDF Extraction Error:", error);
      res.status(500).json({ 
        error: "Server error during PDF processing", 
        details: error instanceof Error ? error.message : String(error) 
      });
    } finally {
      console.groupEnd();
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Mounting Vite Development Middleware...");
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("Vite middleware mounted.");
    } catch (err) {
      console.error("Failed to mount Vite middleware:", err);
    }
  } else {
    console.log("Serving static production assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`>>> Server ready at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("CRITICAL SERVER STARTUP ERROR:", err);
});
