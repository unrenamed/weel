import { PrismaClient, Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const generateLinks = () =>
  [...Array(10_000)].map((_) => {
    const lastClicked = faker.date.past();
    const updatedAt = faker.date.past({ refDate: lastClicked });
    const createdAt = faker.date.past({ refDate: updatedAt });

    return {
      id: faker.string.nanoid({ min: 25, max: 35 }),
      domain: "weel.vercel.app",
      key: faker.string.alphanumeric({ length: { min: 5, max: 10 } }),
      url: faker.internet.url(),
      ios: faker.internet.url(),
      android: faker.internet.url(),
      archived: faker.datatype.boolean(0.75),
      expiresAt:
        faker.helpers.maybe(() => faker.date.future(), {
          probability: 0.35,
        }) ?? null,
      password:
        faker.helpers.maybe(() => faker.internet.password({ length: 20 }), {
          probability: 0.5,
        }) ?? null,
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      totalClicks: faker.number.int({ min: 1, max: 100000 }),
      geo:
        (faker.helpers.maybe(
          () => {
            let geoObject: { [key: string]: string } = {};
            for (const _ of Array(faker.number.int({ min: 1, max: 10 }))) {
              geoObject[faker.location.country()] = faker.internet.url();
            }
            return geoObject;
          },
          {
            probability: 0.3,
          }
        ) as Prisma.JsonObject) ?? null,
      lastClicked,
      createdAt,
      updatedAt,
    };
  });

async function main() {
  console.log(`Start seeding 🌱`);

  await prisma.link.deleteMany();
  console.log(`Deleted records in link table 🚮`);

  await prisma.$queryRaw`ALTER TABLE Link AUTO_INCREMENT = 1`;
  console.log(`Reset link auto increment to 1 ♻️`);

  await prisma.link.createMany({ data: generateLinks() });
  console.log(`Added link data ✅`);

  console.log(`Seeding finished 🏁`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
