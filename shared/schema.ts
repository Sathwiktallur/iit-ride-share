import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
});

export const rides = pgTable("rides", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").notNull(),
  source: text("source").notNull(),
  destination: text("destination").notNull(),
  departureTime: timestamp("departure_time").notNull(),
  availableSeats: integer("available_seats").notNull(),
  costPerSeat: integer("cost_per_seat").notNull(),
  status: text("status").notNull().default("pending"), // pending, active, completed
  currentLocation: text("current_location"), // For real-time tracking
  routeData: text("route_data"), // For storing Google Maps route data
});

export const rideRequests = pgTable("ride_requests", {
  id: serial("id").primaryKey(),
  rideId: integer("ride_id").notNull(),
  userId: integer("user_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected
});

export const rideRatings = pgTable("ride_ratings", {
  id: serial("id").primaryKey(),
  rideId: integer("ride_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  review: text("review"),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  rideId: integer("ride_id").notNull(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).extend({
  username: z.string()
    .min(1, "Username is required")
    .regex(/^230041/, "Username must start with 230041")
});

export const insertRideSchema = createInsertSchema(rides)
  .omit({ id: true, creatorId: true, status: true, currentLocation: true, routeData: true })
  .extend({
    departureTime: z.string().transform((str) => new Date(str))
  });

export const insertRideRequestSchema = createInsertSchema(rideRequests).omit({ id: true, userId: true });
export const insertRideRatingSchema = createInsertSchema(rideRatings).omit({ id: true, userId: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, userId: true, timestamp: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Ride = typeof rides.$inferSelect;
export type RideRequest = typeof rideRequests.$inferSelect;
export type RideRating = typeof rideRatings.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;