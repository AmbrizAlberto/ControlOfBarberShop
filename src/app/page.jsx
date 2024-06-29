// srcapp/page.jsx

'use client'

import React, { useState } from 'react';

function ClientView() {
  const [clientName, setClientName] = useState('');
  const [date, setDate] = useState('');
  const [services, setServices] = useState([]);
  const [specificServices, setSpecificServices] = useState([]);
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');

  const handleServiceChange = (e) => {
    const selectedService = e.target.value;
    if (services.includes(selectedService)) {
      setServices(services.filter(service => service !== selectedService));
    } else {
      setServices([...services, selectedService]);
    }
  };

  const handleSpecificServiceChange = (e) => {
    const selectedSpecificService = e.target.value;
    if (specificServices.includes(selectedSpecificService)) {
      setSpecificServices(specificServices.filter(service => service !== selectedSpecificService));
    } else {
      setSpecificServices([...specificServices, selectedSpecificService]);
    }
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleSubmit = async () => {
    try {
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
        throw new Error('Error al crear la cita');
      }
  
      const data = await res.json();
      console.log('Respuesta del servidor:', data);
    } catch (error) {
      console.error('Error al crear la cita:', error);
    }
  };
  
  

  return (
    <div className="client-view">
      <h1>Agenda tu cita</h1>

      <div className="">
        Tu nombre:
        <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Nombre Completo" />
      </div>

      <div className="fecha">
        <label>Selecciona el día de la cita:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="selectores">
        <label>Selecciona el servicio:</label>
        <div>
          <label>
            <input type="checkbox" value="corte" onChange={handleServiceChange} checked={services.includes('corte')} />
            Corte
          </label>
          <br />
          <label>
            <input type="checkbox" value="depilacion" onChange={handleServiceChange} checked={services.includes('depilacion')} />
            Depilación
          </label>
        </div>
      </div>

      {(services.includes('corte') || services.includes('depilacion')) && (
        <div className="specific-service">
          <div>
            {services.includes('corte') && (
              <>
                <label>Selecciona el tipo de corte</label>
                <br />
                <label>
                  <input type="checkbox" value="fade" onChange={handleSpecificServiceChange} checked={specificServices.includes('fade')} />
                  Corte Fade
                </label>
                <br />
                <label>
                  <input type="checkbox" value="dama" onChange={handleSpecificServiceChange} checked={specificServices.includes('dama')} />
                  Corte Dama
                </label>
                <br />
                <label>
                  <input type="checkbox" value="tradicional" onChange={handleSpecificServiceChange} checked={specificServices.includes('tradicional')} />
                  Corte Tradicional
                </label>
                <br />
              </>
            )}
            {services.includes('depilacion') && (
              <>
                <label>Selecciona el tipo de depilación</label>
                <br />
                <label>
                  <input type="checkbox" value="bigote" onChange={handleSpecificServiceChange} checked={specificServices.includes('bigote')} />
                  Depilación de Bigote
                </label>
                <br />
                <label>
                  <input type="checkbox" value="ceja" onChange={handleSpecificServiceChange} checked={specificServices.includes('ceja')} />
                  Depilación de Ceja
                </label>
                <br />
                <label>
                  <input type="checkbox" value="axila" onChange={handleSpecificServiceChange} checked={specificServices.includes('axila')} />
                  Depilación de Axila
                </label>
                <br />
                <label>
                  <input type="checkbox" value="piernas" onChange={handleSpecificServiceChange} checked={specificServices.includes('piernas')} />
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
          <option value="17:00">17:00</option>
          <option value="17:30">17:30</option>
          <option value="18:00">18:00</option>
          <option value="18:30">18:30</option>
          <option value="19:00">19:00</option>
          <option value="19:30">19:30</option>
          <option value="20:00">20:00</option>
          <option value="20:30">20:30</option>
        </select>
      </div>

      <div>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Mensaje" />
      </div>

      <div className="button">
        <button onClick={handleSubmit}>Agendar</button>
      </div>
    </div>
  );
}

export default ClientView;
