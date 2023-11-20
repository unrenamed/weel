import { NextResponse, type NextRequest } from "next/server";
import { deleteLink, editLink, findLink } from "@/lib/api/links";
import { EditLink } from "@/lib/types";
import { BaseError } from "@/lib/error/base-error";
import { exclude } from "@/lib/utils";

type Params = {
  key: string;
};

export async function GET(_: NextRequest, { params }: { params: Params }) {
  const { key } = params;
  const domain = process.env.APP_LINK_DOMAIN; // TODO: fix after u introduce custom domains

  const link = await findLink(domain, key);
  if (!link) {
    return NextResponse.json({ error: "Link is not found" }, { status: 404 });
  }

  return NextResponse.json(link);
}

export async function DELETE(_: NextRequest, { params }: { params: Params }) {
  const { key } = params;
  const domain = process.env.APP_LINK_DOMAIN; // TODO: fix after u introduce custom domains
  await deleteLink(domain, key);
  return NextResponse.json({ message: "Link deleted" });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { key } = params;
  const domain = process.env.APP_LINK_DOMAIN; // TODO: fix after u introduce custom domains
  const newData = (await request.json()) as EditLink;

  try {
    const updatedLink = await editLink(key, domain, newData);
    return NextResponse.json(
      { message: "Link edited", data: exclude(updatedLink, ["password"]) },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof BaseError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.statusCode }
      );
    }
  }
}
