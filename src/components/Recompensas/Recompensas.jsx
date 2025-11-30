import React, { useMemo } from 'react';
import '../../styles/sectionCommon.css';
import './Recompensas.css';

export default function Recompensas({ currentStreak = 0 }) {
    // Calcular los regalos desbloqueados (cada 10 de racha)
    const rewardsUnlocked = useMemo(() => {
        return Math.floor(currentStreak / 10);
    }, [currentStreak]);

    // Posición del muñequito en el árbol (porcentaje de progreso hacia el siguiente regalo)
    const progressToNextReward = useMemo(() => {
        const remainder = currentStreak % 10;
        return (remainder / 10) * 100;
    }, [currentStreak]);

    // Generar 10 ramas de regalos
    const rewards = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        level: i + 1,
        streakRequired: (i + 1) * 10,
        isUnlocked: rewardsUnlocked >= i + 1,
    }));

    return (
        <div className="section-container recompensas-container">
            <h2>Recompensas</h2>
            <p>Sube el árbol completando tu racha diaria. ¡Cada 10 días obtienes un regalo!</p>

            <div className="reward-tree-container">
                <div className="reward-tree">
                    {/* Tronco del árbol */}
                    <div className="tree-trunk"></div>

                    {/* Ramas con regalos */}
                    <div className="tree-branches">
                        {rewards.map((reward, index) => (
                            <div
                                key={reward.id}
                                className={`tree-branch branch-${index + 1} ${reward.isUnlocked ? 'unlocked' : 'locked'}`}
                            >
                                {/* Rama */}
                                <div className="branch-line"></div>

                                {/* Regalo */}
                                <div className="reward-gift">
                                    <span className="gift-emoji">{reward.isUnlocked ? '🎁' : '🔒'}</span>
                                    <span className="reward-label">+{reward.streakRequired}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Muñequito en el árbol */}
                    <div
                        className="climber"
                        style={{
                            bottom: `calc(${rewardsUnlocked * 10}% + ${progressToNextReward * 0.9}%)`,
                        }}
                    >
                        <span className="climber-emoji">🧗</span>
                    </div>
                </div>

                {/* Información de progreso */}
                <div className="reward-info">
                    <div className="info-card">
                        <h3>Racha Actual</h3>
                        <p className="info-value">{currentStreak}</p>
                        <p className="info-hint">días completados</p>
                    </div>

                    <div className="info-card">
                        <h3>Regalos Desbloqueados</h3>
                        <p className="info-value">{rewardsUnlocked}/10</p>
                        <p className="info-hint">sigue subiendo!</p>
                    </div>

                    <div className="info-card">
                        <h3>Próximo Regalo</h3>
                        <p className="info-value">{10 - (currentStreak % 10)}</p>
                        <p className="info-hint">días faltantes</p>
                    </div>
                </div>
            </div>

            {/* Mensaje motivacional */}
            <div className="motivation-message">
                {rewardsUnlocked === 10 && (
                    <p>🏆 ¡¡FELICIDADES!! ¡¡Has alcanzado el máximo de la torre!! ¡Eres un campeón! 🏆</p>
                )}
                {rewardsUnlocked > 0 && rewardsUnlocked < 10 && (
                    <p>🌟 ¡Vas muy bien! {10 - rewardsUnlocked} regalos más para llegar a la cima!</p>
                )}
                {rewardsUnlocked === 0 && (
                    <p>💪 ¡Comienza tu viaje! Completa 10 días de racha para desbloquear el primer regalo.</p>
                )}
            </div>
        </div>
    );
}
