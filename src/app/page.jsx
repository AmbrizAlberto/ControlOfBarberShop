// src/app/page.jsx

'use client';

import React, { useState, useEffect } from 'react';
import Modal from './components/Modal';
import "../../public/css/client.css"

function ClientView() {
  const [clientName, setClientName] = useState('');
  const [date, setDate] = useState('');
  const [services, setServices] = useState([]);
  const [specificServices, setSpecificServices] = useState([]);
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const res = await fetch('/api/citas');
        const citas = await res.json();
        const citasOnSelectedDate = citas.filter(cita => new Date(cita.date).toDateString() === new Date(date).toDateString());

        const bookedTimes = citasOnSelectedDate.map(cita => {
          const startTime = new Date(cita.date).toTimeString().substring(0, 5);
          const endTime = new Date(new Date(cita.date).getTime() + cita.duration * 60000).toTimeString().substring(0, 5);
          return { startTime, endTime };
        });

        const allTimes = [
          '17:00', '17:30', '18:00', '18:30',
          '19:00', '19:30', '20:00', '20:30'
        ];

        const availableTimes = allTimes.filter(time => {
          const [hours, minutes] = time.split(':').map(Number);
          const timeDate = new Date(new Date(date).setHours(hours, minutes));

          return !bookedTimes.some(({ startTime, endTime }) => {
            const startTimeDate = new Date(new Date(date).setHours(...startTime.split(':').map(Number)));
            const endTimeDate = new Date(new Date(date).setHours(...endTime.split(':').map(Number)));
            return timeDate >= startTimeDate && timeDate < endTimeDate;
          });
        });

        setAvailableTimes(availableTimes);
      } catch (error) {
        console.error('Error fetching citas:', error);
      }
    };

    if (date) {
      fetchCitas();
    }
  }, [date]);

  const handleCorteSpecificServiceChange = (e) => {
    const selectedSpecificService = e.target.value;
    if (selectedSpecificService === 'fade') {
      setSpecificServices(['fade']);
    } else if (selectedSpecificService === 'tradicional') {
      setSpecificServices(['tradicional']);
    } else {
      setSpecificServices([]);
    }
  };

  const handleDepilacionSpecificServiceChange = (e) => {
    const selectedSpecificService = e.target.value;
    if (specificServices.includes(selectedSpecificService)) {
      setSpecificServices(specificServices.filter(service => service !== selectedSpecificService));
    } else {
      setSpecificServices([...specificServices, selectedSpecificService]);
    }
  };

  const handleServiceChange = (e) => {
    const selectedService = e.target.value;

    if (services.includes(selectedService)) {
      setServices(services.filter(service => service !== selectedService));
      // Al cambiar el servicio, resetea los servicios específicos seleccionados
      setSpecificServices([]);
    } else {
      setServices([...services, selectedService]);
      // Al cambiar el servicio, no resetea los servicios específicos seleccionados
    }
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setClientName('');
    setDate('');
    setServices([]);
    setSpecificServices([]);
    setTime('');
    setMessage('');
    window.location.reload(); // Esto debería manejarse de otra forma más elegante en una aplicación real
  };

  const handleSubmit = async () => {
    setError('');
    try {
      if (!clientName || !date || services.length === 0 || !time) {
        throw new Error('Completa todos los campos');
      }

      const newAppointment = {
        clientName,
        date: new Date(date).toISOString(),
        services,
        specificServices,
        time,
        message,
      };

      console.log('Enviando solicitud POST a la api con los siguientes datos:', newAppointment);

      const res = await fetch('/api/citas', {
        method: 'POST',
        body: JSON.stringify(newAppointment),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al crear la cita');
      }

      const data = await res.json();
      console.log('Respuesta del servidor:', data);

      setModalMessage('Cita Agendada');
      setShowModal(true);
    } catch (error) {
      setError(error.message);
      console.error('Error al crear la cita:', error);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  // Función para manejar la alerta para el servicio "rayitos"
  const handleRayitosAlert = () => {
    if (services.includes('rayitos')) {
      alert("Se recomienda hacer llamada telefónica para asegurar la cita de 'Rayitos' ya que el tiempo del servicio es de 4 horas.");
    }
  };

  return (
    <div className="client-view">
      
      <h1>Agenda tu cita</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="name">
        <p>Tu nombre:</p>
        <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Nombre Completo" />
      </div>

      <div className="fecha">
        <p><label>Selecciona el día de la cita:</label></p>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={today} />
      </div>

      <div className="selectores">
        <p><label>Selecciona el servicio:</label></p>
        <div className='servicios'>
          <label>
            <input type="checkbox" value="corte" onChange={handleServiceChange} checked={services.includes('corte')} />
            Corte
          </label>
          <br />
          <label>
            <input type="checkbox" value="depilacion" onChange={handleServiceChange} checked={services.includes('depilacion')} />
            Depilación
          </label>
          <br />
          <label>
            <input type="checkbox" value="tinte" onChange={handleServiceChange} checked={services.includes('tinte')} />
            Tinte
          </label>
          <br />
          <label>
            <input type="checkbox" value="rayitos" onChange={handleServiceChange} checked={services.includes('rayitos')} onClick={handleRayitosAlert} />
            Rayitos
          </label>
          <br />
          <label>
            <input type="checkbox" value="maquillaje" onChange={handleServiceChange} checked={services.includes('maquillaje')} />
            Maquillaje
          </label>
          <br />
          <label>
            <input type="checkbox" value="peinado" onChange={handleServiceChange} checked={services.includes('peinado')} />
            Peinado
          </label>
        </div>
      </div>

      {(services.includes('corte') || services.includes('depilacion')) && (
        <div className="specific-service">
          <div>
            {services.includes('corte') && (
              <>
                <label>Selecciona el tipo de corte (elige uno):</label>
                <br />
                <label>
                  <input type="checkbox" value="fade" onChange={handleCorteSpecificServiceChange} checked={specificServices.includes('fade')} />
                  Corte Fade
                </label>
                <br />
                <label>
                  <input type="checkbox" value="tradicional" onChange={handleCorteSpecificServiceChange} checked={specificServices.includes('tradicional')} />
                  Corte Tradicional
                </label>
                <br />
              </>
            )}
            {services.includes('depilacion') && (
              <>
                <label>Selecciona el tipo de depilación (puedes seleccionar varios):</label>
                <br />
                <label>
                  <input type="checkbox" value="barba" onChange={handleDepilacionSpecificServiceChange} checked={specificServices.includes('barba')} />
                  Depilación de Barba
                </label>
                <br />
                <label>
                  <input type="checkbox" value="ceja" onChange={handleDepilacionSpecificServiceChange} checked={specificServices.includes('ceja')} />
                  Depilación de Ceja
                </label>
                <br />
                <label>
                  <input type="checkbox" value="axila" onChange={handleDepilacionSpecificServiceChange} checked={specificServices.includes('axila')} />
                  Depilación de Axila
                </label>
                <br />
                <label>
                  <input type="checkbox" value="piernas" onChange={handleDepilacionSpecificServiceChange} checked={specificServices.includes('piernas')} />
                  Depilación de Piernas
                </label>
                <br />
              </>
            )}
          </div>
        </div>
      )}

      <div className="hora">
        <label>Selecciona la hora:</label>
        <select onChange={handleTimeChange} value={time}>
          <option value="">--Seleccionar--</option>
          {availableTimes.map((timeOption) => (
            <option key={timeOption} value={timeOption}>{timeOption}</option>
          ))}
        </select>
      </div>

      <div className="mensaje">
        Mensaje (opcional):  
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Mensaje adicional" />
      </div>

      <button onClick={handleSubmit}>Enviar</button>

      <Modal isOpen={showModal} onClose={handleCloseModal} message={modalMessage} />
    </div>
  );
}

export default ClientView;
