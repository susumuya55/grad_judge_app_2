import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Put it in api/.env");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const password = "password";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.host.createMany({
    data: [
      { name: "test_teacher", email: "test_teacher@example.com", passwordHash },
      { name: "test_developer", email: "test_developer@example.com", passwordHash },
    ],
    skipDuplicates: true,
  });

  console.log("✅ MVP host seed inserted");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
