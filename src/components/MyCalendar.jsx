import React, { useState, useCallback, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import DailyTaskManager from './DailyTaskManager'; // <-- Importamos el componente modal

import '@fullcalendar/common/main.css';
import './MyCalendar.css';

// Función de utilidad CRUCIAL para formatear la fecha a 'YYYY-MM-DD' local.
// Esto garantiza que la clave de la tarea sea siempre la fecha local y evita problemas de zona horaria.
const formatDateToLocalISO = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Función auxiliar para calcular la racha (solo cuenta días consecutivos completados)
const calculateStreak = (dailyTasks) => {
    // Si no hay tareas completadas, la racha es 0
    const completedDates = Object.keys(dailyTasks)
        .filter((dateKey) => dailyTasks[dateKey]?.isCompleted)
        .map((dateKey) => new Date(dateKey));

    if (completedDates.length === 0) return 0;

    completedDates.sort((a, b) => b - a);

    let currentStreak = 0;

    // Configura la fecha de hoy a medianoche local (para usarla como punto de partida)
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let checkingDate = new Date(today);

    // 1. Chequear si hoy está completado (usando la clave local correcta)
    let checkingDateKey = formatDateToLocalISO(checkingDate);

    if (dailyTasks[checkingDateKey]?.isCompleted) {
        currentStreak = 1;
    } else {
        // 2. Chequear si ayer está completado
        checkingDate.setDate(checkingDate.getDate() - 1);
        // Usamos formatDateToLocalISO para obtener la clave local de ayer
        checkingDateKey = formatDateToLocalISO(checkingDate);
        if (dailyTasks[checkingDateKey]?.isCompleted) {
            currentStreak = 1;
        } else {
            return 0; // Si ni hoy ni ayer está completo, la racha es 0
        }
    }

    // 3. Iteramos hacia atrás para encontrar días consecutivos
    while (true) {
        checkingDate.setDate(checkingDate.getDate() - 1); // Restamos un día
        // Usamos formatDateToLocalISO para obtener la clave local
        checkingDateKey = formatDateToLocalISO(checkingDate);

        // Si el día está completado, incrementamos la racha y continuamos
        if (dailyTasks[checkingDateKey]?.isCompleted) {
            currentStreak++;
        } else {
            // Si el día no está completado, rompemos el bucle
            break;
        }
    }

    return currentStreak;
};

export default function MyCalendar() {
    // Estado para las tareas diarias (almacena el To-Do List y el estado de completado)
    const [dailyTasks, setDailyTasks] = useState({});

    // Estado para manejar la fecha seleccionada para abrir el modal
    const [selectedDate, setSelectedDate] = useState(null);

    // Racha, calculada en cada cambio de dailyTasks usando useMemo
    const currentStreak = useMemo(
        () => calculateStreak(dailyTasks),
        [dailyTasks]
    );

    // Función para actualizar las tareas de un día específico (pasa al DailyTaskManager)
    const updateDailyTasks = useCallback((dateKey, newTasks) => {
        setDailyTasks((prevTasks) => ({
            ...prevTasks,
            [dateKey]: {
                ...prevTasks[dateKey],
                tasks: newTasks,
                isCompleted:
                    newTasks.every((task) => task.completed) &&
                    newTasks.length > 0,
            },
        }));
    }, []);

    // Función para actualizar el estado de racha de un día (llamada desde el modal)
    const updateCurrentStreak = useCallback((dateKey, isCompleted) => {
        setDailyTasks((prevTasks) => {
            if (prevTasks[dateKey]?.isCompleted !== isCompleted) {
                return {
                    ...prevTasks,
                    [dateKey]: {
                        ...prevTasks[dateKey],
                        isCompleted: isCompleted,
                        tasks: prevTasks[dateKey]?.tasks || [],
                    },
                };
            }
            return prevTasks;
        });
    }, []);

    // Maneja el evento de click en una fecha del calendario
    const handleDateClick = useCallback((arg) => {
        // PERMITIDO: Se puede seleccionar cualquier fecha (pasada, presente o futura).

        // Corrección de zona horaria: Usamos formatDateToLocalISO para asegurar
        // que el objeto Date que se pasa al modal represente el día local correcto.
        const localDateString = formatDateToLocalISO(arg.date);

        // Creamos un nuevo objeto Date a partir de la cadena local para pasarlo al modal
        setSelectedDate(new Date(localDateString));
    }, []);

    // Cierra el modal de tareas
    const handleCloseModal = useCallback(() => {
        setSelectedDate(null);
    }, []);

    // Mapeamos las tareas diarias completadas a eventos visuales en el calendario
    const streakEvents = useMemo(() => {
        return Object.entries(dailyTasks)
            .filter(([, data]) => data.isCompleted)
            .map(([dateKey]) => ({
                title: '✅ Día Completado',
                start: dateKey,
                allDay: true,
                display: 'background', // Mostrar como fondo de color
                color: '#32cd3260', // Verde semi-transparente
            }));
    }, [dailyTasks]);

    // Eventos de ejemplo (manteniendo los eventos existentes)
    const exampleEvents = [
        {
            title: 'Clase de Ingeniería',
            start: '2025-11-10T10:00:00',
            end: '2025-11-10T12:00:00',
        },
        {
            title: 'Reunión del proyecto',
            start: '2025-11-11T14:00:00',
            end: '2025-11-11T15:30:00',
        },
    ];

    const allEvents = [...exampleEvents, ...streakEvents];

    return (
        <div
            style={{
                padding: '40px',
                maxWidth: '1200px',
                margin: '0 auto',
                flexGrow: 1,
            }}
        >
            {/* Display de la Racha */}
            <div
                style={{
                    marginBottom: '20px',
                    textAlign: 'center',
                    backgroundColor: '#061a38ff',
                    padding: '15px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                    color: 'white',
                }}
            >
                <h3 style={{ margin: 0, fontSize: '1.2em', color: '#567dd2' }}>
                    Racha de Días Completados
                </h3>
                <p
                    style={{
                        margin: '5px 0 0 0',
                        fontSize: '2.5em',
                        fontWeight: 'bold',
                        color: currentStreak > 0 ? '#32cd32' : '#ffc34d',
                    }}
                >
                    {currentStreak}
                    <span
                        style={{
                            fontSize: '0.6em',
                            fontWeight: 'normal',
                            color: '#ccc',
                            marginLeft: '10px',
                        }}
                    >
                        {' '}
                        días
                    </span>
                </p>
                <p
                    style={{
                        margin: '5px 0 0 0',
                        fontSize: '0.9em',
                        color: '#aaa',
                    }}
                >
                    ¡Completa todas tus tareas diarias para mantener la racha!
                </p>
            </div>

            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                editable={true}
                selectable={true}
                events={allEvents}
                dateClick={handleDateClick}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                locale="es"
                height="auto"
            />

            {/* Modal del Gestor de Tareas, solo visible si hay una fecha seleccionada */}
            {selectedDate && (
                <DailyTaskManager
                    selectedDate={selectedDate}
                    dailyTasks={dailyTasks}
                    updateDailyTasks={updateDailyTasks}
                    updateCurrentStreak={updateCurrentStreak}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}
