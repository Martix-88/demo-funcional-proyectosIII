import React, { useState, useEffect, useRef } from 'react';
import '../../styles/sectionCommon.css';
import './Sonidos.css';

export default function Sonidos() {
    const [sounds, setSounds] = useState([]);
    const [selectedSound, setSelectedSound] = useState('notification1');
    const [volume, setVolume] = useState(70);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    
    const audioRef = useRef(null);

    // Inicializar sonidos
    useEffect(() => {
        const defaultSounds = [
            { id: 'notification1', name: 'Notificación Suave', category: 'notification', icon: '🔔', frequency: '440Hz', isPremium: false },
            { id: 'notification2', name: 'Alerta', category: 'notification', icon: '⚠️', frequency: '523Hz', isPremium: false },
            { id: 'notification3', name: 'Campana Digital', category: 'notification', icon: '🔕', frequency: '659Hz', isPremium: true },
            
            { id: 'success1', name: 'Éxito Simple', category: 'success', icon: '✅', frequency: '880Hz', isPremium: false },
            { id: 'success2', name: 'Victoria', category: 'success', icon: '🏆', frequency: '1047Hz', isPremium: false },
            { id: 'success3', name: 'Fanfarria', category: 'success', icon: '🎉', frequency: '1319Hz', isPremium: true },
            
            { id: 'error1', name: 'Error Suave', category: 'error', icon: '❌', frequency: '200Hz', isPremium: false },
            { id: 'error2', name: 'Alerta Crítica', category: 'error', icon: '🚨', frequency: '247Hz', isPremium: true },
            
            { id: 'focus1', name: 'Ambiente Zen', category: 'ambient', icon: '🧘', frequency: '396Hz', isPremium: false },
            { id: 'focus2', name: 'Lluvia Suave', category: 'ambient', icon: '🌧️', frequency: '528Hz', isPremium: true },
            { id: 'focus3', name: 'Olas del Mar', category: 'ambient', icon: '🌊', frequency: '639Hz', isPremium: true },
            { id: 'focus4', name: 'Bosque', category: 'ambient', icon: '🌲', frequency: '741Hz', isPremium: true },
        ];

        const savedSounds = localStorage.getItem('sounds');
        const savedSelected = localStorage.getItem('selectedSound');
        const savedVolume = localStorage.getItem('volume');
        const savedMuted = localStorage.getItem('isMuted');

        if (savedSounds) {
            setSounds(JSON.parse(savedSounds));
        } else {
            setSounds(defaultSounds);
        }

        if (savedSelected) setSelectedSound(savedSelected);
        if (savedVolume) setVolume(parseInt(savedVolume));
        if (savedMuted) setIsMuted(savedMuted === 'true');
    }, []);

    // Guardar cambios
    useEffect(() => {
        localStorage.setItem('selectedSound', selectedSound);
    }, [selectedSound]);

    useEffect(() => {
        localStorage.setItem('volume', volume.toString());
    }, [volume]);

    useEffect(() => {
        localStorage.setItem('isMuted', isMuted.toString());
    }, [isMuted]);

    // Generar tono sintético
    const playTone = (frequency, duration = 500) => {
        if (isMuted) return;
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = parseFloat(frequency);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(volume / 100, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);

        setIsPlaying(frequency);
        setTimeout(() => setIsPlaying(null), duration);
    };

    const handlePlaySound = (sound) => {
        const freq = sound.frequency.replace('Hz', '');
        playTone(freq);
    };

    const handleSelectSound = (soundId) => {
        setSelectedSound(soundId);
    };

    const categories = [
        { id: 'all', name: 'Todos', icon: '🎵' },
        { id: 'notification', name: 'Notificaciones', icon: '🔔' },
        { id: 'success', name: 'Éxito', icon: '✅' },
        { id: 'error', name: 'Error', icon: '❌' },
        { id: 'ambient', name: 'Ambiente', icon: '🎧' },
    ];

    // Filtrar sonidos
    const filteredSounds = sounds.filter(sound => {
        const matchesSearch = sound.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || sound.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="section-container sonidos-container">
            <div className="sonidos-header">
                <div className="header-top">
                    <h2>🔊 Biblioteca de Sonidos</h2>
                    <div className="volume-control">
                        <button 
                            className="mute-btn"
                            onClick={() => setIsMuted(!isMuted)}
                        >
                            {isMuted ? '🔇' : '🔊'}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={(e) => setVolume(parseInt(e.target.value))}
                            className="volume-slider"
                        />
                        <span className="volume-value">{volume}%</span>
                    </div>
                </div>
                <p className="sonidos-subtitle">
                    Personaliza los sonidos y efectos de tu aplicación
                </p>
            </div>

            {/* Controles de búsqueda y filtro */}
            <div className="sounds-controls">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="🔍 Buscar sonido..."
                    className="search-input"
                />

                <div className="category-filters">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`category-btn ${filterCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setFilterCategory(cat.id)}
                        >
                            <span className="cat-icon">{cat.icon}</span>
                            <span className="cat-name">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid de sonidos */}
            <div className="sounds-grid">
                {filteredSounds.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-icon">🎵</p>
                        <p className="empty-text">
                            No se encontraron sonidos con ese criterio
                        </p>
                    </div>
                ) : (
                    filteredSounds.map(sound => {
                        const isSelected = sound.id === selectedSound;
                        const isCurrentlyPlaying = isPlaying === sound.frequency.replace('Hz', '');

                        return (
                            <div
                                key={sound.id}
                                className={`sound-card ${isSelected ? 'selected' : ''} ${sound.isPremium ? 'premium' : ''}`}
                            >
                                {sound.isPremium && (
                                    <div className="premium-badge">💎 Premium</div>
                                )}

                                {isSelected && (
                                    <div className="selected-badge">✓ Seleccionado</div>
                                )}

                                <div className="sound-icon-wrapper">
                                    <div className={`sound-icon ${isCurrentlyPlaying ? 'playing' : ''}`}>
                                        {sound.icon}
                                    </div>
                                    {isCurrentlyPlaying && (
                                        <div className="sound-waves">
                                            <span className="wave"></span>
                                            <span className="wave"></span>
                                            <span className="wave"></span>
                                        </div>
                                    )}
                                </div>

                                <h3 className="sound-name">{sound.name}</h3>
                                <div className="sound-info">
                                    <span className="sound-category">
                                        {categories.find(c => c.id === sound.category)?.icon}
                                        {' '}
                                        {categories.find(c => c.id === sound.category)?.name}
                                    </span>
                                    <span className="sound-frequency">{sound.frequency}</span>
                                </div>

                                <div className="sound-actions">
                                    <button
                                        className="play-btn"
                                        onClick={() => handlePlaySound(sound)}
                                        disabled={sound.isPremium && !isSelected}
                                    >
                                        {isCurrentlyPlaying ? '⏸️' : '▶️'} Reproducir
                                    </button>
                                    <button
                                        className={`select-btn ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleSelectSound(sound.id)}
                                        disabled={isSelected}
                                    >
                                        {isSelected ? 'Seleccionado' : 'Seleccionar'}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Sección de información */}
            <div className="info-section">
                <h3>ℹ️ Información sobre Frecuencias</h3>
                <div className="info-grid">
                    <div className="info-card">
                        <div className="info-icon">🎵</div>
                        <h4>Frecuencias Bajas (200-400Hz)</h4>
                        <p>Sonidos graves y calmantes, ideales para notificaciones sutiles</p>
                    </div>
                    <div className="info-card">
                        <div className="info-icon">🎶</div>
                        <h4>Frecuencias Medias (400-800Hz)</h4>
                        <p>Equilibradas y claras, perfectas para alertas generales</p>
                    </div>
                    <div className="info-card">
                        <div className="info-icon">🎼</div>
                        <h4>Frecuencias Altas (800Hz+)</h4>
                        <p>Agudas y energizantes, ideales para celebraciones de éxito</p>
                    </div>
                </div>
            </div>

            <audio ref={audioRef} />
        </div>
    );
}