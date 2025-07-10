import db from "../../../db";
import { advocates } from "../../../db/schema";
import { ilike, or, sql, count } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.trim() ?? "";
    const page = Number(url.searchParams.get("page")?.trim()) ?? "";
    const limit = 10
    let totalPages

    if (!search) {
      // No search term, return all
      const totalResults = await db.select({ count: count() }).from(advocates);
      totalPages = Math.ceil(totalResults[0].count / limit)
      
      const data = await db.select().from(advocates).limit(limit).offset((page - 1) * limit);
      return Response.json({ data, totalPages,  totalResults: totalResults[0].count});
    }

    const searchPattern = `%${search}%`;
    const totalResults = await db
      .select({ count: count() })
      .from(advocates)
      .where(
        or(
          ilike(advocates.firstName, searchPattern),
          ilike(advocates.lastName, searchPattern),
          ilike(advocates.city, searchPattern),
          ilike(advocates.degree, searchPattern),
          sql`
            EXISTS (
              SELECT 1
              FROM jsonb_array_elements_text((payload #>> '{}')::jsonb) AS elem(value)
              WHERE elem.value ILIKE ${searchPattern}
            )
          `,
          sql`${advocates.yearsOfExperience}::text ILIKE ${searchPattern}`
        )
      )
    totalPages = Math.ceil(totalResults[0].count / limit)
    const data = await db
      .select()
      .from(advocates)
      .where(
        or(
          ilike(advocates.firstName, searchPattern),
          ilike(advocates.lastName, searchPattern),
          ilike(advocates.city, searchPattern),
          ilike(advocates.degree, searchPattern),
          sql`
            EXISTS (
              SELECT 1
              FROM jsonb_array_elements_text((payload #>> '{}')::jsonb) AS elem(value)
              WHERE elem.value ILIKE ${searchPattern}
            )
          `,
          sql`${advocates.yearsOfExperience}::text ILIKE ${searchPattern}`
        )
      )
      .limit(limit)
      .offset((page - 1) * limit);
    

    return Response.json({ data, totalPages, totalResults: totalResults[0].count });
  } catch (error) {
    console.error("Error fetching advocates:", error);
  }
}
