"use client"

import React from 'react'
import "../../../public/css/dashb.css"

function Dashboard() {
  const fetchCitas = async () => {
    try {
      const res = await fetch('/api/citas');
      const citas = await res.json();
    } catch (error) {
      console.error('Error buscando citas:', error);
    }
  };
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
        </div>
      </div>
    </div>
  );
}
export default Dashboard;