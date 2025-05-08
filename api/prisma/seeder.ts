import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const salt = bcrypt.genSaltSync();
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: bcrypt.hashSync(this.password, salt),
      name: 'Super Admin',
    },
  });

  console.log('Seeded Admin:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
