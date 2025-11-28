import React, { useState, useEffect } from 'react';

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
    // Tareas por defecto si es la primera vez que se abre el día
    return [
        { id: 1, text: 'Estudiar para el examen de React', completed: false },
        {
            id: 2,
            text: 'Terminar el informe del proyecto Vestigium',
            completed: false,
        },
        { id: 3, text: 'Enviar correo a profesor', completed: false },
    ];
};

const DailyTaskManager = ({
    selectedDate,
    dailyTasks,
    updateDailyTasks,
    updateCurrentStreak,
    onClose,
}) => {
    // La clave del día es crucial y debe ser el formato YYYY-MM-DD
    const dateKey = selectedDate.toISOString().split('T')[0];
    const [tasks, setTasks] = useState(getInitialTasks(dateKey, dailyTasks));
    const [newTaskText, setNewTaskText] = useState('');

    // Sincroniza las tareas del estado global cuando cambia la fecha
    useEffect(() => {
        setTasks(getInitialTasks(dateKey, dailyTasks));
    }, [dateKey, dailyTasks]);

    const toggleTask = (id) => {
        const newTasks = tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(newTasks);

        // 1. Notifica a MyCalendar sobre el cambio de tareas
        updateDailyTasks(dateKey, newTasks);

        // 2. Determina si el día está completado y notifica a MyCalendar para actualizar la racha
        const allCompleted =
            newTasks.every((task) => task.completed) && newTasks.length > 0;
        updateCurrentStreak(dateKey, allCompleted);
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

            // Recalcula la racha (si se añade una tarea incompleta, el día no está completo)
            const allCompleted = newTasks.every((task) => task.completed);
            updateCurrentStreak(dateKey, allCompleted);
        }
    };

    const completedCount = tasks.filter((task) => task.completed).length;
    const totalCount = tasks.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    const isDayCompleted = progress === 100 && totalCount > 0;

    // Estilos en línea para el modal (Reemplaza la dependencia de un archivo CSS local)
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    width: '450px',
                    backgroundColor: '#061a38ff',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                }}
            >
                {/* Cabecera */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #304b70',
                        paddingBottom: '10px',
                    }}
                >
                    <h3 style={{ margin: 0, color: 'white' }}>
                        Tareas para {formatDate(dateKey)}
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '5px 10px',
                            backgroundColor: '#e0e0e0',
                            color: '#061a38ff',
                            borderRadius: '5px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        {CloseIcon({})} Cerrar
                    </button>
                </div>

                {/* Indicador de Progreso */}
                <div
                    style={{
                        padding: '10px 0',
                        borderBottom: '1px solid #304b70',
                    }}
                >
                    <p
                        style={{
                            margin: '0',
                            color: '#ccc',
                            fontSize: '0.9em',
                        }}
                    >
                        Progreso del Día:
                        <span
                            style={{
                                fontWeight: 'bold',
                                color: isDayCompleted ? '#32cd32' : '#ffc34d',
                            }}
                        >
                            {' '}
                            {completedCount}/{totalCount} tareas
                        </span>
                    </p>
                    <div
                        style={{
                            height: '8px',
                            borderRadius: '4px',
                            backgroundColor: '#304b70',
                            marginTop: '5px',
                        }}
                    >
                        <div
                            style={{
                                width: `${progress}%`,
                                height: '100%',
                                borderRadius: '4px',
                                backgroundColor: isDayCompleted
                                    ? '#32cd32'
                                    : '#567dd2',
                                transition: 'width 0.5s',
                            }}
                        />
                    </div>
                    {isDayCompleted && (
                        <p
                            style={{
                                color: '#32cd32',
                                margin: '5px 0 0 0',
                                fontWeight: 'bold',
                            }}
                        >
                            ¡Día Completado! Racha Guardada.
                        </p>
                    )}
                </div>

                {/* Lista de Tareas */}
                <div
                    style={{
                        maxHeight: '300px',
                        overflowY: 'auto',
                        paddingRight: '10px',
                    }}
                >
                    {tasks.length === 0 ? (
                        <p
                            style={{
                                color: '#aaa',
                                textAlign: 'center',
                                padding: '15px 0',
                            }}
                        >
                            No hay tareas para este día. ¡Añade una!
                        </p>
                    ) : (
                        tasks.map((task) => (
                            <div
                                key={task.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '10px 0',
                                    borderBottom: '1px dotted #304b70',
                                    cursor: 'pointer',
                                }}
                                onClick={() => toggleTask(task.id)}
                            >
                                <span style={{ minWidth: '24px' }}>
                                    {task.completed
                                        ? CheckIcon({})
                                        : UncheckIcon({})}
                                </span>
                                <span
                                    style={{
                                        flexGrow: 1,
                                        marginLeft: '10px',
                                        color: task.completed
                                            ? '#aaa'
                                            : 'white',
                                        textDecoration: task.completed
                                            ? 'line-through'
                                            : 'none',
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    {task.text}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* Formulario para Añadir Tarea */}
                <form
                    onSubmit={addTask}
                    style={{
                        display: 'flex',
                        gap: '10px',
                        paddingTop: '10px',
                        borderTop: '1px solid #304b70',
                    }}
                >
                    <input
                        type="text"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        placeholder="Nueva tarea..."
                        style={{
                            flexGrow: 1,
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #567dd2',
                            backgroundColor: '#0f2747ff',
                            color: 'white',
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            backgroundColor: '#1613c1ff',
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '5px',
                            border: 'none',
                            color: 'white',
                            padding: '10px 15px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        {AddIcon({})} Añadir
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DailyTaskManager;
