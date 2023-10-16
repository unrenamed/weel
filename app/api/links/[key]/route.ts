import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { LINK_HOST } from "@/lib/constants";

type Params = {
  key: string;
};

export async function GET(_: NextRequest, { params }: { params: Params }) {
  const { key } = params;
  const domain = LINK_HOST; // TODO: fix after u introduce custom domains

  const link = await prisma.link.findUnique({
    where: { domain_key: { domain, key } },
  });

  if (!link) {
    return NextResponse.json({ error: "Link is not found" }, { status: 404 });
  }

  return NextResponse.json(link);
}
