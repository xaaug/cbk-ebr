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
      v.literal("pending")
    ),
    notes: v.optional(v.string()),
    date: v.string(), // ISO date string
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Insert the sale record
    const saleId = await ctx.db.insert("sales", args);

    // 2. If sale is for a hotel, update that hotel’s balance
    if (args.customerType === "hotel" && args.hotelId) {
      const hotel = await ctx.db.get(args.hotelId);
      if (!hotel) throw new Error("Hotel not found");

      // For hotels: balance increases by the totalAmount if not paid
      let newBalance = hotel.balance ?? 0;
      if (args.paymentStatus === "pending") {
        newBalance += args.totalAmount;
      }
      // if "paid", balance stays the same

      await ctx.db.patch(args.hotelId, { balance: newBalance });
    }

    return saleId;
  },
});


export const addQuickSale = mutation({
  args: {
    qty: v.number(),
    price: v.number(),
    paid: v.boolean(),
  },
  handler: async (ctx, args) => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const createdAt = new Date().toISOString();

    // Build full sale args
    const saleArgs = {
      customerType: "individual" as const,
      customerName: "Customer", // default for individuals
      hotelId: undefined,
      item: "chicken",
      quantity: args.qty,
      unitPrice: args.price,
      totalAmount: args.qty * args.price,
      paymentStatus: args.paid ? "paid" as const : "pending" as const,
      notes: undefined,
      date: dateStr,
      createdAt,
    };

    // Insert directly
    const saleId = await ctx.db.insert("sales", saleArgs);

    return saleId;
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


export const getSaleDates = query({
  handler: async (ctx) => {
    const sales = await ctx.db.query("sales").order("desc").collect();
    const datesSet = new Set(sales.map(s => s.date));
    const dates = Array.from(datesSet).sort((a, b) => (a > b ? -1 : 1));
    return dates;
  },
});

export const getSalesByDate = query({
  args: {
    date: v.string(),
  },
  handler: async (ctx, { date }) => {
    return await ctx.db
      .query("sales")
      .filter((q) => q.eq(q.field("date"), date))
      .order("desc")
      .collect();
  },
});

export const markSalePaid = mutation({
  args: {
    saleId: v.id("sales"),
  },
  handler: async (ctx, { saleId }) => {
    const sale = await ctx.db.get(saleId);
    if (!sale) throw new Error("Sale not found");

    // Only update if it's pending
    if (sale.paymentStatus === "pending") {
      await ctx.db.patch(saleId, { paymentStatus: "paid" });

      // If this is a hotel sale, subtract from hotel balance
      if (sale.customerType === "hotel" && sale.hotelId) {
        const hotel = await ctx.db.get(sale.hotelId);
        if (!hotel) throw new Error("Hotel not found");

        const newBalance = (hotel.balance ?? 0) - sale.totalAmount;
        await ctx.db.patch(sale.hotelId, { balance: newBalance });
      }
    }

    return true;
  },
});