const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const saltRounds = 10;

async function insertUsers() {
  const users = [
    { username: 'Ada', password: 'esteticamatiz' },
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
