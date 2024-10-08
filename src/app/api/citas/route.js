// src/app/api/citas/route.js

import { NextResponse } from 'next/server';
import prisma from '../../../libs/db';

export async function GET() {
  try {
    const citas = await prisma.cita.findMany();
    return NextResponse.json(citas);
  } catch (error) {
    console.error('Error obteniendo citas:', error);
    return NextResponse.json({ error: 'Error interno del Servidor' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { clientName, date, services, specificServices, time, message } = await request.json();

    console.log('Datos recibidos route.js:', { clientName, date, services, specificServices, time, message });

    // Parse de la fecha y hora recibidas
    const receivedDate = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    receivedDate.setHours(hours, minutes);

    console.log('Fecha recibida:', receivedDate);

    // Calcular la duración de la cita basada en los servicios seleccionados
    let duration = 0;
    if (services.includes('corte')) {
      if (specificServices.includes('fade')) {
        duration += 30;
      } else {
        duration += 20;
      }
    }
    if (services.includes('depilacion')) {
      specificServices.forEach(service => {
        if (service === 'barba') {
          duration += 15;
        } else if (service === 'ceja') {
          duration += 10;
        } else if (service === 'axila') {
          duration += 10;
        } else if (service === 'piernas') {
          duration += 20;
        }
      });
    }
    if (services.includes('tinte')) {
      duration += 60;
    }
    if (services.includes('rayitos')) {
      duration += 240;
    }
    if (services.includes('maquillaje')) {
      duration += 60;
    }
    if (services.includes('peinado')) {
      duration += 60;
    }

    // Validar que la duración sea válida
    if (duration === 0) {
      throw new Error('Duración inválida para los servicios seleccionados');
    }

    // Calcular la fecha y hora de inicio y fin de la cita
    const startDate = new Date(receivedDate);
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + duration);

    // Validar que la cita esté dentro del horario laboral (17:00 - 21:00)
    const startBusinessHours = new Date(startDate);
    startBusinessHours.setHours(17, 0, 0); // 17:00

    const endBusinessHours = new Date(startDate);
    endBusinessHours.setHours(21, 0, 0); // 21:00

    if (startDate < startBusinessHours || endDate > endBusinessHours) {
      return NextResponse.json({ error: 'Horario no disponible' }, { status: 400 });
    }

    // Verificar si hay citas solapadas
    const overlappingAppointments = await prisma.cita.findMany({
      where: {
        AND: [
          {
            date: {
              gte: startDate.toISOString(), // Convertir a ISO string para comparación
            },
          },
          {
            date: {
              lt: endDate.toISOString(), // Convertir a ISO string para comparación
            },
          },
        ],
      },
    });

    if (overlappingAppointments.length > 0) {
      return NextResponse.json({ error: 'Horario no disponible' }, { status: 400 });
    }
    
    // Crear la nueva cita en la base de datos
    const newAppointment = await prisma.cita.create({
      data: {
        clientName,
        date: startDate.toISOString(), // Guardar como ISO string en la base de datos
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
    return NextResponse.json({ error: 'Error al crear la cita' }, { status: 500 });
  }
}
