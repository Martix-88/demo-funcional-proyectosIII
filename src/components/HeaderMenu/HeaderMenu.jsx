import React, { useRef, useEffect } from 'react';
import './HeaderMenu.css';

export default function HeaderMenu({ isOpen, onToggle, onSectionChange, onLogout, activeSection }) {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                if (isOpen) onToggle();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onToggle]);

    const menuItems = [
        { id: 'amigos', label: 'Amigos', icon: 'A' },
        { id: 'planes', label: 'Planes', icon: 'P' },
        { id: 'sonidos', label: 'Sonidos', icon: 'M' },
        { id: 'logout', label: 'Cerrar Sesión', icon: '🚪' },
    ];

    const handleItemClick = (itemId) => {
        if (itemId === 'logout') {
            onLogout();
        } else {
            onSectionChange(itemId);
            onToggle();
        }
    };

    return (
        <div className="header-menu-container" ref={menuRef}>
            <button
                className={`header-menu-button ${isOpen ? 'active' : ''}`}
                onClick={onToggle}
                title="Menú"
            >
                ⋮
            </button>

            {isOpen && (
                <div className="header-menu-dropdown">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            className={`menu-item ${activeSection === item.id ? 'active' : ''}`}
                            onClick={() => handleItemClick(item.id)}
                        >
                            <span className="menu-icon">{item.icon}</span>
                            <span className="menu-label">{item.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
