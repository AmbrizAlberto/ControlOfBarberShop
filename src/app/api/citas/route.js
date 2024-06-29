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

    let duration = 0;
    if (services.includes('corte')) {
      if (specificServices.includes('fade')) {
        duration += 30;
      } else {
        duration += 20;
      }
    }
    if (services.includes('depilacion')) {
      if (specificServices.includes('barba')) {
        duration += 15;
      }
      if (specificServices.includes('piernas')) {
        duration += 20;
      }
      duration += 10;
    }

    if (duration === 0) {
      throw new Error('Duración inválida para los servicios seleccionados');
    }

    const startDate = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    startDate.setHours(hours, minutes);

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + duration);

    // Validación de horario laboral (17:00 - 20:30)
    const startBusinessHours = new Date(startDate);
    startBusinessHours.setHours(17, 0, 0); // 17:00

    const endBusinessHours = new Date(startDate);
    endBusinessHours.setHours(20, 30, 0); // 20:30

    if (startDate < startBusinessHours || endDate > endBusinessHours) {
      return NextResponse.json({ error: 'Horario no disponible' }, { status: 400 });
    }

    const overlappingAppointments = await prisma.cita.findMany({
      where: {
        AND: [
          { date: { gte: startDate } },
          { date: { lt: endDate } },
        ],
      },
    });

    if (overlappingAppointments.length > 0) {
      return NextResponse.json({ error: 'Horario no disponible' }, { status: 400 });
    }

    const newAppointment = await prisma.cita.create({
      data: {
        clientName,
        date: startDate,
        services: { set: services },
        specificServices: { set: specificServices },
        time,
        message,
        duration,
      },
    });

    return NextResponse.json(newAppointment);
  } catch (error) {
    console.error('Error creando la cita:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
