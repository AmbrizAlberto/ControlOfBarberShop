/* src/app/Dashboard/page.jsx */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';
import "../../../public/css/dashb.css";
import "../../../public/css/responsiveDB.css";
import Modal from '../components/Modal';
import Clock from '../components/Clock';

function Dashboard() {

  const [citas, setCitas] = useState([]);
  const [citaToDelete, setCitaToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [searchName, setSearchName] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleCreateNews = async () => {
    try {
      const res = await fetch('/api/noticias', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          startDate,
          endDate,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        // Noticia creada con éxito, puedes actualizar el estado o mostrar un mensaje
      } else {
        console.error('Error creando la noticia:', await res.json());
      }
    } catch (error) {
      console.error('Error creando la noticia:', error);
    }
  };
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        jwt.verify(token, 'your-secret-key'); // Cambia 'your-secret-key' por la misma clave usada en el backend
        setAuthorized(true);
        console.log('Token verificado'); // Log de verificación exitosa
      } catch (e) {
        console.error('Error verificando token:', e);
        // router.push('/Login?error=token_invalid'); // Comentar para pruebas
      }
    } else {
      console.log('Token no encontrado, redirigiendo al login');
      router.push('/Login');
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    const hasReloaded = localStorage.getItem('hasReloaded');
    if (!hasReloaded) {
      localStorage.setItem('hasReloaded', 'true');
      window.location.reload();
    }
  }, []);


  const deleteCita = async (id) => {
    try {
      const res = await fetch(`/api/citas/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCitas(citas.filter(cita => cita.id !== id)); // Actualiza el estado eliminando la cita eliminada
        setShowModal(false); // Cierra el modal después de eliminar
      } else {
        console.error('Error eliminando la cita:', await res.json());
      }
    } catch (error) {
      console.error('Error eliminando la cita:', error);
    }
  };

  const filteredCitas = citas.filter(cita => {
    const matchesDate = selectedDate ? new Date(cita.date).toISOString().slice(0, 10) === selectedDate : true;
    const matchesService = selectedService ? cita.services.includes(selectedService) : true;
    const matchesName = searchName ? cita.clientName.toLowerCase().includes(searchName.toLowerCase()) : true;
    return matchesDate && matchesService && matchesName;
  });

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token del localStorage
    localStorage.removeItem('hasReloaded'); // Elimina la marca de recarga para futuros inicios de sesión
    router.push('/Login'); // Redirige al login
  };

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setSelectedDate(today);
  }, []);

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
  }, [authorized]);

  return (
    <div className='main'>
      <Clock />
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          if (citaToDelete !== null) {
            deleteCita(citaToDelete);
            setCitaToDelete(null); // Reinicia el estado de citaToDelete después de eliminar
          }
        }}
      />
      <div className='Left'>
        <div className='Filtros'>
        <button onClick={handleLogout} className="logoutButton">Cerrar Sesión</button> {/* Botón de cerrar sesión */}
          <h1>Filtros</h1>
          <div className='filtro'>
            <label htmlFor="dateFilter">Fecha</label>
            <input type="date" id="dateFilter" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </div>
          <div className='filtro'>
            <label htmlFor="serviceFilter">Servicio</label>
            <select id="serviceFilter" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
              <option value="">Selecciona un servicio</option>
              <option value="corte">Corte</option>
              <option value="depilacion">Depilación</option>
              <option value="tinte">Tinte</option>
              <option value="rayitos">Rayitos</option>
              <option value="maquillaje">Maquillaje</option>
              <option value="peinado">Peinado</option>
            </select>
          </div>
          <div className='filtro'>
            <label htmlFor="nameFilter">Nombre</label>
            <input type="text" id="nameFilter" value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="Buscar por nombre" />
          </div>
        </div>
        <div className="NewsCreat">
          <h1>Subir noticia</h1>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de la Noticia"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción de la Noticia"
          />
          <h2>Fecha de inicio de Noticia:</h2>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <p></p>
          <h2>Fecha de cierre de Noticia:</h2>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button onClick={handleCreateNews}>Crear Noticia</button>
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
              {filteredCitas.map((cita) => (
                <tr key={cita.id}>
                  <td>{cita.clientName}</td>
                  <td>{new Date(cita.date).toLocaleString()}</td>
                  <td>{cita.services.join(', ')}</td>
                  <td>{cita.duration} minutos</td>
                  <td>{cita.message}</td>
                  <td>
                    <button
                      type="button"
                      onClick={async () => {
                        await deleteCita(cita.id);
                      }}
                      className="btndeletecita"
                    >
                      Borrar
                    </button>
                  </td>
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