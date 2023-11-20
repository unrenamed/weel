import {
  getStats,
  isTinybirdApiEndpoint,
  isValidInterval,
} from "@/lib/analytics";
import { NextResponse, type NextRequest } from "next/server";
import { INTERVALS, TINYBIRD_API_ENDPOINTS } from "@/lib/constants";
import { Interval } from "@/lib/types";
import { withErrorHandler } from "@/lib/error";

type Params = {
  key: string;
  endpoint: string;
};

export const GET = withErrorHandler(
  async (request: NextRequest, { params }: { params: Params }) => {
    const { key, endpoint } = params;
    const searchParams = request.nextUrl.searchParams;

    const interval = (searchParams.get("interval") as Interval) ?? undefined;

    const domain = searchParams.get("domain");
    if (!domain) {
      return NextResponse.json({ error: "Domain is missing" }, { status: 400 });
    }

    if (!isTinybirdApiEndpoint(endpoint)) {
      return NextResponse.json(
        {
          error: `The endpoint '${endpoint}' is not supported. Supported endpoints include: ${Object.values(
            TINYBIRD_API_ENDPOINTS
          ).join(", ")}`,
        },
        { status: 404 }
      );
    }

    if (interval && !isValidInterval(interval)) {
      return NextResponse.json(
        {
          error: `The interval '${interval}' is not supported. Supported values include: ${Object.values(
            INTERVALS
          ).join(", ")}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      await getStats({
        key,
        endpoint,
        domain,
        interval,
      })
    );
  }
);
