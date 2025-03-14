import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocket, WebSocketServer } from 'ws';
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertRideSchema, insertRideRequestSchema, insertRideRatingSchema, insertChatMessageSchema } from "@shared/schema";

type WebSocketConnection = WebSocket & { userId?: number };

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  // Handle WebSocket connections
  httpServer.on('upgrade', (request, socket, head) => {
    if (request.url === '/ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws);
      });
    } else {
      socket.destroy();
    }
  });

  // WebSocket message handling
  wss.on('connection', (ws: WebSocketConnection) => {
    ws.on('message', async (data: string) => {
      try {
        const { type, payload } = JSON.parse(data);

        switch (type) {
          case 'auth':
            ws.userId = payload.userId;
            break;

          case 'chat_message':
            if (ws.userId && payload.rideId && payload.message) {
              const chatMessage = await storage.createChatMessage({
                userId: ws.userId,
                rideId: payload.rideId,
                message: payload.message,
                timestamp: new Date(),
              });
              wss.clients.forEach((client: WebSocketConnection) => {
                client.send(JSON.stringify({ type: 'chat_message', payload: chatMessage }));
              });
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket error:', error);
      }
    });
  });

  // REST API routes
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
      status: 'pending',
      currentLocation: null,
      routeData: null,
    });
    res.status(201).json(ride);
  });

  app.patch("/api/rides/:rideId/status", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const rideId = parseInt(req.params.rideId);
    const ride = await storage.getRide(rideId);

    if (!ride) return res.status(404).send("Ride not found");
    if (ride.creatorId !== req.user!.id) return res.sendStatus(403);

    const updatedRide = await storage.updateRideStatus(rideId, req.body.status);
    res.json(updatedRide);
  });

  app.get("/api/rides/:rideId/requests", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const rideId = parseInt(req.params.rideId);
    const ride = await storage.getRide(rideId);
    if (!ride) return res.status(404).send("Ride not found");
    if (ride.creatorId !== req.user!.id) return res.sendStatus(403);

    const requests = await storage.getRideRequests(rideId);
    res.json(requests);
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

  app.get("/api/rides/:rideId/messages", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const rideId = parseInt(req.params.rideId);
    const messages = await storage.getRideChatMessages(rideId);
    res.json(messages);
  });

  return httpServer;
}