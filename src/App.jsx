import React, { useState } from 'react';
import MyCalendar from './components/MyCalendar';
import LoginScreen from './components/LoginScreen';
import RegistrationScreen from './components/RegistrationForm'; // 👈 Nuevo componente de página
import './App.css';

function App() {
    // El estado ahora puede ser 'login', 'register' o 'calendar'
    const [view, setView] = useState('login');

    const handleLoginSuccess = () => {
        setView('calendar'); // Ir al calendario
    };

    const handleNavigate = (targetView) => {
        setView(targetView); // Cambiar entre 'login' y 'register'
    };

    const renderView = () => {
        switch (view) {
            case 'login':
                return (
                    <LoginScreen
                        onLoginSuccess={handleLoginSuccess}
                        // La navegación se pasa directamente
                        onNavigateRegister={() => handleNavigate('register')}
                    />
                );
            case 'register':
                return (
                    // Pasar la función para volver al login
                    <RegistrationScreen
                        onRegistrationSuccess={() => handleNavigate('login')}
                        onNavigateLogin={() => handleNavigate('login')}
                    />
                );
            case 'calendar':
                return <MyCalendar />;
            default:
                return (
                    <LoginScreen
                        onLoginSuccess={handleLoginSuccess}
                        onNavigateRegister={() => handleNavigate('register')}
                    />
                );
        }
    };

    return <div style={{ height: '100vh', width: '100%' }}>{renderView()}</div>;
}

export default App;
