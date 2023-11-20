import { createLink, findLinks } from "@/lib/api/links";
import { BaseError } from "@/lib/error/base-error";
import { CreateLink } from "@/lib/types";
import { exclude } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");
  const sort = searchParams.get("sort");
  const page = searchParams.get("page");
  const perPage = searchParams.get("per_page");
  const showArchived = searchParams.get("show_archived");
  const search = searchParams.get("search");

  const links = await findLinks({
    ...(domain && { domain }),
    ...(sort && { sort }),
    ...(search && { search }),
    ...(page && { page: parseInt(page) }),
    ...(perPage && { perPage: parseInt(perPage) }),
    ...(showArchived && { showArchived: showArchived === "true" }),
  });

  const linksWithoutPassword = links.map((link) => exclude(link, ["password"]));
  return NextResponse.json(linksWithoutPassword);
}

export async function POST(request: NextRequest) {
  const linkDetails = (await request.json()) as CreateLink;
  try {
    const link = await createLink(linkDetails);
    return NextResponse.json(exclude(link, ["password"]), { status: 201 });
  } catch (err) {
    if (err instanceof BaseError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.statusCode }
      );
    }
  }
}
