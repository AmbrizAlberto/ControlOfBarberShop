// src/components/Modal.jsx

import React from 'react';
import '../../public/css/modal.css';

const Modal = ({ show, onClose, onConfirm }) => {
  if (!show) {
    return null;
  }

  return (
    <div className='modal'>
      <div className='modal-content'>
        <h2>Confirmar eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar esta cita?</p>
        <button onClick={onConfirm}>Sí</button>
        <button onClick={onClose}>No</button>
      </div>
    </div>
  );
};

export default Modal;
