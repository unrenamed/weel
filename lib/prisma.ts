import { PrismaClient } from "@prisma/client";
import { PrismaClient as PrismaEdgeClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as { prismaLocal: PrismaClient };
const globalForEdgePrisma = globalThis as unknown as {
  prismaEdge: PrismaClient;
};

export const prismaLocalClient =
  globalForPrisma.prismaLocal ||
  new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

export const prismaEdgeClient =
  globalForEdgePrisma.prismaEdge ||
  new PrismaEdgeClient({
    datasourceUrl: process.env.DATABASE_PROXY_URL,
  }).$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaLocal = prismaLocalClient;
  globalForEdgePrisma.prismaEdge = prismaEdgeClient;
}
