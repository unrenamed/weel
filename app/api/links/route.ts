import { createLink, deleteLink, findLinks } from "@/lib/api/links";
import { CreateLink, DeleteLink } from "@/lib/types";
import { exclude } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");
  const sort = searchParams.get("sort");
  const page = searchParams.get("page");
  const perPage = searchParams.get("per_page");
  const showArchived = searchParams.get("show_archived");

  const links = await findLinks({
    ...(domain && { domain }),
    ...(sort && { sort }),
    ...(page && { page: parseInt(page) }),
    ...(perPage && { perPage: parseInt(perPage) }),
    ...(showArchived && { showArchived: showArchived === "true" }),
  });

  const linksWithoutPassword = links.map((link) => exclude(link, ["password"]));
  return NextResponse.json(linksWithoutPassword);
}

export async function POST(request: NextRequest) {
  const linkDetails = (await request.json()) as CreateLink;
  const link = await createLink(linkDetails);
  return NextResponse.json(exclude(link, ["password"]), { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { domain, key } = (await request.json()) as DeleteLink;
  await deleteLink(domain, key);
  return NextResponse.json({ message: "Link deleted" });
}
