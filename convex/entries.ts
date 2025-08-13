import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import dayjs from "dayjs";

export const addEntry = mutation({
  args: {
    qty: v.number(),
    price: v.number(),
    paid: v.boolean(),
  },
  handler: async (ctx, args) => {
    const total = args.qty * args.price;
    const today = dayjs().format("YYYY-MM-DD");
    await ctx.db.insert("entries", {
      qty: args.qty,
      price: args.price,
      total,
      paid: args.paid,
      date: today,
      createdAt: new Date().toISOString(),
    });
  },
});

export const getTodayEntries = query({
  args: {},
  handler: async (ctx) => {
    const today = dayjs().format("YYYY-MM-DD");
    return await ctx.db
      .query("entries")
      .withIndex("by_date", (q) => q.eq("date", today))
      .order("desc")
      .collect();
  },
});

export const getTodayTotals = query({
  args: {},
  handler: async (ctx) => {
    const today = dayjs().format("YYYY-MM-DD");
    const entries = await ctx.db
      .query("entries")
      .withIndex("by_date", (q) => q.eq("date", today))
      .collect();

    const totalSpent = entries.reduce((sum, e) => sum + e.total, 0);
    const unpaidTotal = entries
      .filter((e) => !e.paid)
      .reduce((sum, e) => sum + e.total, 0);

    return { totalSpent, unpaidTotal };
  },
});
