import { NextResponse, type NextRequest } from "next/server";
import { deleteLink, editLink, findLink } from "@/lib/api/links";
import { EditLink } from "@/lib/types";
import { exclude } from "@/lib/utils";
import { withErrorHandler } from "@/lib/error";

type Params = {
  key: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { key } = params;
  const searchParams = request.nextUrl.searchParams;

  const domain = searchParams.get("domain");
  if (!domain) {
    return NextResponse.json({ error: "Domain is missing" }, { status: 400 });
  }

  const link = await findLink(domain, key);
  if (!link) {
    return NextResponse.json({ error: "Link is not found" }, { status: 404 });
  }

  return NextResponse.json(link);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { key } = params;
  const searchParams = request.nextUrl.searchParams;

  const domain = searchParams.get("domain");
  if (!domain) {
    return NextResponse.json({ error: "Domain is missing" }, { status: 400 });
  }

  await deleteLink(domain, key);
  return NextResponse.json({ message: "Link deleted" });
}

export const PATCH = withErrorHandler(
  async (request: NextRequest, { params }: { params: Params }) => {
    const { key } = params;
    const searchParams = request.nextUrl.searchParams;

    const domain = searchParams.get("domain");
    if (!domain) {
      return NextResponse.json({ error: "Domain is missing" }, { status: 400 });
    }
    
    const newData = (await request.json()) as EditLink;
    const updatedLink = await editLink(key, domain, newData);
    return NextResponse.json(
      { message: "Link edited", data: exclude(updatedLink, ["password"]) },
      { status: 200 }
    );
  }
);
