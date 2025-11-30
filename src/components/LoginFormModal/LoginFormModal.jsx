import React, { useState } from 'react';
import './LoginFormModal.css';

// Componente simple de spinner de carga
const LoadingSpinner = () => (
    <div
        style={{
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderTop: '3px solid #22c55e',
            borderRadius: '50%',
            width: '14px',
            height: '14px',
            animation: 'spin 1s linear infinite',
            display: 'inline-block',
            marginRight: '8px',
        }}
    ></div>
);

const LoginFormModal = ({ onLoginSuccess, onNavigateRegister, savedEmail = '', savedPassword = '' }) => {
    const [username, setUsername] = useState(savedEmail);
    const [password, setPassword] = useState(savedPassword);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (username && password) {
            setLoading(true);

            console.log(`Simulando inicio de sesión con: ${username}`);

            setTimeout(() => {
                setLoading(false);
                onLoginSuccess(username, password);
            }, 2000);
        } else {
            setError('Por favor, ingresa correo y contraseña.');
        }
    };

    return (
        <div className="login-form-modal">
            <h2 className="login-form-title">Iniciar Sesión</h2>

            <form onSubmit={handleSubmit} className="login-form">
                {/* Campo Usuario */}
                <label className="login-form-label">
                    Correo Electrónico:
                    <input
                        type="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="login-form-input"
                        placeholder="ejemplo@dominio.com"
                    />
                </label>

                {/* Campo Contraseña */}
                <label className="login-form-label">
                    Contraseña:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="login-form-input"
                        placeholder="Tu contraseña"
                    />
                </label>

                {/* Mensaje de error */}
                {error && <p className="login-form-error">{error}</p>}

                {/* Enlace a registro */}
                <p className="login-form-register">
                    ¿No tienes cuenta?{' '}
                    <span className="login-form-register-link" onClick={onNavigateRegister}>
                        Regístrate Aquí
                    </span>
                </p>

                {/* Botón submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="login-form-submit"
                >
                    {loading ? (
                        <>
                            <LoadingSpinner />
                            Accediendo...
                        </>
                    ) : (
                        'Acceder'
                    )}
                </button>
            </form>
        </div>
    );
};

export default LoginFormModal;
