import React, { useState } from 'react';
import logo_web from '../assets/logo_web.png'; // Asegúrate de que esta ruta sea correcta

const RegistrationScreen = ({ onRegistrationSuccess, onNavigateLogin }) => {
    // Estados para capturar los datos del formulario
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (name && password && email) {
            console.log(`Usuario a registrar: ${name}, Email: ${email}`);
            alert(
                `¡Registro Exitoso!\nUsuario: ${name}\nAhora puedes iniciar sesión.`
            );
            // Vuelve a la pantalla de login
            onRegistrationSuccess();
        } else {
            alert('Por favor, completa todos los campos.');
        }
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
                    style={{ height: '70px', width: 'auto' }}
                />
            </div>

            <h2>Registro de Nuevo Usuario</h2>

            <form
                onSubmit={handleSubmit}
                style={{
                    backgroundColor: '#061a38ff',
                    padding: '30px',
                    borderRadius: '15px',
                    width: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '50px',
                }}
            >
                {/* Campo Nombre */}

                <input
                    type="text"
                    placeholder="Nombre Completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #000000ff',
                        color: 'white',
                        backgroundColor: '#0f2747ff',
                    }}
                />
                {/* Campo Correo */}
                <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #000000ff',
                        color: 'white',
                        backgroundColor: '#0f2747ff',
                    }}
                />
                {/* Campo Contraseña */}
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #000000ff',
                        color: 'white',
                        backgroundColor: '#0f2747ff',
                    }}
                />
                <button
                    type="submit"
                    style={{
                        marginTop: '10px',
                        backgroundColor: '#1613c1ff',
                        color: 'white',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '5px',
                    }}
                >
                    Registrar Cuenta
                </button>
                {/* Enlace para volver a Iniciar Sesión */}
                <p
                    onClick={onNavigateLogin}
                    style={{
                        color: '#bbb',
                        fontSize: '0.9em',
                        cursor: 'pointer',
                        textAlign: 'center',
                        marginTop: '5px',
                    }}
                >
                    ¿Ya tienes cuenta?{' '}
                    <span style={{ color: '#567dd2', fontWeight: 'bold' }}>
                        Iniciar Sesión
                    </span>
                </p>
            </form>
        </div>
    );
};

export default RegistrationScreen;
