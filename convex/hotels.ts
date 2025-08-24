import { query } from "./_generated/server";

export const list = query(async (ctx) => {
  // Fetch all hotels from the "hotels" table
  return await ctx.db.query("hotels").collect();
});
