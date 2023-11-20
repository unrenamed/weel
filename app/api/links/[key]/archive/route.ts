import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

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
  const searchParams = request.nextUrl.searchParams;
  
  const domain = searchParams.get("domain");
  if (!domain) {
    return NextResponse.json({ error: "Domain is missing" }, { status: 400 });
  }

  const { archived } = (await request.json()) as Body;
  
  const link = await prisma.link.update({
    where: { domain_key: { domain, key } },
    data: { archived },
  });

  if (!link) {
    return NextResponse.json({ error: "Link is not found" }, { status: 404 });
  }

  return NextResponse.json(link);
}
