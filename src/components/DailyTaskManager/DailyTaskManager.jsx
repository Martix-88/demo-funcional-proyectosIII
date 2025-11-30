import React, { useState, useEffect } from 'react';
import './DailyTaskManager.css';

// --- Funciones y Componentes Auxiliares ---
const CheckIcon = ({ size = '1.2em' }) => (
    <span style={{ fontSize: size, color: '#32cd32' }}>✔</span>
);
const UncheckIcon = ({ size = '1.2em' }) => (
    <span style={{ fontSize: size, color: '#e5e5e5' }}>☐</span>
);
const AddIcon = ({ size = '1em' }) => (
    <span style={{ fontSize: size }}>➕</span>
);
const CloseIcon = ({ size = '1em' }) => (
    <span style={{ fontSize: size }}>❌</span>
);

const formatDate = (dateString) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};

// Función para obtener las tareas iniciales o establecer un default
const getInitialTasks = (dateKey, dailyTasks) => {
    if (dailyTasks[dateKey] && dailyTasks[dateKey].tasks) {
        return dailyTasks[dateKey].tasks;
    }
    return [];
};

const DailyTaskManager = ({
    selectedDate,
    dailyTasks,
    updateDailyTasks,
    updateCurrentStreak,
    onClose,
    initialTaskId = null,
}) => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const [tasks, setTasks] = useState(getInitialTasks(dateKey, dailyTasks));
    const [newTaskText, setNewTaskText] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingText, setEditingText] = useState('');

    useEffect(() => {
        setTasks(getInitialTasks(dateKey, dailyTasks));
        // open edit mode if initialTaskId provided
        if (initialTaskId) {
            const t = (dailyTasks[dateKey]?.tasks || []).find((x) => String(x.id) === String(initialTaskId));
            if (t) {
                setEditingTaskId(t.id);
                setEditingText(t.text);
            }
        }
    }, [dateKey, dailyTasks]);

    const toggleTask = (id) => {
        const newTasks = tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(newTasks);
        updateDailyTasks(dateKey, newTasks);

        const allCompleted =
            newTasks.every((task) => task.completed) && newTasks.length > 0;
        updateCurrentStreak(dateKey, allCompleted);
    };

    const startEditTask = (id) => {
        const t = tasks.find((x) => x.id === id);
        if (t) {
            setEditingTaskId(id);
            setEditingText(t.text);
        }
    };

    const saveEditTask = (e) => {
        e.preventDefault && e.preventDefault();
        if (editingTaskId == null) return;
        const newTasks = tasks.map((task) =>
            task.id === editingTaskId ? { ...task, text: editingText } : task
        );
        setTasks(newTasks);
        updateDailyTasks(dateKey, newTasks);
        setEditingTaskId(null);
        setEditingText('');
    };

    const cancelEditTask = () => {
        setEditingTaskId(null);
        setEditingText('');
    };

    const addTask = (e) => {
        e.preventDefault();
        if (newTaskText.trim()) {
            const newTask = {
                id: Date.now(),
                text: newTaskText.trim(),
                completed: false,
            };
            const newTasks = [...tasks, newTask];
            setTasks(newTasks);
            updateDailyTasks(dateKey, newTasks);
            setNewTaskText('');

            const allCompleted = newTasks.every((task) => task.completed);
            updateCurrentStreak(dateKey, allCompleted);
        }
    };

    // Verificar si la fecha es pasada
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dateKey);
    taskDate.setHours(0, 0, 0, 0);
    const isPastDate = taskDate < today;
    const canAddTasks = !isPastDate;

    const completedCount = tasks.filter((task) => task.completed).length;
    const totalCount = tasks.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    const isDayCompleted = progress === 100 && totalCount > 0;

    return (
        <div className="task-manager-backdrop">
            <div className="task-manager-modal">
                {/* Cabecera */}
                <div className="task-manager-header">
                    <h3 className="task-manager-title">
                        Tareas para {formatDate(dateKey)}
                    </h3>
                    <button className="task-manager-close" onClick={onClose}>
                        {CloseIcon({})} Cerrar
                    </button>
                </div>

                {/* Indicador de Progreso */}
                <div className="task-progress-section">
                    <p className="task-progress-text">
                        Progreso del Día:
                        <span className={isDayCompleted ? 'completed' : ''}>
                            {' '}
                            {completedCount}/{totalCount} tareas
                        </span>
                    </p>
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar-fill"
                            style={{
                                width: `${progress}%`,
                                backgroundColor: isDayCompleted ? '#32cd32' : '#567dd2',
                            }}
                        />
                    </div>
                    {isDayCompleted && (
                        <p className="day-completed-message">
                            ¡Día Completado! Racha Guardada.
                        </p>
                    )}
                </div>

                {/* Lista de Tareas */}
                <div className="tasks-list-container">
                    {tasks.length === 0 ? (
                        <p className="no-tasks-message">
                            No hay tareas para este día. ¡Añade una!
                        </p>
                    ) : (
                        tasks.map((task) => (
                            <div
                                key={task.id}
                                className="task-item"
                            >
                                <button
                                    className="task-toggle-button"
                                    onClick={() => toggleTask(task.id)}
                                    title={task.completed ? 'Marcar como no completada' : 'Marcar como completada'}
                                >
                                    <span className="task-icon">{task.completed ? CheckIcon({}) : UncheckIcon({})}</span>
                                </button>

                                {editingTaskId === task.id ? (
                                    <form className="task-edit-form" onSubmit={saveEditTask}>
                                        <input
                                            className="task-edit-input"
                                            value={editingText}
                                            onChange={(e) => setEditingText(e.target.value)}
                                            autoFocus
                                        />
                                        <button type="submit" className="task-save-button">Guardar</button>
                                        <button type="button" className="task-cancel-button" onClick={cancelEditTask}>Cancelar</button>
                                    </form>
                                ) : (
                                    <>
                                        <span
                                            className={`task-text ${task.completed ? 'completed' : ''}`}
                                        >
                                            {task.text}
                                        </span>
                                        <div className="task-actions">
                                            <button className="task-edit-button" onClick={() => startEditTask(task.id)} title="Editar">✎</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Formulario para Añadir Tarea */}
                {canAddTasks ? (
                    <form className="task-input-form" onSubmit={addTask}>
                        <input
                            type="text"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            placeholder="Nueva tarea..."
                            className="task-input"
                        />
                        <button type="submit" className="task-add-button">
                            {AddIcon({})} Añadir
                        </button>
                    </form>
                ) : (
                    <p className="task-input-form" style={{ textAlign: 'center', color: '#aaa', padding: '1rem' }}>
                        No se pueden añadir tareas en días pasados.
                    </p>
                )}
            </div>
        </div>
    );
};

export default DailyTaskManager;
