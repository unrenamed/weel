import {
  getStats,
  isTinybirdApiEndpoint,
  isValidInterval,
} from "@/lib/analytics";
import { NextResponse, type NextRequest } from "next/server";
import {
  INTERVALS,
  LINK_HOST,
  TINYBIRD_API_ENDPOINTS,
} from "@/lib/constants";
import { Interval } from "@/lib/types";

type Params = {
  key: string;
  endpoint: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { key, endpoint } = params;
  const domain = LINK_HOST;
  const searchParams = request.nextUrl.searchParams;
  const interval = (searchParams.get("interval") as Interval) ?? undefined;

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

  try {
    return NextResponse.json(
      await getStats({
        key,
        endpoint,
        domain,
        interval,
      })
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    return NextResponse.json("Something went wrong when loading stats data", {
      status: 500,
    });
  }
}
