// src/app/api/login/route.js

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const secret = 'your-secret-key'; // Usa una clave secreta para JWT

export async function POST(req) {
  const { username, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  }

  const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });

  return new Response(
    JSON.stringify({ success: true, token }),
    { status: 200 }
  );
}
