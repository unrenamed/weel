import { NextResponse, type NextRequest } from "next/server";
import { deleteLink, editLink, findLinkById } from "@/lib/api/links";
import { EditLink } from "@/lib/types";
import { exclude } from "@/lib/utils";
import { LinkNotFoundError, withErrorHandler } from "@/lib/error";

type Params = {
  id: string;
};

export const GET = withErrorHandler(
  async (_: NextRequest, { params }: { params: Params }) => {
    const { id } = params;
    const link = await findLinkById(id);
    if (!link) {
      throw new LinkNotFoundError("Link is not found");
    }
    return NextResponse.json(exclude(link, ["password"]));
  }
);

export const DELETE = withErrorHandler(
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

export const PUT = withErrorHandler(
  async (request: NextRequest, { params }: { params: Params }) => {
    const { id } = params;
    const newData = (await request.json()) as EditLink;
    const updatedLink = await editLink(id, newData);
    return NextResponse.json(
      { message: "Link edited", data: exclude(updatedLink, ["password"]) },
      { status: 200 }
    );
  }
);
