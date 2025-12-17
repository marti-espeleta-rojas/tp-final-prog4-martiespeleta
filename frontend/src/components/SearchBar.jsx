/**
 * COMPONENTE: SearchBar.jsx
 * DESCRIPCIÓN: Barra de búsqueda en tiempo real
 * 
 * RESPONSABILIDADES:
 * - Permitir búsqueda mientras se escribe
 * - Llamar callback con texto de búsqueda
 * - Limpiar búsqueda cuando se borra el texto
 */

import { useState } from 'react';

function SearchBar({ onBusqueda }) {
  // =========================================================================
  // ESTADO
  // =========================================================================

  const [texto, setTexto] = useState('');

  // =========================================================================
  // MANEJADORES
  // =========================================================================

  /**
   * FUNCIÓN: manejarCambio
   * 
   * RESPONSABILIDADES:
   * - Actualizar estado local
   * - Llamar callback con nuevo texto
   */
  function manejarCambio(e) {
    const nuevoTexto = e.target.value;
    setTexto(nuevoTexto);
    onBusqueda(nuevoTexto);
  }

  /**
   * FUNCIÓN: limpiar
   * 
   * RESPONSABILIDADES:
   * - Limpiar campo de búsqueda
   * - Resetear búsqueda (mostrar todas las rutinas)
   */
  function limpiar() {
    setTexto('');
    onBusqueda('');
  }

  // =========================================================================
  // RENDERIZAR
  // =========================================================================

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Buscar rutina por nombre..."
        value={texto}
        onChange={manejarCambio}
        className="search-input"
      />
      {texto && (
        <button className="btn-limpiar" onClick={limpiar}>
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;