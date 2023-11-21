import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withErrorHandler } from "@/lib/error";

type Params = {
  id: string;
};

export const PUT = withErrorHandler(
  async (request: NextRequest, { params }: { params: Params }) => {
    const { id } = params;
    const { archived } = (await request.json()) as {
      archived: boolean;
    };

    const link = await prisma.link.update({
      where: { id },
      data: { archived },
    });

    return !link
      ? NextResponse.json({ error: "Link is not found" }, { status: 404 })
      : NextResponse.json(link);
  }
);
