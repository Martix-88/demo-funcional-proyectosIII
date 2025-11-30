import React, { useMemo, useState, useEffect } from 'react';
import '../../styles/sectionCommon.css';
import './Recompensas.css';

export default function Recompensas({ currentStreak = 0 }) {
    const [selectedReward, setSelectedReward] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [animateClimber, setAnimateClimber] = useState(false);

    // Calcular los regalos desbloqueados (cada 10 de racha)
    const rewardsUnlocked = useMemo(() => {
        return Math.floor(currentStreak / 10);
    }, [currentStreak]);

    // Posición del muñequito en el árbol (porcentaje de progreso hacia el siguiente regalo)
    const progressToNextReward = useMemo(() => {
        const remainder = currentStreak % 10;
        return (remainder / 10) * 100;
    }, [currentStreak]);

    // Definir recompensas específicas con iconos y descripciones
    const rewardDefinitions = [
        { icon: '🎨', name: 'Tema Arcoíris', description: 'Desbloquea el tema colorido', color: '#ff6b6b' },
        { icon: '🔔', name: 'Sonido Premium', description: '3 sonidos exclusivos', color: '#4ecdc4' },
        { icon: '⭐', name: 'Insignia Estrella', description: 'Badge especial en tu perfil', color: '#ffe66d' },
        { icon: '🎯', name: 'Desafío Épico', description: 'Acceso a misiones especiales', color: '#95e1d3' },
        { icon: '💎', name: 'Avatar Premium', description: '5 avatares exclusivos', color: '#a8e6cf' },
        { icon: '🏆', name: 'Trofeo de Oro', description: 'Medalla de perseverancia', color: '#ffd93d' },
        { icon: '🎭', name: 'Modo Oscuro Pro', description: 'Tema oscuro mejorado', color: '#6c5ce7' },
        { icon: '🚀', name: 'Boost x2', description: 'Duplica XP durante 7 días', color: '#74b9ff' },
        { icon: '👑', name: 'Corona Real', description: 'Título de Rey/Reina', color: '#feca57' },
        { icon: '🌟', name: 'Maestro Supremo', description: '¡Has alcanzado la cima!', color: '#ee5a6f' },
    ];

    // Generar 10 ramas de regalos con info detallada
    const rewards = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        level: i + 1,
        streakRequired: (i + 1) * 10,
        isUnlocked: rewardsUnlocked >= i + 1,
        ...rewardDefinitions[i]
    }));

    // Animación del muñequito al subir
    useEffect(() => {
        setAnimateClimber(true);
        const timer = setTimeout(() => setAnimateClimber(false), 1000);
        return () => clearTimeout(timer);
    }, [currentStreak]);

    // Confeti al desbloquear un regalo
    useEffect(() => {
        if (currentStreak % 10 === 0 && currentStreak > 0) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [currentStreak]);

    const handleRewardClick = (reward) => {
        if (reward.isUnlocked) {
            setSelectedReward(reward);
        }
    };

    const closeModal = () => {
        setSelectedReward(null);
    };

    return (
        <div className="section-container recompensas-container">
            <div className="recompensas-header">
                <h2>🎁 Torre de Recompensas</h2>
                <p className="recompensas-subtitle">
                    Sube el árbol completando tu racha diaria. ¡Cada 10 días obtienes un regalo especial!
                </p>
            </div>

            {/* Confeti animado */}
            {showConfetti && (
                <div className="confetti-container">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div key={i} className="confetti" style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 0.5}s`,
                            background: `hsl(${Math.random() * 360}, 70%, 60%)`
                        }} />
                    ))}
                </div>
            )}

            <div className="reward-tree-container">
                <div className="reward-tree">
                    {/* Tronco del árbol con textura */}
                    <div className="tree-trunk">
                        <div className="trunk-texture"></div>
                    </div>

                    {/* Ramas con regalos */}
                    <div className="tree-branches">
                        {rewards.map((reward, index) => {
                            const isNextReward = index === rewardsUnlocked;
                            return (
                                <div
                                    key={reward.id}
                                    className={`tree-branch branch-${index + 1} ${reward.isUnlocked ? 'unlocked' : 'locked'} ${isNextReward ? 'next' : ''}`}
                                    onClick={() => handleRewardClick(reward)}
                                    style={{ '--branch-color': reward.color }}
                                >
                                    {/* Rama */}
                                    <div className="branch-line"></div>

                                    {/* Regalo */}
                                    <div className="reward-gift">
                                        <div className="gift-container">
                                            <span className="gift-icon">{reward.isUnlocked ? reward.icon : '🔒'}</span>
                                            {reward.isUnlocked && (
                                                <div className="gift-glow"></div>
                                            )}
                                        </div>
                                        <div className="reward-details">
                                            <span className="reward-label">{reward.streakRequired} días</span>
                                            {reward.isUnlocked && (
                                                <span className="reward-name">{reward.name}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Indicador de próximo objetivo */}
                                    {isNextReward && (
                                        <div className="next-indicator">
                                            <span className="pulse-dot"></span>
                                            <span className="next-text">Siguiente</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Muñequito en el árbol con animación */}
                    <div
                        className={`climber ${animateClimber ? 'climbing' : ''}`}
                        style={{
                            bottom: `calc(${rewardsUnlocked * 10}% + ${progressToNextReward * 0.9}%)`,
                        }}
                    >
                        <span className="climber-emoji">🧗</span>
                        <div className="climber-shadow"></div>
                    </div>

                    {/* Barra de progreso vertical */}
                    <div className="progress-track">
                        <div 
                            className="progress-fill"
                            style={{ height: `${(currentStreak / 100) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Información de progreso mejorada */}
                <div className="reward-info">
                    <div className="info-card streak-card">
                        <div className="info-icon">🔥</div>
                        <h3>Racha Actual</h3>
                        <p className="info-value">{currentStreak}</p>
                        <p className="info-hint">días completados</p>
                        <div className="info-bar">
                            <div 
                                className="info-bar-fill"
                                style={{ width: `${(currentStreak % 10) * 10}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="info-card rewards-card">
                        <div className="info-icon">🎁</div>
                        <h3>Regalos Desbloqueados</h3>
                        <p className="info-value">{rewardsUnlocked}/10</p>
                        <p className="info-hint">¡sigue subiendo!</p>
                        <div className="gift-indicators">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <span 
                                    key={i} 
                                    className={`gift-dot ${i < rewardsUnlocked ? 'unlocked' : ''}`}
                                >
                                    {i < rewardsUnlocked ? '🎁' : '⚪'}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="info-card next-card">
                        <div className="info-icon">⏰</div>
                        <h3>Próximo Regalo</h3>
                        <p className="info-value">{10 - (currentStreak % 10)}</p>
                        <p className="info-hint">días faltantes</p>
                        {rewardsUnlocked < 10 && (
                            <p className="next-reward-name">
                                {rewardDefinitions[rewardsUnlocked]?.icon} {rewardDefinitions[rewardsUnlocked]?.name}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Mensajes motivacionales mejorados */}
            <div className={`motivation-message level-${Math.min(Math.floor(rewardsUnlocked / 3), 3)}`}>
                {rewardsUnlocked === 10 && (
                    <>
                        <div className="trophy-animation">🏆</div>
                        <p className="message-text">
                            <strong>¡¡FELICIDADES!!</strong><br/>
                            ¡Has alcanzado la cima de la Torre de Recompensas!<br/>
                            ¡Eres un verdadero CAMPEÓN! 🎉👑
                        </p>
                    </>
                )}
                {rewardsUnlocked >= 7 && rewardsUnlocked < 10 && (
                    <p className="message-text">
                        🌟 <strong>¡Casi lo logras!</strong> Solo {10 - rewardsUnlocked} regalo{10 - rewardsUnlocked > 1 ? 's' : ''} para la gloria total!
                    </p>
                )}
                {rewardsUnlocked >= 4 && rewardsUnlocked < 7 && (
                    <p className="message-text">
                        🔥 <strong>¡Vas increíble!</strong> Ya pasaste la mitad del camino. ¡No te detengas!
                    </p>
                )}
                {rewardsUnlocked > 0 && rewardsUnlocked < 4 && (
                    <p className="message-text">
                        💪 <strong>¡Buen comienzo!</strong> {10 - rewardsUnlocked} regalos más para llegar a la cima.
                    </p>
                )}
                {rewardsUnlocked === 0 && (
                    <p className="message-text">
                        🚀 <strong>¡Comienza tu aventura!</strong> Completa 10 días de racha para desbloquear tu primer regalo mágico.
                    </p>
                )}
            </div>

            {/* Lista de todas las recompensas */}
            <div className="rewards-list">
                <h3>📜 Todas las Recompensas</h3>
                <div className="rewards-grid">
                    {rewards.map((reward) => (
                        <div
                            key={reward.id}
                            className={`reward-item ${reward.isUnlocked ? 'unlocked' : 'locked'}`}
                            onClick={() => handleRewardClick(reward)}
                            style={{ '--item-color': reward.color }}
                        >
                            <div className="reward-item-icon">{reward.isUnlocked ? reward.icon : '🔒'}</div>
                            <div className="reward-item-info">
                                <h4>{reward.isUnlocked ? reward.name : '???'}</h4>
                                <p>{reward.isUnlocked ? reward.description : `Desbloquea a los ${reward.streakRequired} días`}</p>
                            </div>
                            <div className="reward-item-badge">{reward.streakRequired} días</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal de detalles de recompensa */}
            {selectedReward && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="reward-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>✕</button>
                        <div className="modal-icon" style={{ background: selectedReward.color }}>
                            {selectedReward.icon}
                        </div>
                        <h2>{selectedReward.name}</h2>
                        <p className="modal-description">{selectedReward.description}</p>
                        <div className="modal-details">
                            <span className="detail-badge">🔓 Desbloqueado</span>
                            <span className="detail-badge">📅 {selectedReward.streakRequired} días</span>
                        </div>
                        <button className="modal-btn" onClick={closeModal}>
                            ¡Genial!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}