import { PrismaClient } from "@prisma/client";
import { PrismaClient as PrismaEdgeClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const global = globalThis as unknown as {
  prismaLocal: PrismaClient;
  prismaEdge: PrismaEdgeClient;
};

export const prismaLocalClient =
  global.prismaLocal ||
  new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

export const prismaEdgeClient =
  global.prismaEdge ||
  new PrismaEdgeClient({
    datasourceUrl: process.env.DATABASE_PROXY_URL,
  }).$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") {
  global.prismaLocal = prismaLocalClient;
  global.prismaEdge = prismaEdgeClient;
}
