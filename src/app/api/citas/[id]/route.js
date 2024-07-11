// src/app/citas/[id]/route.js

import { NextResponse } from "next/server";
import prisma from "../../../../libs/db";

export async function GET(request, { params }) {
    const cita = await prisma.cita.findUnique({
        where: {
            id: Number(params.id),
        },
    });
    return NextResponse.json(cita);
}

export async function PUT(request, { params }) {
    try {
        const citaId = Number(params.id);
        if (isNaN(citaId)) {
            return NextResponse.json({ error: "Invalid cita ID" }, { status: 400 });
        }

        const body = await request.json();
        const updatedCita = await prisma.cita.update({
            where: {
                id: citaId,
            },
            data: body,
        });

        return NextResponse.json(updatedCita);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const citaId = Number(params.id);
        if (isNaN(citaId)) {
            return NextResponse.json({ error: "Invalid cita ID" }, { status: 400 });
        }

        await prisma.cita.delete({
            where: {
                id: citaId,
            },
        });

        return NextResponse.json({ message: `Cita ${citaId} deleted successfully` });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}