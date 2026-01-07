import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = 'password';
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.host.createMany({
    data: [
      {
        name: 'test_teacher',
        email: 'test_teacher@example.com',
        passwordHash,
      },
      {
        name: 'test_developer',
        email: 'test_developer@example.com',
        passwordHash,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ MVP host seed data inserted');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
