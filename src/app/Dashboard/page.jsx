"use client"

import React, { useEffect, useState } from 'react';
import "../../../public/css/dashb.css";

function Dashboard() {
  const [citas, setCitas] = useState([]);

  const fetchCitas = async () => {
    try {
      const res = await fetch('/api/citas');
      const citasData = await res.json();
      setCitas(citasData);
    } catch (error) {
      console.error('Error buscando citas:', error);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  return (
    <div className='main'>
      <div className='Left'>
        <div className='NewsCreat'>
          <h1>Subir noticia</h1>
        </div>
      </div>
      <div className='Right'>
        <div className='ListContainer'>
          <h1>Lista de citas</h1>
          <table className='citasTable'>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Horario de la cita</th>
                <th>Servicio</th>
                <th>Tiempo de Servicio</th>
                <th>Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita) => (
                <tr key={cita.id}>
                  <td>{cita.clientName}</td>
                  <td>{new Date(cita.date).toLocaleString()}</td>
                  <td>{cita.services.join(', ')}</td>
                  <td>{cita.duration} minutos</td>
                  <td>{cita.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
