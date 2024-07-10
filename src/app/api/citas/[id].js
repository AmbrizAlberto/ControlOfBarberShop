// src/app/api/citas/[id].js

import { NextResponse } from 'next/server';
import prisma from '../../../libs/db';

export async function DELETE(request) {
  try {
    const { id } = request.params; // Obtén el id del parámetro de la URL

    if (!id) {
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 });
    }

    await prisma.cita.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Cita eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando la cita:', error);
    return NextResponse.json({ error: 'Error interno del Servidor' }, { status: 500 });
  }
}
