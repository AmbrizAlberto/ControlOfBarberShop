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
      localStorage.setItem('token', data.token); // Guarda el token en localStorage
      router.push('/Dashboard'); // Redirige al dashboard
    } else {
      alert('Error: Usuario o contraseña incorrectos'); // Muestra un mensaje de error
    }
  };

  return (
    <div>
      <div className='mainlg'>
        <h1 className=''>Login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>  
      </div>
    </div>
  );
}

export default Login;
