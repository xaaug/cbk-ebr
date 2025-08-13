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
});
