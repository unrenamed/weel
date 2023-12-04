import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { parse } from "../utils";

export const AppMiddleware = async (req: NextRequest, ev: NextFetchEvent) => {
  const { fullPath } = parse(req);
  return NextResponse.rewrite(
    new URL(`/dashboard${fullPath === "/" ? "" : fullPath}`, req.url)
  );
};
