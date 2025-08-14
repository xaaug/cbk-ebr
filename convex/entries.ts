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


export const getTodayTotals = query(async ({ db }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const entries = await db.query("entries").collect();

  const todayEntries = entries.filter((entry) => {
    const createdAt = new Date(entry.createdAt).getTime(); // correctly parse ISO string
    return createdAt >= today.getTime() && createdAt < tomorrow.getTime();
  });

  // const totalSpent = todayEntries.reduce((sum, entry) => sum + entry.price * entry.qty, 0);

  const totalSpent = todayEntries
  .filter((entry) => entry.paid)
  .reduce((sum, entry) => sum + entry.price * entry.qty, 0);


  const totalQty = todayEntries.reduce((sum, entry) => sum + entry.qty, 0);
  const unpaidTotal = todayEntries
    .filter((entry) => !entry.paid)
    .reduce((sum, entry) => sum + entry.price * entry.qty, 0);


  return { totalSpent, totalQty, unpaidTotal, entries: todayEntries };
});

export const togglePaid = mutation({
  args: {
    id: v.id("entries"), 
  },
  handler: async ({ db }, { id }) => {
    const entry = await db.get(id);
    if (!entry) throw new Error("Entry not found");
    await db.patch(id, { paid: !entry.paid });
  },
});


export const deleteEntry = mutation({
  args: {
    id: v.id("entries"), // Convex ensures this is a valid Id
  },
  handler: async ({ db }, { id }) => {
    const entry = await db.get(id);
    if (!entry) throw new Error("Entry not found");
    await db.delete(id);
  },
});