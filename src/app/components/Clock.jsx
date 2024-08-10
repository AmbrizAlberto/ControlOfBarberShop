// src/components/Clock.jsx

import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
  }, []);

  return (
    <div style={styles.clockContainer}>
      {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
    </div>
  );
};

const styles = {
  clockContainer: {
    position: 'fixed',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
  },
};

export default Clock;
