// src/pages/Dashboard.js

"use client"

import React, { useEffect, useState } from 'react';
import "../../../public/css/dashb.css";
import Modal from '../../components/Modal';

function Dashboard() {
  const [citas, setCitas] = useState([]);
  const [citaToDelete, setCitaToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchCitas = async () => {
    try {
      const res = await fetch('/api/citas');
      const citasData = await res.json();
      setCitas(citasData);
    } catch (error) {
      console.error('Error buscando citas:', error);
    }
  };

  const deleteCita = async (id) => {
    try {
      const res = await fetch(`/api/citas/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCitas(citas.filter(cita => cita.id !== id));
        setShowModal(false);
      } else {
        console.error('Error eliminando la cita:', await res.json());
      }
    } catch (error) {
      console.error('Error eliminando la cita:', error);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  return (
    <div className='main'>
      <div className='Left'>
        <div className='NewsCreat'>
          <h1>Filtros</h1>
        </div>
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
                <th>Acciones</th>
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
                  <td>
                    <button onClick={() => { setCitaToDelete(cita.id); setShowModal(true); }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => deleteCita(citaToDelete)}
      />
    </div>
  );
}

export default Dashboard;
