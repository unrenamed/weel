import { NextRequest, NextResponse } from "next/server";
import { ZodTypeAny } from "zod";

export function withSchema<T extends ZodTypeAny>(schema: T) {
  return (fn: Function) =>
    async (request: NextRequest, ...args: any) => {
      let body;
      try {
        body = await request.json();
      } catch (err) {
        return NextResponse.json(
          { error: "Missing or invalid body object" },
          { status: 400 }
        );
      }

      const validation = schema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          {
            error: "Invalid request",
            errors: validation.error.errors,
          },
          { status: 400 }
        );
      }

      return await fn(request, validation.data, ...args);
    };
}
