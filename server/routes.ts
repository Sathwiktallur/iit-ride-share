import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertRideSchema, insertRideRequestSchema, insertRideRatingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/rides", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const rides = await storage.getAllRides();
    res.json(rides);
  });

  app.post("/api/rides", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parseResult = insertRideSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(parseResult.error);
    }

    const ride = await storage.createRide({
      ...parseResult.data,
      creatorId: req.user!.id,
    });
    res.status(201).json(ride);
  });

  app.post("/api/rides/:rideId/requests", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const rideId = parseInt(req.params.rideId);
    const ride = await storage.getRide(rideId);
    if (!ride) return res.status(404).send("Ride not found");

    const request = await storage.createRideRequest({
      rideId,
      userId: req.user!.id,
      status: "pending",
    });
    res.status(201).json(request);
  });

  app.patch("/api/rides/:rideId/requests/:requestId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const rideId = parseInt(req.params.rideId);
    const requestId = parseInt(req.params.requestId);
    
    const ride = await storage.getRide(rideId);
    if (!ride) return res.status(404).send("Ride not found");
    if (ride.creatorId !== req.user!.id) return res.sendStatus(403);

    const updatedRequest = await storage.updateRideRequestStatus(
      requestId,
      req.body.status
    );
    res.json(updatedRequest);
  });

  app.post("/api/rides/:rideId/ratings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const rideId = parseInt(req.params.rideId);
    const parseResult = insertRideRatingSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(parseResult.error);
    }

    const rating = await storage.createRideRating({
      ...parseResult.data,
      rideId,
      userId: req.user!.id,
    });
    res.status(201).json(rating);
  });

  const httpServer = createServer(app);
  return httpServer;
}
