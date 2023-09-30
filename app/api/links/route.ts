import { createLink, deleteLink } from "@/lib/api/links";
import { CreateLink, DeleteLink } from "@/lib/types";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const linkDetails = (await request.json()) as CreateLink;
  const response = createLink(linkDetails);
  return NextResponse.json(response);
}

export async function DELETE(request: NextRequest) {
  const { domain, key } = (await request.json()) as DeleteLink;
  const response = deleteLink(domain, key);
  return NextResponse.json(response);
}
