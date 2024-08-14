import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const saltRounds = 10;

async function insertUsers() {
  const users = [
    { username: 'Admin', password: 'BarberShop' },
    // Agrega más usuarios según sea necesario
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    await prisma.user.create({
      data: {
        username: user.username,
        password: hashedPassword,
      },
    });
    console.log(`Usuario ${user.username} insertado con contraseña hasheada.`);
  }
}

insertUsers()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
