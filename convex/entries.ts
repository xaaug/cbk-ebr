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
    const createdAt = new Date(entry.createdAt).getTime();  
    return createdAt >= today.getTime() && createdAt < tomorrow.getTime();
  });

  // const totalSpent = todayEntries.reduce((sum, entry) => su`m + entry.price * entry.qty, 0);

  const totalSpent = todayEntries
  .filter((entry) => entry.paid)
  .reduce((sum, entry) => sum + entry.price * entry.qty, 0);


  const totalQty = todayEntries.reduce((sum, entry) => sum + entry.qty, 0);
  const unpaidTotal = todayEntries
    .filter((entry) => !entry.paid)
    .reduce((sum, entry) => sum + entry.price * entry.qty, 0);


  return { totalSpent, totalQty, unpaidTotal, entries: todayEntries };
});



export const getDateTotals = query(async ({ db }, { date }: { date: string }) => {
  // Parse "DD/MM/YYYY"
  const [dayStr, monthStr, yearStr] = date.split("/");
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10) - 1; // JS months are 0-based
  const year = parseInt(yearStr, 10);

  const start = new Date(year, month, day, 0, 0, 0, 0);
  const end = new Date(year, month, day + 1, 0, 0, 0, 0);

  const entries = await db.query("entries").collect();

  // Filter entries within this day
  const dayEntries = entries.filter((entry) => {
    const createdAt = new Date(entry.createdAt).getTime();
    return createdAt >= start.getTime() && createdAt < end.getTime();
  });

  const totalSpent = dayEntries
    .filter((entry) => entry.paid)
    .reduce((sum, entry) => sum + entry.price * entry.qty, 0);

  const totalQty = dayEntries.reduce((sum, entry) => sum + entry.qty, 0);

  const unpaidTotal = dayEntries
    .filter((entry) => !entry.paid)
    .reduce((sum, entry) => sum + entry.price * entry.qty, 0);

  return { totalSpent, totalQty, unpaidTotal, entries: dayEntries };
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
    id: v.id("entries"), 
  },
  handler: async ({ db }, { id }) => {
    const entry = await db.get(id);
    if (!entry) throw new Error("Entry not found");
    await db.delete(id);
  },
});

export const getHistoryDays = query({
  args: {},
  handler: async (ctx) => {
    const entries = await ctx.db.query("entries").collect();

    const grouped: Record<string, any[]> = {};
    for (const e of entries) {
      const d = new Date(e.createdAt);
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const year = d.getFullYear();
      const date = `${day}/${month}/${year}`;

      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(e);
    }

    return Object.entries(grouped).map(([date, list]) => {
      const totalQty = list.reduce((sum, e) => sum + e.qty, 0);
      const totalPrice = list.reduce((sum, e) => sum + e.price * e.qty, 0);
      const paidCount = list.filter((e) => e.paid).length;

      return {
        date, 
        totalQty,
        totalPrice,
        paidCount
      };
    });
  },
});



export const getEntriesByDate = query({
  args: { date: v.string() }, 
  handler: async (ctx, args) => {
    const entries = await ctx.db.query("entries").collect();

    return entries.filter(
      (e) =>
        new Date(e.createdAt).toLocaleDateString("en-KE") === args.date
    );
  },
});
