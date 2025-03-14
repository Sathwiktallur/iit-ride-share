import { IStorage } from "./storage";
import createMemoryStore from "memorystore";
import session from "express-session";
import type { User, Ride, RideRequest, RideRating, ChatMessage, InsertUser } from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private rides: Map<number, Ride>;
  private rideRequests: Map<number, RideRequest>;
  private rideRatings: Map<number, RideRating>;
  private chatMessages: Map<number, ChatMessage>;
  sessionStore: session.SessionStore;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.rides = new Map();
    this.rideRequests = new Map();
    this.rideRatings = new Map();
    this.chatMessages = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({ checkPeriod: 86400000 });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createRide(ride: Omit<Ride, "id">): Promise<Ride> {
    const id = this.currentId++;
    const newRide = { ...ride, id };
    this.rides.set(id, newRide);
    return newRide;
  }

  async getRide(id: number): Promise<Ride | undefined> {
    return this.rides.get(id);
  }

  async getAllRides(): Promise<Ride[]> {
    return Array.from(this.rides.values());
  }

  async updateRideStatus(id: number, status: string): Promise<Ride> {
    const ride = this.rides.get(id);
    if (!ride) throw new Error("Ride not found");
    const updated = { ...ride, status };
    this.rides.set(id, updated);
    return updated;
  }

  async updateRideLocation(id: number, currentLocation: string): Promise<Ride> {
    const ride = this.rides.get(id);
    if (!ride) throw new Error("Ride not found");
    const updated = { ...ride, currentLocation };
    this.rides.set(id, updated);
    return updated;
  }

  async updateRideRoute(id: number, routeData: string): Promise<Ride> {
    const ride = this.rides.get(id);
    if (!ride) throw new Error("Ride not found");
    const updated = { ...ride, routeData };
    this.rides.set(id, updated);
    return updated;
  }

  async createRideRequest(request: Omit<RideRequest, "id">): Promise<RideRequest> {
    const id = this.currentId++;
    const newRequest = { ...request, id };
    this.rideRequests.set(id, newRequest);
    return newRequest;
  }

  async getRideRequests(rideId: number): Promise<RideRequest[]> {
    return Array.from(this.rideRequests.values()).filter(
      (req) => req.rideId === rideId
    );
  }

  async updateRideRequestStatus(id: number, status: string): Promise<RideRequest> {
    const request = this.rideRequests.get(id);
    if (!request) throw new Error("Request not found");
    const updated = { ...request, status };
    this.rideRequests.set(id, updated);
    return updated;
  }

  async createRideRating(rating: Omit<RideRating, "id">): Promise<RideRating> {
    const id = this.currentId++;
    const newRating = { ...rating, id };
    this.rideRatings.set(id, newRating);
    return newRating;
  }

  async getRideRatings(rideId: number): Promise<RideRating[]> {
    return Array.from(this.rideRatings.values()).filter(
      (rating) => rating.rideId === rideId
    );
  }

  async createChatMessage(message: Omit<ChatMessage, "id">): Promise<ChatMessage> {
    const id = this.currentId++;
    const newMessage = { ...message, id };
    this.chatMessages.set(id, newMessage);
    return newMessage;
  }

  async getRideChatMessages(rideId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((msg) => msg.rideId === rideId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}

export const storage = new MemStorage();