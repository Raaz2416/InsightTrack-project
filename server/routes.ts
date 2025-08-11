import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer, { type FileFilterCallback } from "multer";
import Papa from "papaparse";
import { insertDatasetSchema, type DatasetColumn } from "@shared/schema";
import { z } from "zod";

// Extend Request type to include file property
interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});

function inferColumnType(values: (string | null)[]): 'text' | 'number' | 'date' {
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v.trim() !== '');
  if (nonNullValues.length === 0) return 'text';
  
  // Check if all values are numbers
  const numberCount = nonNullValues.filter(v => !isNaN(Number(v))).length;
  if (numberCount / nonNullValues.length > 0.8) return 'number';
  
  // Check if all values are dates
  const dateCount = nonNullValues.filter(v => {
    const date = new Date(v || "");
    return !isNaN(date.getTime());
  }).length;
  if (dateCount / nonNullValues.length > 0.8) return 'date';
  
  return 'text';
}

function parseCSVData(csvContent: string): { columns: DatasetColumn[]; data: Record<string, any>[]; rowCount: number } {
  const result = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
    transformHeader: (header: string) => header.trim(),
  });

  if (result.errors.length > 0) {
    throw new Error(`CSV parsing error: ${result.errors[0].message}`);
  }

  const data = result.data as Record<string, any>[];
  const headers = Object.keys(data[0] || {});
  
  if (headers.length === 0) {
    throw new Error("CSV file appears to be empty or invalid");
  }

  // Infer column types
  const columns: DatasetColumn[] = headers.map(header => {
    const values = data.map(row => row[header]);
    const type = inferColumnType(values);
    return {
      name: header,
      type,
      nullable: values.some(v => v === null || v === undefined || v === ''),
    };
  });

  return {
    columns,
    data,
    rowCount: data.length,
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all datasets
  app.get("/api/datasets", async (req, res) => {
    try {
      const datasets = await storage.getAllDatasets();
      res.json(datasets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch datasets" });
    }
  });

  // Get single dataset
  app.get("/api/datasets/:id", async (req, res) => {
    try {
      const dataset = await storage.getDataset(req.params.id);
      if (!dataset) {
        return res.status(404).json({ message: "Dataset not found" });
      }
      res.json(dataset);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dataset" });
    }
  });

  // Upload CSV file
  app.post("/api/datasets/upload", upload.single("file"), async (req: RequestWithFile, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const csvContent = req.file.buffer.toString("utf-8");
      const { columns, data, rowCount } = parseCSVData(csvContent);

      const datasetData = {
        name: req.file.originalname.replace('.csv', ''),
        fileName: req.file.originalname,
        fileSize: req.file.buffer.length,
        rowCount,
        columnCount: columns.length,
        columns,
        data,
      };

      // Validate with schema
      const validatedData = insertDatasetSchema.parse(datasetData);
      
      const dataset = await storage.createDataset(validatedData);
      res.status(201).json(dataset);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid dataset data", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to process CSV file" 
      });
    }
  });

  // Delete dataset
  app.delete("/api/datasets/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDataset(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Dataset not found" });
      }
      res.json({ message: "Dataset deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete dataset" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
