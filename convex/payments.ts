import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getPaymentsByHotel = query({
  args: { hotelId: v.id("hotels") },
  handler: async (ctx, { hotelId }) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_hotel", (q) => q.eq("hotelId", hotelId))
      .order("desc")
      .collect();
  },
});

export const addPayment = mutation({
  args: { hotelId: v.id("hotels"), amount: v.number() },
  handler: async (ctx, { hotelId, amount }) => {
    const hotel = await ctx.db.get(hotelId);
    if (!hotel) throw new Error("Hotel not found");

    // Insert payment
    await ctx.db.insert("payments", {
      hotelId,
      amount,
      createdAt: Date.now(),
    });

    // Subtract from hotel balance
    await ctx.db.patch(hotelId, {
      balance: Math.max(hotel.balance - amount, 0),
    });
  },
});
