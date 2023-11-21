import { NextResponse, type NextRequest } from "next/server";
import { LinkNotFoundError, withErrorHandler } from "@/lib/error";
import { findLinkByDomainKey } from "@/lib/api/links";
import { exclude } from "@/lib/utils";

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

  const link = await findLinkByDomainKey(domain, key);
  if (!link) {
    throw new LinkNotFoundError("Link is not found");
  }
  return NextResponse.json(exclude(link, ["password"]));
});
