import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReservationSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Reservation endpoints
  app.post("/api/reservations", async (req, res) => {
    try {
      const validatedData = insertReservationSchema.parse(req.body);
      const reservation = await storage.createReservation(validatedData);
      res.status(201).json(reservation);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        res.status(400).json({ 
          error: "Validation failed", 
          message: validationError.message 
        });
      } else {
        res.status(500).json({ 
          error: "Internal server error",
          message: error.message 
        });
      }
    }
  });

  app.get("/api/reservations", async (_req, res) => {
    try {
      const reservations = await storage.getAllReservations();
      res.json(reservations);
    } catch (error: any) {
      res.status(500).json({ 
        error: "Internal server error",
        message: error.message 
      });
    }
  });

  app.get("/api/reservations/:id", async (req, res) => {
    try {
      const reservation = await storage.getReservation(req.params.id);
      if (!reservation) {
        res.status(404).json({ error: "Reservation not found" });
        return;
      }
      res.json(reservation);
    } catch (error: any) {
      res.status(500).json({ 
        error: "Internal server error",
        message: error.message 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
