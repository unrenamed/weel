import { findLinkByDomainKey } from "@/lib/api/links";
import { type NextRequest, NextResponse } from "next/server";
import { withError } from "@/lib/handlers";

export const GET = withError(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");
  const key = searchParams.get("key");

  if (!domain || !key) {
    return NextResponse.json(
      { error: "Domain or key is missing" },
      { status: 400 }
    );
  }

  const link = await findLinkByDomainKey(domain, key);
  return NextResponse.json(!!link);
});
