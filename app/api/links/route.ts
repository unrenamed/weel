import { createLink, deleteLink } from "@/lib/api/links";
import { CreateLink, DeleteLink } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const linkDetails = (await request.json()) as CreateLink;
  const response = createLink(linkDetails);
  return NextResponse.json(response);
}

export async function DELETE(request: Request) {
  const { domain, key } = (await request.json()) as DeleteLink;
  const response = deleteLink(domain, key);
  return NextResponse.json(response);
}
