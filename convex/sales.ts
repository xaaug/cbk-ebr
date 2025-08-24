import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addSale = mutation({
  args: {
    customerType: v.union(v.literal("individual"), v.literal("hotel")),
    customerName: v.optional(v.string()),
    hotelId: v.optional(v.id("hotels")),
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
    date: v.string(), // ISO date string
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sales", args);
  },
});


export const getTodayTotals = query({
  args: {},
  handler: async (ctx) => {
    // Get today’s date string in YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    // Fetch all sales from today
    const sales = await ctx.db
      .query("sales")
      .filter((q) => q.eq(q.field("date"), todayStr))
      .collect();

    // Compute totals
    const totalQty = sales.reduce((sum, s) => sum + (s.quantity ?? 0), 0);
    const totalSpent = sales.reduce(
      (sum, s) => sum + (s.totalAmount ?? s.quantity * s.unitPrice),
      0
    );

    return {
      totalQty,
      totalSpent,
    };
  },
});

export const getTodaySales = query({
  args: {},
  handler: async (ctx) => {
    // Get today’s date string in YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    // Fetch all sales from today
    const sales = await ctx.db
      .query("sales")
      .filter((q) => q.eq(q.field("date"), todayStr))
      .collect();


    return sales.reverse()
  },
});

export const deleteSale = mutation({
  args: {
    saleId: v.id("sales"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.saleId);
    return { success: true };
  },
});

