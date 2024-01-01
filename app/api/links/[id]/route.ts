import { NextResponse, type NextRequest } from "next/server";
import {
  deleteLink,
  editLink,
  findLinkById,
  excludePassword,
  findLinkByDomainKey,
  cutMillisOff,
  validateExpirationTime,
} from "@/lib/api/links";
import { EditLink } from "@/lib/types";
import { pipe } from "@/lib/utils";
import { DuplicateKeyError, LinkNotFoundError } from "@/lib/error";
import { withError, withSchema } from "@/lib/handlers";
import { editLinkSchema } from "@/lib/schemas";

type Params = {
  id: string;
};

export const GET = withError(
  async (_: NextRequest, { params }: { params: Params }) => {
    const { id } = params;
    const link = await findLinkById(id);
    if (!link) {
      throw new LinkNotFoundError("Link is not found");
    }
    return NextResponse.json(excludePassword(link));
  }
);

export const DELETE = withError(
  async (_: NextRequest, { params }: { params: Params }) => {
    const { id } = params;
    const link = await findLinkById(id);
    if (!link) {
      throw new LinkNotFoundError("Link is not found");
    }

    const domainKey = { domain: link.domain, key: link.key };
    await deleteLink(domainKey);

    return NextResponse.json({ message: "Link deleted" });
  }
);

export const PUT = pipe(
  withSchema(editLinkSchema),
  withError
)(async (_, payload: EditLink, { params }: { params: Params }) => {
  const { id } = params;

  const link = await findLinkById(id);
  if (!link) {
    throw new LinkNotFoundError("Link is not found");
  }

  const domainKey = { domain: payload.domain, key: payload.key };
  const prevDomainKey = { domain: link.domain, key: link.key };

  const oldDomain = prevDomainKey.domain;
  const oldKey = prevDomainKey.key;
  const domainChanged = oldDomain !== domainKey.domain;
  const keyChanged = oldKey !== domainKey.key;

  if (domainChanged || keyChanged) {
    const otherExists = await findLinkByDomainKey(domainKey);
    if (otherExists) {
      throw new DuplicateKeyError("Key already exists in this domain");
    }
  }

  const expiresAt = cutMillisOff(payload.expiresAt);
  validateExpirationTime(expiresAt);

  const updatedLink = await editLink(id, prevDomainKey, {
    ...payload,
    expiresAt,
  });

  return NextResponse.json(
    { message: "Link edited", data: excludePassword(updatedLink) },
    { status: 200 }
  );
});
