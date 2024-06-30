// src/app/components/Modal.jsx

import React from 'react';
import './modal.css'; // Asegúrate de tener tu archivo CSS de estilos para el modal

const Modal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{message}</h2>
        <button onClick={handleClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default Modal;
