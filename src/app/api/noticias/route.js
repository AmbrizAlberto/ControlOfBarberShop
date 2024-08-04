// src/app/api/noticias/route.js

import prisma from '@/libs/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      where: {
        endDate: {
          gte: new Date(), // Solo traer noticias que no hayan expirado
        },
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, description, startDate, endDate } = await request.json();

    const newNotice = await prisma.news.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json(newNotice);
  } catch (error) {
    console.error('Error creating notice:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
