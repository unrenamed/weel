import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { deleteLink, editLink } from "@/lib/api/links";
import { EditLink } from "@/lib/types";

type Params = {
  key: string;
};

export async function GET(_: NextRequest, { params }: { params: Params }) {
  const { key } = params;
  const domain = process.env.APP_LINK_DOMAIN; // TODO: fix after u introduce custom domains

  const link = await prisma.link.findUnique({
    where: { domain_key: { domain, key } },
  });

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
  const updatedLink = await editLink(key, domain, newData);
  if (!updatedLink) {
    return NextResponse.json({ error: "Link is not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Link edited" });
}
