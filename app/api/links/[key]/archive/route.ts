import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { LINK_HOST } from "@/lib/constants";

type Params = {
  key: string;
};

type Body = {
  archived: boolean;
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { key } = params;
  const { archived } = (await request.json()) as Body;
  const domain = LINK_HOST; // TODO: fix after u introduce custom domains

  const link = await prisma.link.update({
    where: { domain_key: { domain, key } },
    data: { archived },
  });

  if (!link) {
    return NextResponse.json({ error: "Link is not found" }, { status: 404 });
  }

  return NextResponse.json(link);
}
