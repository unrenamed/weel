import { NextResponse, type NextRequest } from "next/server";
import {
  deleteLink,
  editLink,
  findLinkById,
  excludePassword,
} from "@/lib/api/links";
import { EditLink } from "@/lib/types";
import { pipe } from "@/lib/utils";
import { LinkNotFoundError } from "@/lib/error";
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
    await deleteLink(link.domain, link.key);
    return NextResponse.json({ message: "Link deleted" });
  }
);

export const PUT = pipe(
  withSchema(editLinkSchema),
  withError
)(async (_, linkDetails: EditLink, { params }: { params: Params }) => {
  const { id } = params;
  const updatedLink = await editLink(id, linkDetails);
  return NextResponse.json(
    { message: "Link edited", data: excludePassword(updatedLink) },
    { status: 200 }
  );
});
