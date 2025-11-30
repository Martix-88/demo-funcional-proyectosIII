import React, { useState, useCallback, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import DailyTaskManager from '../DailyTaskManager/DailyTaskManager';
import NotePad from '../NotePad/NotePad';
import HeaderMenu from '../HeaderMenu/HeaderMenu';
import Amigos from '../Amigos/Amigos';
import Planes from '../Planes/Planes';
import Sonidos from '../Sonidos/Sonidos';
import { useLocalStorage } from '../../hooks/useLocalStorage';

import '@fullcalendar/common/main.css';
import './MyCalendar.css';

// Función de utilidad CRUCIAL para formatear la fecha a 'YYYY-MM-DD' local.
const formatDateToLocalISO = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Función auxiliar para calcular la racha
const calculateStreak = (dailyTasks) => {
    const completedDates = Object.keys(dailyTasks)
        .filter((dateKey) => dailyTasks[dateKey]?.isCompleted)
        .map((dateKey) => new Date(dateKey));

    if (completedDates.length === 0) return 0;

    completedDates.sort((a, b) => b - a);

    let currentStreak = 0;
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let checkingDate = new Date(today);
    let checkingDateKey = formatDateToLocalISO(checkingDate);

    if (dailyTasks[checkingDateKey]?.isCompleted) {
        currentStreak = 1;
    } else {
        checkingDate.setDate(checkingDate.getDate() - 1);
        checkingDateKey = formatDateToLocalISO(checkingDate);
        if (dailyTasks[checkingDateKey]?.isCompleted) {
            currentStreak = 1;
        } else {
            return 0;
        }
    }

    while (true) {
        checkingDate.setDate(checkingDate.getDate() - 1);
        checkingDateKey = formatDateToLocalISO(checkingDate);

        if (dailyTasks[checkingDateKey]?.isCompleted) {
            currentStreak++;
        } else {
            break;
        }
    }

    return currentStreak;
};

export default function MyCalendar({ onLogout, onLogoClick }) {
    const [dailyTasks, setDailyTasks] = useLocalStorage('dailyTasks', {});
    const [notepadContent, setNotepadContent] = useLocalStorage('notepadContent', '');
    const [selectedDate, setSelectedDate] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentView, setCurrentView] = useState('dayGridMonth');
    const [visibleDate, setVisibleDate] = useState(null);
    const [activeSection, setActiveSection] = useState('calendar');
    const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

    const currentStreak = useMemo(
        () => calculateStreak(dailyTasks),
        [dailyTasks]
    );

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

    const handleDateClick = useCallback((arg) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const clickedDate = new Date(arg.date);
        clickedDate.setHours(0, 0, 0, 0);
        
        // Solo permitir acceder a hoy o fechas futuras
        if (clickedDate >= today) {
            const localDateString = formatDateToLocalISO(arg.date);
            setSelectedDate(new Date(localDateString));
        }
    }, []);

    // Maneja cuando el rango/fecha de la vista cambia (permite detectar vista actual y fecha visible)
    const handleDatesSet = useCallback((arg) => {
        const viewType = arg.view?.type || 'dayGridMonth';
        setCurrentView(viewType);

        // Para la vista día, guardamos la fecha visible (arg.start es el día en la vista diaria)
        if (viewType === 'timeGridDay' || viewType === 'dayGridDay') {
            const localDateString = formatDateToLocalISO(arg.start);
            setVisibleDate(localDateString);
        } else {
            setVisibleDate(null);
        }
    }, []);

    const streakEvents = useMemo(() => {
        return Object.entries(dailyTasks)
            .filter(([, data]) => data.isCompleted)
            .map(([dateKey]) => ({
                title: '✅ Día Completado',
                start: dateKey,
                allDay: true,
                display: 'background',
                color: '#32cd3260',
            }));
    }, [dailyTasks]);

    // Mapear tareas a eventos que se mostrarán en el calendario (Mes/Semana/Día)
    const taskEvents = useMemo(() => {
        return Object.entries(dailyTasks).flatMap(([dateKey, data]) => {
            const tasks = (data && data.tasks) || [];
            return tasks.map((task) => ({
                id: `${dateKey}-${task.id}`,
                title: task.text,
                start: dateKey,
                allDay: true,
                className: task.completed ? 'task-event completed-task' : 'task-event',
            }));
        });
    }, [dailyTasks]);

    const allEvents = [...taskEvents, ...streakEvents];

    const handleCloseModal = useCallback(() => {
        setSelectedDate(null);
    }, []);

    // Permite alternar estado de tarea desde la vista Día (lista inferior)
    const toggleTaskFromDayView = useCallback((dateKey, taskId) => {
        let newTasks = [];
        setDailyTasks((prev) => {
            const day = prev[dateKey] || { tasks: [], isCompleted: false };
            newTasks = day.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
            const updated = {
                ...prev,
                [dateKey]: {
                    ...day,
                    tasks: newTasks,
                    isCompleted: newTasks.every((t) => t.completed) && newTasks.length > 0,
                },
            };
            return updated;
        });
        const allCompleted = newTasks.every((t) => t.completed) && newTasks.length > 0;
        updateCurrentStreak(dateKey, allCompleted);
    }, [setDailyTasks, updateCurrentStreak]);

    const deleteTaskFromDayView = useCallback((dateKey, taskId) => {
        let newTasks = [];
        setDailyTasks((prev) => {
            const day = prev[dateKey] || { tasks: [], isCompleted: false };
            newTasks = day.tasks.filter((t) => t.id !== taskId);
            const updated = {
                ...prev,
                [dateKey]: {
                    ...day,
                    tasks: newTasks,
                    isCompleted: newTasks.every((t) => t.completed) && newTasks.length > 0,
                },
            };
            return updated;
        });
        const allCompleted = newTasks.every((t) => t.completed) && newTasks.length > 0;
        updateCurrentStreak(dateKey, allCompleted);
    }, [setDailyTasks, updateCurrentStreak]);

    const handleLogoClick = () => {
        if (onLogoClick) {
            onLogoClick();
        }
    };

    return (
        <div className="calendar-container">
            {/* Header */}
            <header className="calendar-header">
                <div className="calendar-header-content">
                    {/* Botón V para volver al inicio */}
                    <button
                        className="calendar-home-button"
                        onClick={handleLogoClick}
                        title="Volver al inicio"
                    >
                        V
                    </button>

                    <h1 className="calendar-title">Vestigium</h1>

                    {/* Botón hamburguesa para móvil */}
                    <button
                        className="calendar-menu-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        ☰
                    </button>

                    {/* Menú desplegable en header */}
                    <HeaderMenu
                        isOpen={isHeaderMenuOpen}
                        onToggle={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
                        onSectionChange={setActiveSection}
                        onLogout={onLogout}
                        activeSection={activeSection}
                    />
                </div>
            </header>

            {/* Contenido principal */}
            <div className="calendar-main">
                {activeSection === 'calendar' && (
                    <>
                        {/* Display de la Racha */}
                        <div className="calendar-streak-card">
                            <h3 className="streak-title">Racha de Días Completados</h3>
                            <p className="streak-count">
                                {currentStreak}
                                <span className="streak-label"> días</span>
                            </p>
                            <p className="streak-message">
                                ¡Completa todas tus tareas diarias para mantener la racha!
                            </p>
                        </div>

                        {/* Calendario */}
                        <div className={`calendar-wrapper ${['timeGridDay','timeGridWeek','dayGridDay','dayGridWeek'].includes(currentView) ? 'compact-view' : ''}`}>
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                editable={true}
                                selectable={true}
                                events={allEvents}
                                dateClick={handleDateClick}
                                // Al hacer click en un evento, abrir el modal del día correspondiente
                                eventClick={(info) => {
                                    try {
                                        info.jsEvent.preventDefault();
                                    } catch (e) {}
                                    const start = info.event.start;
                                    if (start) {
                                        const localDateString = formatDateToLocalISO(start);
                                        setSelectedDate(new Date(localDateString));
                                        // seleccionar la tarea dentro del modal si el id tiene formato date-taskid
                                        const rawId = info.event.id || info.event.extendedProps?.id;
                                        if (rawId && rawId.includes('-')) {
                                            const parts = rawId.split('-');
                                            const taskId = parts.slice(1).join('-');
                                            setModalSelectedTaskId(taskId);
                                        } else {
                                            setModalSelectedTaskId(null);
                                        }
                                    }
                                }}
                                datesSet={handleDatesSet}
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                                }}
                                locale="es"
                                height="auto"
                            />
                        </div>

                        {/* Bloc de Notas */}
                        <NotePad 
                            content={notepadContent} 
                            setContent={setNotepadContent}
                        />

                        {/* Modal del Gestor de Tareas */}
                        {selectedDate && (
                            <DailyTaskManager
                                selectedDate={selectedDate}
                                dailyTasks={dailyTasks}
                                updateDailyTasks={updateDailyTasks}
                                updateCurrentStreak={updateCurrentStreak}
                                onClose={handleCloseModal}
                            />
                        )}
                    </>
                )}

                {activeSection === 'amigos' && <Amigos />}
                {activeSection === 'planes' && <Planes />}
                {activeSection === 'sonidos' && <Sonidos />}
            </div>
        </div>
    );
}
