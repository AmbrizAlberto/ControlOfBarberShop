// src/app/Login/page.jsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import "../../../public/css/login.css"

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem('token', data.token); 
      router.push('/dashboard'); 
    } else {
      alert('Error: Usuario o contraseña incorrectos');
    }
  };

  return (
    <div>
      <div className='loginhtml'>
        <div className='mainlg'>
          <div className='logo'>
            <img src="https://cdn-icons-png.flaticon.com/512/40/40861.png" alt="" className='blurred' />
            <img src="https://cdn-icons-png.flaticon.com/512/40/40861.png" alt="" className='original' />
          </div>

          <div className='barbername'>
            <h1>SALA DE BELLEZA MATIZ</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div>
              <label>Usuario:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <br></br>
            <div>
              <label>Contraseña:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Iniciar Sesion</button>
          </form>  
        </div>
      </div>
    </div>
  );
}

export default Login;
