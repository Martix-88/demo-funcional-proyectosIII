import React from 'react';
import './Home.css';
import logo_web from '../../assets/logo_web.png';

const Home = ({ onLoginClick, onLearnMore }) => {
    return (
        <div className="home-container">
            {/* Header con botón de login */}
            <header className="home-header">
                <div className="header-content">
                    <h1 className="app-title">Vestigium</h1>
                    <button className="login-button" onClick={onLoginClick}>
                        Iniciar Sesión
                    </button>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="home-main">
                {/* Sección del logo */}
                <section className="logo-section">
                    <div className="logo-container">
                        <img
                            src={logo_web}
                            alt="Logo Vestigium"
                            className="main-logo"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/250x250/22c55e/000000?text=Logo';
                            }}
                        />
                    </div>
                </section>

                {/* Sección de descripción */}
                <section className="description-section">
                    <h2 className="main-title">Bienvenido a Vestigium</h2>
                    <p className="main-description">
                        Gestiona tu calendario y tareas de forma eficiente. Mantén el control de tus actividades diarias con nuestro gestor intuitivo.
                    </p>

                    {/* Botón de "Saber Más" */}
                    <button className="learn-more-button" onClick={onLearnMore}>
                        Saber Más
                    </button>
                </section>
            </main>

            {/* Footer */}
            <footer className="home-footer">
                <p>&copy; 2025 Vestigium. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Home;
