import {
  getStats,
  isTinybirdApiEndpoint,
  isValidInterval,
} from "@/lib/analytics";
import { NextResponse, type NextRequest } from "next/server";
import { INTERVALS, TINYBIRD_API_ENDPOINTS } from "@/lib/constants";
import { Interval } from "@/lib/types";
import { withError } from "@/lib/handlers";
import { LinkStatsLoadingError } from "@/lib/error";

type Params = {
  endpoint: string;
};

export const GET = withError(
  async (request: NextRequest, { params }: { params: Params }) => {
    const { endpoint } = params;
    const searchParams = request.nextUrl.searchParams;

    const domain = searchParams.get("domain");
    const key = searchParams.get("key");
    const interval = (searchParams.get("interval") as Interval) ?? "24h";

    if (!domain || !key) {
      return NextResponse.json(
        { error: "Domain or key is missing" },
        { status: 400 }
      );
    }

    if (!isTinybirdApiEndpoint(endpoint)) {
      const supportedEndpoints = Object.values(TINYBIRD_API_ENDPOINTS).join(
        ", "
      );
      const error = `The endpoint '${endpoint}' is not supported. Supported endpoints include: ${supportedEndpoints}`;
      return NextResponse.json({ error }, { status: 404 });
    }

    if (interval && !isValidInterval(interval)) {
      const supportedIntervals = Object.values(INTERVALS).join(", ");
      const error = `The interval '${interval}' is not supported. Supported values include: ${supportedIntervals}`;
      return NextResponse.json({ error }, { status: 404 });
    }

    try {
      return NextResponse.json(
        await getStats({
          key,
          domain,
          interval,
          endpoint,
        })
      );
    } catch (err) {
      if (err instanceof Error) {
        throw new LinkStatsLoadingError(err.message);
      } else {
        throw new LinkStatsLoadingError(
          "Something went wrong when fetching link stats data!"
        );
      }
    }
  }
);
