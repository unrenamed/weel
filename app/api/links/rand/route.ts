import { generateRandomKey } from "@/lib/api/links";
import { withErrorHandler } from "@/lib/error";
import { type NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");
  if (!domain) {
    return NextResponse.json({ error: "Domain is missing" }, { status: 400 });
  }
  const key = await generateRandomKey(domain);
  return NextResponse.json(key);
});
