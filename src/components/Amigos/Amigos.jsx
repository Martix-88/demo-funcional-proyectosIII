import React, { useState, useEffect } from 'react';
import '../../styles/sectionCommon.css';
import './Amigos.css';

export default function Amigos() {
    const [friends, setFriends] = useState([]);
    const [newFriendName, setNewFriendName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, online, offline

    // Cargar amigos del localStorage al iniciar
    useEffect(() => {
        const savedFriends = localStorage.getItem('friends');
        if (savedFriends) {
            setFriends(JSON.parse(savedFriends));
        } else {
            // Amigos de ejemplo
            setFriends([
                { id: 1, name: 'Ana García', status: 'online', avatar: '👩', level: 12, streak: 15 },
                { id: 2, name: 'Carlos López', status: 'offline', avatar: '👨', level: 8, streak: 7 },
                { id: 3, name: 'María Torres', status: 'online', avatar: '👧', level: 20, streak: 45 }
            ]);
        }
    }, []);

    // Guardar amigos en localStorage cuando cambien
    useEffect(() => {
        if (friends.length > 0) {
            localStorage.setItem('friends', JSON.stringify(friends));
        }
    }, [friends]);

    const addFriend = (e) => {
        e.preventDefault();
        if (newFriendName.trim()) {
            const avatars = ['👤', '👨', '👩', '🧑', '👦', '👧'];
            const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
            
            const newFriend = {
                id: Date.now(),
                name: newFriendName.trim(),
                status: 'offline',
                avatar: randomAvatar,
                level: Math.floor(Math.random() * 15) + 1,
                streak: Math.floor(Math.random() * 30)
            };
            
            setFriends([...friends, newFriend]);
            setNewFriendName('');
        }
    };

    const removeFriend = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este amigo?')) {
            setFriends(friends.filter(friend => friend.id !== id));
        }
    };

    const toggleStatus = (id) => {
        setFriends(friends.map(friend => 
            friend.id === id 
                ? { ...friend, status: friend.status === 'online' ? 'offline' : 'online' }
                : friend
        ));
    };

    // Filtrar amigos
    const filteredFriends = friends.filter(friend => {
        const matchesSearch = friend.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || friend.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const onlineCount = friends.filter(f => f.status === 'online').length;

    return (
        <div className="section-container amigos-container">
            <div className="amigos-header">
                <div className="header-title">
                    <h2>🧑‍🤝‍🧑 Mis Amigos</h2>
                    <div className="friends-stats">
                        <span className="stat-badge">
                            Total: <strong>{friends.length}</strong>
                        </span>
                        <span className="stat-badge online">
                            En línea: <strong>{onlineCount}</strong>
                        </span>
                    </div>
                </div>

                {/* Formulario para añadir amigo */}
                <form className="add-friend-form" onSubmit={addFriend}>
                    <input
                        type="text"
                        value={newFriendName}
                        onChange={(e) => setNewFriendName(e.target.value)}
                        placeholder="Nombre del amigo..."
                        className="friend-input"
                    />
                    <button type="submit" className="add-friend-btn">
                        ➕ Añadir
                    </button>
                </form>
            </div>

            {/* Filtros y búsqueda */}
            <div className="friends-controls">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="🔍 Buscar amigo..."
                    className="search-input"
                />
                
                <div className="filter-buttons">
                    <button 
                        className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('all')}
                    >
                        Todos
                    </button>
                    <button 
                        className={`filter-btn ${filterStatus === 'online' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('online')}
                    >
                        En línea
                    </button>
                    <button 
                        className={`filter-btn ${filterStatus === 'offline' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('offline')}
                    >
                        Desconectados
                    </button>
                </div>
            </div>

            {/* Lista de amigos */}
            <div className="friends-list">
                {filteredFriends.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-icon">👥</p>
                        <p className="empty-text">
                            {searchTerm || filterStatus !== 'all' 
                                ? 'No se encontraron amigos con ese criterio' 
                                : 'Aún no tienes amigos. ¡Añade uno!'}
                        </p>
                    </div>
                ) : (
                    filteredFriends.map(friend => (
                        <div key={friend.id} className="friend-card">
                            <div className="friend-avatar">
                                <span className="avatar-icon">{friend.avatar}</span>
                                <span className={`status-indicator ${friend.status}`}></span>
                            </div>
                            
                            <div className="friend-info">
                                <h3 className="friend-name">{friend.name}</h3>
                                <div className="friend-stats-row">
                                    <span className="stat-item">
                                        ⭐ Nivel {friend.level}
                                    </span>
                                    <span className="stat-item">
                                        🔥 {friend.streak} días
                                    </span>
                                </div>
                            </div>

                            <div className="friend-actions">
                                <button 
                                    className={`status-btn ${friend.status}`}
                                    onClick={() => toggleStatus(friend.id)}
                                    title={friend.status === 'online' ? 'Marcar como desconectado' : 'Marcar como conectado'}
                                >
                                    {friend.status === 'online' ? '🟢' : '⚫'}
                                </button>
                                <button 
                                    className="remove-btn"
                                    onClick={() => removeFriend(friend.id)}
                                    title="Eliminar amigo"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}