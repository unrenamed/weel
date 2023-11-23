import { createLink, findLinks } from "@/lib/api/links";
import { CreateLink } from "@/lib/types";
import { exclude, pipe } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";
import { createLinkSchema } from "@/lib/schemas/create-link";
import { withError, withSchema } from "@/lib/handlers";

export const GET = withError(async (request: NextRequest) => {
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
});

export const POST = pipe(
  withSchema(createLinkSchema),
  withError
)(async (_, linkDetails: CreateLink) => {
  const link = await createLink(linkDetails);
  return NextResponse.json(exclude(link, ["password"]), { status: 201 });
});
