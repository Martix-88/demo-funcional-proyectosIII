import React from 'react';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="login-modal-backdrop" onClick={handleBackdropClick}>
            <div className="login-modal-content">
                <button className="login-modal-close" onClick={onClose}>
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
};

export default LoginModal;
