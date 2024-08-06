// src/app/page.jsx

'use client';

import React, { useState, useEffect } from 'react';
import Modal from './components/Modal';
import "../../public/css/client.css"
import "../../public/css/checkboxclient.css"

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
  const [news, setNews] = useState([]);

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
        console.error('Error buscando citas:', error);
      }
    };

    if (date) {
      fetchCitas();
    }
  }, [date]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/noticias');
        if (!res.ok) {
          throw new Error('Error al recuperar las noticias');
        }
        const data = await res.json();
        console.log('Noticias recibidas:', data); // Agrega este log para verificar los datos recibidos
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
  
    fetchNews();
  }, []);


  const handleCorteSpecificServiceChange = (e) => {
    const selectedSpecificService = e.target.value;
    if (selectedSpecificService === 'fade') {
      setSpecificServices(['fade']);
    } else if (selectedSpecificService === 'tradicional') {
      setSpecificServices(['tradicional']);
    } else if (selectedSpecificService === 'dama') {
      setSpecificServices(['dama']);
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
      setSpecificServices([]);
    } else {
      if (selectedService === 'rayitos') {
        alert("Se recomienda hacer llamada telefónica para asegurar la cita de 'Rayitos' ya que el tiempo del servicio es de 4 horas. Tel. 315 100 12 42");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        return;
      }
      setServices([...services, selectedService]);
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
        throw new Error('Por favor, completa todos los campos obligatorios.');
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

      setModalMessage('Tu cita ha sido agendada con éxito.');
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
      alert("Se recomienda hacer llamada telefónica para asegurar la cita de 'Rayitos' ya que el tiempo del servicio es de 4 horas. Tel. 315 100 12 42");
      window.location.reload(); 
    }
  };

  return (
    <div >

      <div className="newsContainer">
        {Array.isArray(news) && news.length > 0 ? (
          news.map((notice) => (
            <div key={notice.id} className="newsItem">
              <h2>{notice.title}</h2>
              <p>{notice.description}</p>
              <small>Válido desde: {new Date(notice.startDate).toLocaleDateString()} hasta: {new Date(notice.endDate).toLocaleDateString()}</small>
            </div>
          ))
        ) : (
          <h1>No hay noticias</h1>
        )}
      </div>


      <div className='main'>
        
        <div className='logo'>
          <img src="https://cdn-icons-png.flaticon.com/512/40/40861.png" alt="" className='blurred' />
          <img src="https://cdn-icons-png.flaticon.com/512/40/40861.png" alt="" className='original' />
        </div>

        <div className='barbername'>
          <h1>SALA DE BELLEZA MATIZ</h1>
        </div>

        <div className='rightside'>
        </div>

        <div className="client-view">

          <h1>Agenda tu cita</h1>

          {error && (
            <p style={{ color: 'red', marginTop: 2, marginBottom: 5 }}>{error} Recargando pagina Error. {setTimeout(() => {
                window.location.reload();
              }, 5000)}
            </p>
          )}

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
                <input type="checkbox" className="custom-checkbox" value="corte" onChange={handleServiceChange} checked={services.includes('corte')} />
                <span className="custom-checkbox-label">Corte</span>
              </label>
              <br />
              <label>
                <input type="checkbox" className="custom-checkbox" value="depilacion" onChange={handleServiceChange} checked={services.includes('depilacion')} />
                <span className="custom-checkbox-label">Depilación</span>
              </label>
              <br />
              <label>
                <input type="checkbox" className="custom-checkbox" value="tinte" onChange={handleServiceChange} checked={services.includes('tinte')} />
                <span className="custom-checkbox-label">Tinte</span>
              </label>
              <br />
              <label>
                <input type="checkbox" className="custom-checkbox" value="rayitos" onChange={handleServiceChange} checked={services.includes('rayitos')} onClick={handleRayitosAlert} />
                <span className="custom-checkbox-label">Rayitos</span>
              </label>
              <br />
              <label>
                <input type="checkbox" className="custom-checkbox" value="maquillaje" onChange={handleServiceChange} checked={services.includes('maquillaje')} />
                <span className="custom-checkbox-label">Maquillaje</span>
              </label>
              <br />
              <label>
                <input type="checkbox" className="custom-checkbox" value="peinado" onChange={handleServiceChange} checked={services.includes('peinado')} />
                <span className="custom-checkbox-label">Peinado</span>
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
                      <input type="checkbox" className="custom-checkbox" value="fade" onChange={handleCorteSpecificServiceChange} checked={specificServices.includes('fade')} />
                      <span className="custom-checkbox-label">Corte Fade</span>
                    </label>
                    <br />
                    <label>
                      <input type="checkbox" className="custom-checkbox" value="tradicional" onChange={handleCorteSpecificServiceChange} checked={specificServices.includes('tradicional')} />
                      <span className="custom-checkbox-label">Corte Tradicional</span>
                    </label>
                    <br />
                    <label>
                      <input type="checkbox" className="custom-checkbox" value="dama" onChange={handleCorteSpecificServiceChange} checked={specificServices.includes('dama')} />
                      <span className="custom-checkbox-label">Corte para Dama</span>
                    </label>
                    <br />
                    <br />
                  </>
                )}
                {services.includes('depilacion') && (
                  <>
                    <label>Selecciona el tipo de depilación (puedes seleccionar varios):</label>
                    <br />
                    <label>
                      <input type="checkbox" className="custom-checkbox" value="barba" onChange={handleDepilacionSpecificServiceChange} checked={specificServices.includes('barba')} />
                      <span className="custom-checkbox-label">Depilación de Barba</span>
                    </label>
                    <br />
                    <label>
                      <input type="checkbox" className="custom-checkbox" value="ceja" onChange={handleDepilacionSpecificServiceChange} checked={specificServices.includes('ceja')} />
                      <span className="custom-checkbox-label">Depilación de Ceja</span>
                    </label>
                    <br />
                    <label>
                      <input type="checkbox" className="custom-checkbox" value="axila" onChange={handleDepilacionSpecificServiceChange} checked={specificServices.includes('axila')} />
                      <span className="custom-checkbox-label">Depilación de Axila</span>
                    </label>
                    <br />
                    <label>
                      <input type="checkbox" className="custom-checkbox" value="piernas" onChange={handleDepilacionSpecificServiceChange} checked={specificServices.includes('piernas')} />
                      <span className="custom-checkbox-label">Depilación de Piernas</span>
                    </label>
                    <br />
                  </>
                )}
              </div>
            </div>
          )}

          <div className="hora">
            <p><label>Selecciona la hora:</label></p>
            <select onChange={handleTimeChange} value={time}>
              <option value="">--Seleccionar --</option>
              {availableTimes.map((timeOption) => (
                <option key={timeOption} value={timeOption}>{timeOption}</option>
              ))}
            </select>
          </div>

          <div className="mensaje">
            <p>Mensaje (opcional): </p>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Mensaje adicional" />
          </div>

          <button onClick={handleSubmit}>Enviar</button>

          <Modal isOpen={showModal} onClose={handleCloseModal} message={modalMessage} />
        </div>

      </div>
    </div>
    
  );
}

export default ClientView;
