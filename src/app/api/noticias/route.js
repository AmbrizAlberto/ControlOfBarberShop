// src/app/api/noticias/route.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/libs/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const news = await prisma.news.findMany({
            include: {
                author: {
                    select: {
                        username: true,
                    },
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
        const { title, description } = await request.json();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            throw new Error('User session not found');
        }

        const userId = session.user.id;

        console.log('Session:', session);  // Añadir este log para verificar la sesión completa
        console.log('User ID:', userId);  // Añadir este log para verificar el userId

        if (!userId) {
            throw new Error('User ID not found in session');
        }

        const newNotice = await prisma.news.create({
            data: {
                title,
                description,
                author: {
                    connect: { id: userId },
                },
            },
            include: {
                author: {
                    select: {
                        username: true,
                    },
                },
            },
        });

        return NextResponse.json(newNew);
    } catch (error) {
        console.error('Error creating notice:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}