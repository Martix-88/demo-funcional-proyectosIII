import React, { useState, useCallback, useEffect } from 'react';
import './NotePad.css';

const NotePad = ({ content, setContent }) => {
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [isRTL, setIsRTL] = useState(false);
    const editorRef = React.useRef(null);

    // Sync external content into editor when it changes
    useEffect(() => {
        const editor = editorRef.current;
        if (editor && content !== editor.innerHTML) {
            editor.innerHTML = content || '';
        }
    }, [content]);

    // Aplicar negrita al texto seleccionado
    const applyBold = useCallback(() => {
        const editor = editorRef.current;
        if (editor) {
            document.execCommand('bold', false, null);
            editor.focus();
        }
    }, []);

    // Aplicar color al texto seleccionado
    const applyColor = useCallback((color) => {
        const editor = editorRef.current;
        if (editor) {
            document.execCommand('foreColor', false, color);
            editor.focus();
            setSelectedColor(color);
        }
    }, []);

    // Justify / align
    const setAlign = useCallback((type) => {
        const editor = editorRef.current;
        if (!editor) return;
        if (type === 'left') document.execCommand('justifyLeft', false, null);
        if (type === 'center') document.execCommand('justifyCenter', false, null);
        if (type === 'right') document.execCommand('justifyRight', false, null);
        editor.focus();
    }, []);

    // Toggle text direction (RTL / LTR)
    const toggleDirection = useCallback(() => {
        const editor = editorRef.current;
        if (!editor) return;
        setIsRTL((prev) => {
            const next = !prev;
            editor.dir = next ? 'rtl' : 'ltr';
            editor.style.textAlign = next ? 'right' : 'left';
            editor.focus();
            return next;
        });
    }, []);

    // Limpiar formato
    const clearFormatting = useCallback(() => {
        const editor = editorRef.current;
        if (editor) {
            document.execCommand('removeFormat', false, null);
            editor.focus();
        }
    }, []);

    // Manejar cambios en el contenteditable
    const handleContentChange = (e) => {
        setContent(e.currentTarget.innerHTML);
    };

    return (
        <div className="notepad-container">
            <h3 className="notepad-title">📝 Bloc de Notas</h3>
            
            {/* Toolbar */}
            <div className="notepad-toolbar">
                <button 
                    className="toolbar-button bold-button" 
                    onClick={applyBold}
                    title="Negrita (Ctrl+B)"
                >
                    <strong>B</strong>
                </button>
                <button
                    className="toolbar-button align-button"
                    onClick={() => setAlign('left')}
                    title="Alinear a la izquierda"
                >
                    L
                </button>
                <button
                    className="toolbar-button align-button"
                    onClick={() => setAlign('center')}
                    title="Centrar"
                >
                    C
                </button>
                <button
                    className="toolbar-button align-button"
                    onClick={() => setAlign('right')}
                    title="Alinear a la derecha"
                >
                    R
                </button>

                <button
                    className="toolbar-button dir-button"
                    onClick={toggleDirection}
                    title="Alternar dirección RTL/LTR"
                >
                    ⇄
                </button>

                <div className="color-picker-wrapper">
                    <button 
                        className="toolbar-button color-button"
                        title="Color de texto"
                        onClick={() => document.querySelector('.color-input').click()}
                    >
                        <span 
                            className="color-dot" 
                            style={{ backgroundColor: selectedColor }}
                        ></span>
                    </button>
                    <input
                        type="color"
                        className="color-input"
                        value={selectedColor}
                        onChange={(e) => {
                            setSelectedColor(e.target.value);
                            applyColor(e.target.value);
                        }}
                    />
                </div>

                <button 
                    className="toolbar-button clear-button" 
                    onClick={clearFormatting}
                    title="Limpiar formato"
                >
                    ↺
                </button>
            </div>

            {/* Área de edición */}
            <div
                ref={editorRef}
                className="notepad-editor"
                contentEditable
                onInput={handleContentChange}
                suppressContentEditableWarning={true}
                title="Escribe libremente, aplica negrita o color"
                data-placeholder="Escribe aquí..."
            />
        </div>
    );
};

export default NotePad;
