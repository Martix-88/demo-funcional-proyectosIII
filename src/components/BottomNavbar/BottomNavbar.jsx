import React from 'react';
import './BottomNavbar.css';

export default function BottomNavbar({ activeSection, onSectionChange, onLogout }) {
    const sections = [
        { id: 'calendar', label: 'Calendario', icon: '📅' },
        { id: 'amigos', label: 'Amigos', icon: 'A' },
        { id: 'planes', label: 'Planes', icon: 'P' },
        { id: 'sonidos', label: 'Sonidos', icon: 'M' },
        { id: 'logout', label: 'Salir', icon: '🚪' },
    ];

    return (
        <nav className="bottom-navbar">
            <div className="navbar-container">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        className={`navbar-button ${activeSection === section.id ? 'active' : ''}`}
                        onClick={() => {
                            if (section.id === 'logout') {
                                onLogout();
                            } else {
                                onSectionChange(section.id);
                            }
                        }}
                        title={section.label}
                    >
                        <span className="navbar-icon">{section.icon}</span>
                        <span className="navbar-label">{section.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
