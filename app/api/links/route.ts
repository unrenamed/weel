import {
  createLink,
  findLinks,
  excludePassword,
  findLinkByDomainKey,
  cutMillisOff,
  validateExpirationTime,
  hashLinkPassword,
} from "@/lib/api/links";
import { CreateLink } from "@/lib/types";
import { pipe } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";
import { createLinkSchema } from "@/lib/schemas/create-link";
import { withError, withSchema } from "@/lib/handlers";
import { DuplicateKeyError } from "@/lib/error";

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

  const linksWithoutPassword = links.map(excludePassword);
  return NextResponse.json(linksWithoutPassword);
});

export const POST = pipe(
  withSchema(createLinkSchema),
  withError
)(async (_, linkDetails: CreateLink) => {
  const { domain, key, password: rawPassword } = linkDetails;
  const domainKey = { domain, key };

  const exists = await findLinkByDomainKey(domainKey);
  if (exists) {
    throw new DuplicateKeyError("Key already exists in this domain");
  }

  const expiresAt = cutMillisOff(linkDetails.expiresAt);
  validateExpirationTime(expiresAt);
  const password = rawPassword ? await hashLinkPassword(rawPassword) : null;

  const link = await createLink({ ...linkDetails, expiresAt, password });
  return NextResponse.json(excludePassword(link), { status: 201 });
});
