import { useState, useEffect } from 'react';

/**
 * Hook para manejar datos en localStorage de forma sincronizada con React
 * @param {string} key - Clave del localStorage
 * @param {any} initialValue - Valor inicial si no existe en localStorage
 * @returns {[any, Function]} - [valor, setter]
 */
export const useLocalStorage = (key, initialValue) => {
    // Estado para guardar el valor
    // Paso una función como initialValue para que solo se ejecute una vez
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Obtener el item del localStorage
            const item = window.localStorage.getItem(key);
            // Si existe, parsearlo; si no, usar el valor inicial
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error al leer localStorage (${key}):`, error);
            return initialValue;
        }
    });

    // Función setter que también actualiza localStorage
    const setValue = (value) => {
        try {
            // Usar el setState funcional para asegurar que trabajamos con el valor más reciente
            setStoredValue((prev) => {
                const valueToStore = value instanceof Function ? value(prev) : value;
                try {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                } catch (err) {
                    console.error(`Error al escribir en localStorage (${key}):`, err);
                }
                return valueToStore;
            });
        } catch (error) {
            console.error(`Error al actualizar el estado localStorage (${key}):`, error);
        }
    };

    // Sincronizar cuando la clave cambia
    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        } catch (error) {
            console.error(`Error al sincronizar localStorage (${key}):`, error);
        }
    }, [key]);

    return [storedValue, setValue];
};
