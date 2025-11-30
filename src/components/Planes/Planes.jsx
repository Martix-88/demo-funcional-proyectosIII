import React, { useState, useEffect } from 'react';
import '../../styles/sectionCommon.css';
import './Planes.css';

export default function Planes() {
    const [currentPlan, setCurrentPlan] = useState('free');
    const [billingPeriod, setBillingPeriod] = useState('monthly'); // monthly or yearly
    const [showModal, setShowModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Cargar plan actual del localStorage
    useEffect(() => {
        const savedPlan = localStorage.getItem('currentPlan');
        if (savedPlan) {
            setCurrentPlan(savedPlan);
        }
    }, []);

    const plans = [
        {
            id: 'free',
            name: 'Gratuito',
            icon: '🆓',
            monthlyPrice: 0,
            yearlyPrice: 0,
            color: '#6b7280',
            features: [
                { text: 'Hasta 10 tareas diarias', included: true },
                { text: 'Calendario básico', included: true },
                { text: 'Racha de días', included: true },
                { text: '3 amigos máximo', included: true },
                { text: 'Sonidos limitados', included: true },
                { text: 'Sin anuncios', included: false },
                { text: 'Temas personalizados', included: false },
                { text: 'Sincronización en la nube', included: false },
            ],
            popular: false
        },
        {
            id: 'pro',
            name: 'Pro',
            icon: '⭐',
            monthlyPrice: 4.99,
            yearlyPrice: 49.99,
            color: '#567dd2',
            features: [
                { text: 'Tareas ilimitadas', included: true },
                { text: 'Calendario avanzado', included: true },
                { text: 'Estadísticas detalladas', included: true },
                { text: 'Amigos ilimitados', included: true },
                { text: 'Todos los sonidos', included: true },
                { text: 'Sin anuncios', included: true },
                { text: '5 temas personalizados', included: true },
                { text: 'Sincronización en la nube', included: true },
            ],
            popular: true
        },
        {
            id: 'premium',
            name: 'Premium',
            icon: '💎',
            monthlyPrice: 9.99,
            yearlyPrice: 99.99,
            color: '#22c55e',
            features: [
                { text: 'Todo lo de Pro', included: true },
                { text: 'Asistente IA personalizado', included: true },
                { text: 'Análisis predictivo', included: true },
                { text: 'Recomendaciones inteligentes', included: true },
                { text: 'Temas ilimitados', included: true },
                { text: 'Soporte prioritario 24/7', included: true },
                { text: 'Acceso anticipado a funciones', included: true },
                { text: 'Insignias exclusivas', included: true },
            ],
            popular: false
        }
    ];

    const handleSelectPlan = (plan) => {
        if (plan.id === currentPlan) return;
        setSelectedPlan(plan);
        setShowModal(true);
    };

    const confirmPlanChange = () => {
        if (selectedPlan) {
            setCurrentPlan(selectedPlan.id);
            localStorage.setItem('currentPlan', selectedPlan.id);
            setShowModal(false);
            setSelectedPlan(null);
        }
    };

    const calculateYearlySavings = (plan) => {
        const monthlyCost = plan.monthlyPrice * 12;
        const yearlyCost = plan.yearlyPrice;
        const savings = monthlyCost - yearlyCost;
        const percentage = Math.round((savings / monthlyCost) * 100);
        return { savings, percentage };
    };

    return (
        <div className="section-container planes-container">
            <div className="planes-header">
                <h2>💎 Planes y Suscripciones</h2>
                <p className="planes-subtitle">
                    Elige el plan perfecto para alcanzar tus objetivos
                </p>

                {/* Toggle de periodo de facturación */}
                <div className="billing-toggle">
                    <button
                        className={`billing-btn ${billingPeriod === 'monthly' ? 'active' : ''}`}
                        onClick={() => setBillingPeriod('monthly')}
                    >
                        Mensual
                    </button>
                    <button
                        className={`billing-btn ${billingPeriod === 'yearly' ? 'active' : ''}`}
                        onClick={() => setBillingPeriod('yearly')}
                    >
                        Anual
                        <span className="save-badge">Ahorra hasta 20%</span>
                    </button>
                </div>
            </div>

            {/* Tarjetas de planes */}
            <div className="plans-grid">
                {plans.map(plan => {
                    const isCurrentPlan = plan.id === currentPlan;
                    const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
                    const savings = calculateYearlySavings(plan);

                    return (
                        <div
                            key={plan.id}
                            className={`plan-card ${plan.popular ? 'popular' : ''} ${isCurrentPlan ? 'current' : ''}`}
                            style={{ '--plan-color': plan.color }}
                        >
                            {plan.popular && (
                                <div className="popular-badge">
                                    🔥 Más Popular
                                </div>
                            )}

                            {isCurrentPlan && (
                                <div className="current-badge">
                                    ✓ Plan Actual
                                </div>
                            )}

                            <div className="plan-header">
                                <div className="plan-icon">{plan.icon}</div>
                                <h3 className="plan-name">{plan.name}</h3>
                                <div className="plan-price">
                                    {price === 0 ? (
                                        <span className="price-free">Gratis</span>
                                    ) : (
                                        <>
                                            <span className="price-amount">€{price}</span>
                                            <span className="price-period">
                                                /{billingPeriod === 'monthly' ? 'mes' : 'año'}
                                            </span>
                                        </>
                                    )}
                                </div>
                                {billingPeriod === 'yearly' && price > 0 && (
                                    <div className="savings-info">
                                        Ahorras €{savings.savings.toFixed(2)} ({savings.percentage}%)
                                    </div>
                                )}
                            </div>

                            <ul className="features-list">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className={feature.included ? 'included' : 'excluded'}>
                                        <span className="feature-icon">
                                            {feature.included ? '✓' : '✗'}
                                        </span>
                                        {feature.text}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`select-plan-btn ${isCurrentPlan ? 'current' : ''}`}
                                onClick={() => handleSelectPlan(plan)}
                                disabled={isCurrentPlan}
                            >
                                {isCurrentPlan ? 'Plan Actual' : 'Seleccionar Plan'}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Comparación de características */}
            <div className="comparison-section">
                <h3>📊 Comparación Detallada</h3>
                <div className="comparison-table-wrapper">
                    <table className="comparison-table">
                        <thead>
                            <tr>
                                <th>Características</th>
                                <th>Gratuito</th>
                                <th>Pro</th>
                                <th>Premium</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Tareas diarias</td>
                                <td>10</td>
                                <td>Ilimitadas</td>
                                <td>Ilimitadas</td>
                            </tr>
                            <tr>
                                <td>Amigos</td>
                                <td>3</td>
                                <td>Ilimitados</td>
                                <td>Ilimitados</td>
                            </tr>
                            <tr>
                                <td>Temas</td>
                                <td>1</td>
                                <td>5</td>
                                <td>Ilimitados</td>
                            </tr>
                            <tr>
                                <td>Sincronización</td>
                                <td>❌</td>
                                <td>✅</td>
                                <td>✅</td>
                            </tr>
                            <tr>
                                <td>Asistente IA</td>
                                <td>❌</td>
                                <td>❌</td>
                                <td>✅</td>
                            </tr>
                            <tr>
                                <td>Soporte</td>
                                <td>Email</td>
                                <td>Email + Chat</td>
                                <td>Prioritario 24/7</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de confirmación */}
            {showModal && selectedPlan && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Confirmar Cambio de Plan</h3>
                        <p>
                            ¿Estás seguro de que quieres cambiar al plan <strong>{selectedPlan.name}</strong>?
                        </p>
                        {selectedPlan.id !== 'free' && (
                            <div className="modal-price-info">
                                <p>
                                    Precio: <strong>€{billingPeriod === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice}</strong>
                                    /{billingPeriod === 'monthly' ? 'mes' : 'año'}
                                </p>
                            </div>
                        )}
                        <div className="modal-buttons">
                            <button className="modal-btn confirm" onClick={confirmPlanChange}>
                                Confirmar
                            </button>
                            <button className="modal-btn cancel" onClick={() => setShowModal(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}