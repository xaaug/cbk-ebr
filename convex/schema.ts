import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  entries: defineTable({
    qty: v.number(),
    price: v.number(),
    total: v.number(),
    paid: v.boolean(),
    date: v.string(), // YYYY-MM-DD
    createdAt: v.string(), // ISO timestamp
  })
    .index("by_date", ["date"])
    .index("by_paid", ["paid"]),

    sales: defineTable({
      date: v.string(), // ISO date string
      customerType: v.union(v.literal("individual"), v.literal("hotel")),
      customerName: v.optional(v.string()), // only if individual
      hotelId: v.optional(v.id("hotels")), // only if hotel
      item: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      totalAmount: v.number(),
      paymentStatus: v.union(
        v.literal("paid"),
        v.literal("pending"),
        v.literal("partial")
      ),
      notes: v.optional(v.string()),
      createdAt: v.string(),
    }),
  
    hotels: defineTable({
      name: v.string(),
      phone: v.string(),
      balance: v.number(),
      chickenPrice: v.number(),
      createdAt: v.number(),
    }),
  
    payments: defineTable({
      hotelId: v.id("hotels"),
      amount: v.number(),
      createdAt: v.number(),
    }).index("by_hotel", ["hotelId"]),
    
});
