// src/app/api/citas/route.js

import { NextResponse } from 'next/server';
import prisma from '../../../libs/db';

export async function GET() {
  try {
    const citas = await prisma.cita.findMany();
    return NextResponse.json(citas);
  } catch (error) {
    console.error('Error fetching citas:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { clientName, date, services, specificServices, time, message } = await request.json();

    console.log('Datos recibidos route.js:', { clientName, date, services, specificServices, time, message });

    // Lógica para calcular la duración basada en los servicios y servicios específicos
    let duration = 0;
    if (services.includes('corte')) {
      if (specificServices.includes('fade')) {
        duration += 30; // Por ejemplo, 30 minutos para un fade
      } else {
        duration += 20; // Otro tipo de corte, por ejemplo
      }
    }
    if (services.includes('depilación')) {
      duration += 40; // Por ejemplo, 40 minutos para una depilación
    }

    // Verifica si la duración es válida
    if (duration === 0) {
      throw new Error('Duración inválida para los servicios seleccionados');
    }

    const newAppointment = await prisma.cita.create({
      data: {
        clientName,
        date: new Date(date),
        services: { set: services },
        specificServices: { set: specificServices },
        time,
        message,
        duration, // Añadir la duración calculada
      },
    });

    return NextResponse.json(newAppointment);
  } catch (error) {
    console.error('Error creando la cita:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
