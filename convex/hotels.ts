import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getHotels = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("hotels").order("desc").collect();
  },
});

export const getHotel = query({
  args: { hotelId: v.id("hotels") },
  handler: async (ctx, { hotelId }) => {
    return await ctx.db.get(hotelId);
  },
});

export const addHotel = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    chickenPrice: v.number(),
    balance: v.number(),
  },
  handler: async (ctx, { name, phone, chickenPrice, balance }) => {
    // Check if a hotel with the same name already exists
    const existing = await ctx.db
      .query("hotels")
      .filter((q) => q.eq(q.field("name"), name))
      .first();

    if (existing) {
      throw new Error(`Hotel with name "${name}" already exists.`);
    }

    return await ctx.db.insert("hotels", {
      name,
      phone,
      chickenPrice,
      balance,
      createdAt: Date.now(),
    });
  },
});

export const updateHotel = mutation({
  args: {
    hotelId: v.id("hotels"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    chickenPrice: v.optional(v.number()),
  },
  handler: async (ctx, { hotelId, ...updates }) => {
    const hotel = await ctx.db.get(hotelId);
    if (!hotel) throw new Error("Hotel not found");
    await ctx.db.patch(hotelId, updates);
  },
});

export const deleteHotel = mutation({
  args: { hotelId: v.id("hotels") },
  handler: async (ctx, { hotelId }) => {
    await ctx.db.delete(hotelId);
  },
});
