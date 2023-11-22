import { NextResponse } from "next/server";
import { LinkNotFoundError } from "@/lib/error";
import { pipe } from "@/lib/utils";
import { withError, withSchema } from "@/lib/handlers";
import { archiveLinkSchema } from "@/lib/schemas";
import { findLinkById, setArchiveStatus } from "@/lib/api/links";

type Params = {
  id: string;
};

export const PUT = pipe(
  withSchema(archiveLinkSchema),
  withError
)(async function (
  _,
  { archived }: { archived: boolean },
  { params }: { params: Params }
) {
  const { id } = params;
  const link = await findLinkById(id);
  if (!link) throw new LinkNotFoundError("Link is not found");
  await setArchiveStatus(link, archived);
  return NextResponse.json({ message: "Link archive status updated" });
});
