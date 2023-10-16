import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { parse } from "../utils";

export const AppMiddleware = async (req: NextRequest, ev: NextFetchEvent) => {
  const { path } = parse(req);
  return NextResponse.rewrite(
    new URL(`/dashboard${path === "/" ? "" : path}`, req.url)
  );
};
