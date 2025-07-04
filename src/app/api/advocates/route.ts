import db from "../../../db";
import { advocates } from "../../../db/schema";
import { ilike, or, sql } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.trim() ?? "";

    if (!search) {
      // No search term, return all
      const data = await db.select().from(advocates);
      return Response.json({ data });
    }

    const searchPattern = `%${search}%`;
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
      );
    

    return Response.json({ data });
  } catch (error) {
    console.error("Error fetching advocates:", error);
  }
}
