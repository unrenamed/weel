import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
  var prisma: any | undefined;
}

const prisma = new PrismaClient().$extends(withAccelerate());

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
