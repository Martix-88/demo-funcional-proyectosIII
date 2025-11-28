import React, { useState } from 'react';
import logo_web from '../assets/logo_web.png';

// Componente simple de spinner de carga (necesita la animación 'spin' en index.css)
const LoadingSpinner = () => (
    <div
        style={{
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid #fff',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            animation: 'spin 1s linear infinite',
            display: 'inline-block',
            marginRight: '8px',
        }}
    ></div>
);

const LoginScreen = ({ onLoginSuccess, onNavigateRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Estado para mostrar errores
    const [loading, setLoading] = useState(false); // Estado para simular la carga

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Limpiar errores anteriores

        if (username && password) {
            setLoading(true); // Iniciar la carga

            // SIMULACIÓN DE INICIO DE SESIÓN SIN BACKEND
            console.log(`Simulando inicio de sesión con: ${username}`);

            // Pausa de 2 segundos para simular la llamada a la API/carga
            setTimeout(() => {
                setLoading(false); // Detener la carga

                // En un entorno real, verificaríamos credenciales aquí.
                // Simulamos un inicio de sesión exitoso incondicionalmente.
                onLoginSuccess();
            }, 2000);
        } else {
            setError('Por favor, ingresa correo y contraseña.');
        }
    };

    // Estilos de input unificados
    const inputStyle = {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #1613c1ff',
        color: 'white',
        backgroundColor: '#0f2747ff',
        marginTop: '5px',
    };

    // Estilos para la etiqueta (label)
    const labelStyle = {
        display: 'flex',
        flexDirection: 'column',
        fontWeight: 'bold',
        fontSize: '0.95em',
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100vh',
                width: '100%',
                color: 'white',
                background:
                    'linear-gradient(135deg, #2530a3ff 40%, #10154bff 60%)',
            }}
        >
            {/* LOGO ARRIBA A LA IZQUIERDA */}
            <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
                <img
                    src={logo_web}
                    alt="Vestigium"
                    style={{
                        height: '70px',
                        width: 'auto',
                    }}
                    // Fallback en caso de que la URL no cargue
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                            'https://placehold.co/150x70/567dd2/ffffff?text=Logo';
                    }}
                />
            </div>

            <h2>Iniciar Sesión</h2>

            <form
                onSubmit={handleSubmit}
                style={{
                    backgroundColor: '#061a38ff',
                    padding: '30px',
                    borderRadius: '15px',
                    width: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)', // Sombra para el formulario
                }}
            >
                {/* 1. Campo Usuario (Correo) */}
                <label style={labelStyle}>
                    Correo Electrónico:
                    <input
                        type="email" // Cambiado a email para mejor UX
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={inputStyle}
                        placeholder="ejemplo@dominio.com"
                    />
                </label>

                {/* 2. Campo Contraseña */}
                <label style={labelStyle}>
                    Contraseña:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={inputStyle}
                        placeholder="Tu contraseña"
                    />
                </label>

                {/* Mensaje de error o carga */}
                {error && (
                    <p
                        style={{
                            color: '#ff6b6b',
                            textAlign: 'center',
                            margin: '0',
                        }}
                    >
                        {error}
                    </p>
                )}

                <p
                    onClick={onNavigateRegister}
                    style={{
                        color: '#bbb',
                        fontSize: '0.9em',
                        cursor: 'pointer',
                        textAlign: 'center',
                        marginTop: '0px',
                        marginBottom: '0px',
                    }}
                >
                    ¿No tienes cuenta?{' '}
                    <span style={{ color: '#567dd2', fontWeight: 'bold' }}>
                        Regístrate Aquí
                    </span>
                </p>

                <button
                    type="submit"
                    disabled={loading} // Deshabilita el botón mientras carga
                    style={{
                        marginTop: '10px',
                        backgroundColor: loading ? '#0e0b74' : '#1613c1ff', // Cambia color si carga
                        color: 'white',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        cursor: loading ? 'default' : 'pointer',
                        transition: 'background-color 0.3s, box-shadow 0.3s',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', // Sombra para el botón

                        display: 'flex', // Necesario para centrar el spinner/texto
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
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

export default LoginScreen;
