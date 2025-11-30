import React, { useState, useEffect } from 'react';
import MyCalendar from './components/MyCalendar/MyCalendar';
import RegistrationScreen from './components/RegistrationForm/RegistrationForm';
import Home from './components/Home/Home';
import LoginModal from './components/LoginModal/LoginModal';
import LoginFormModal from './components/LoginFormModal/LoginFormModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

function App() {
    // Estado de sesión del usuario desde localStorage
    const [isLoggedIn, setIsLoggedIn] = useLocalStorage('isLoggedIn', false);
    const [currentUser, setCurrentUser] = useLocalStorage('currentUser', null);
    const [userCredentials, setUserCredentials] = useLocalStorage('userCredentials', { email: '', password: '' });
    
    // Estado local para la vista
    const [view, setView] = useState(isLoggedIn ? 'calendar' : 'home');
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Auto-login si hay sesión activa
    useEffect(() => {
        if (isLoggedIn && currentUser) {
            setView('calendar');
        } else {
            setView('home');
        }
    }, [isLoggedIn, currentUser]);

    const handleLoginSuccess = (email, password) => {
        // Guardar credenciales en localStorage
        setUserCredentials({ email, password });
        // Guardar en localStorage
        setIsLoggedIn(true);
        setCurrentUser({ email });
        
        // Cambiar vista
        setView('calendar');
        setShowLoginModal(false);
    };

    const handleLogout = () => {
        // Limpiar localStorage
        setIsLoggedIn(false);
        setCurrentUser(null);
        
        // Cambiar vista
        setView('home');
    };

    const handleNavigateRegister = () => {
        setView('register');
        setShowLoginModal(false);
    };

    const handleLearnMore = () => {
        alert('Aquí irían más detalles sobre la aplicación. ¡Próximamente!');
    };

    const renderView = () => {
        switch (view) {
            case 'home':
                return (
                    <>
                        <Home
                            onLoginClick={() => setShowLoginModal(true)}
                            onLearnMore={handleLearnMore}
                        />
                        <LoginModal
                            isOpen={showLoginModal}
                            onClose={() => setShowLoginModal(false)}
                        >
                            <LoginFormModal
                                onLoginSuccess={handleLoginSuccess}
                                onNavigateRegister={handleNavigateRegister}
                                savedEmail={userCredentials.email}
                                savedPassword={userCredentials.password}
                            />
                        </LoginModal>
                    </>
                );
            case 'register':
                return (
                    <RegistrationScreen
                        onRegistrationSuccess={() => setView('home')}
                        onNavigateLogin={() => setView('home')}
                    />
                );
            case 'calendar':
                return <MyCalendar onLogout={handleLogout} onLogoClick={() => setView('home')} />;
            default:
                return (
                    <>
                        <Home
                            onLoginClick={() => setShowLoginModal(true)}
                            onLearnMore={handleLearnMore}
                        />
                        <LoginModal
                            isOpen={showLoginModal}
                            onClose={() => setShowLoginModal(false)}
                        >
                            <LoginFormModal
                                onLoginSuccess={handleLoginSuccess}
                                onNavigateRegister={handleNavigateRegister}
                                savedEmail={userCredentials.email}
                                savedPassword={userCredentials.password}
                            />
                        </LoginModal>
                    </>
                );
        }
    };

    return <div style={{ height: '100vh', width: '100%' }}>{renderView()}</div>;
}

export default App;
