import { findLink } from "@/lib/api/links";
import { withErrorHandler } from "@/lib/error";
import { type NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");
  const key = searchParams.get("key");

  if (!domain || !key) {
    return NextResponse.json(
      { error: "Domain or key is missing" },
      { status: 400 }
    );
  }

  const link = await findLink(domain, key);
  return NextResponse.json(!!link);
});
