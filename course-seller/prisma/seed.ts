import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { title: "Course A", slug: "course-a", priceInCents: 4999 },
      { title: "Course B", slug: "course-b", priceInCents: 7999 },
    ],
    skipDuplicates: true,
  });
  console.log("Seeded products");
}

main().finally(() => prisma.$disconnect());
