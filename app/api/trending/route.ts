import { NextResponse } from "next/server";
import { getTrending } from "@/lib/birdeye";

export const revalidate = 30;

export async function GET() {
  const { data, source } = await getTrending(24);
  return NextResponse.json(
    { tokens: data, source },
    { headers: { "cache-control": "public, s-maxage=30, stale-while-revalidate=60" } },
  );
}
