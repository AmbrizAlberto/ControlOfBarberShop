"use client"

import React from 'react'

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
          Subir noticia
        </div>
      </div>
      <div className='Right'>
        <div className='ListContainer'>
          
        </div>
      </div>
    </div>
  );
}
export default Dashboard;