/**
 * COMPONENTE: RutinasList.jsx
 * DESCRIPCIÓN: Lista visual de todas las rutinas
 * 
 * RESPONSABILIDADES:
 * - Mostrar tarjetas de rutinas
 * - Permitir editar, ver detalle, eliminar
 * - Mostrar resumen de cada rutina
 */

import { useState } from 'react';
import { eliminarRutina } from '../api';

function RutinasList({ rutinas, onEditar, onVerDetalle, onActualizar, sinResultados }) {
  // Estado para confirmación de eliminación
  const [eliminando, setEliminando] = useState(null);

  /**
   * FUNCIÓN: manejarEliminar
   * 
   * RESPONSABILIDADES:
   * - Confirmar antes de eliminar
   * - Hacer llamada al API
   * - Actualizar lista
   */
  async function manejarEliminar(id) {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta rutina?')) {
      return;
    }

    try {
      setEliminando(id);
      await eliminarRutina(id);
      onActualizar(); // Recargar lista
    } catch (error) {
      alert(`Error al eliminar: ${error.message}`);
    } finally {
      setEliminando(null);
    }
  }

  // Si no hay resultados en búsqueda
  if (sinResultados) {
    return (
      <div className="sin-resultados">
        <p>No se encontraron rutinas con ese nombre.</p>
      </div>
    );
  }

  // Si la lista está vacía
  if (rutinas.length === 0) {
    return (
      <div className="sin-rutinas">
        <p>No hay rutinas creadas aún.</p>
        <p>Haz clic en "Nueva Rutina" para crear una.</p>
      </div>
    );
  }

  return (
    <div className="rutinas-container">
      {rutinas.map((rutina) => (
        <div key={rutina.id} className="tarjeta-rutina">
          <div className="tarjeta-header">
            <h3>{rutina.nombre}</h3>
            <span className="badge">
              {rutina.ejercicios?.length || 0} ejercicios
            </span>
          </div>

          {rutina.descripcion && (
            <p className="descripcion">{rutina.descripcion}</p>
          )}

          <p className="fecha">
            Creada: {new Date(rutina.fecha_creacion).toLocaleDateString()}
          </p>

          <div className="acciones">
            <button
              className="btn btn-info"
              onClick={() => onVerDetalle(rutina)}
            >
              Ver Detalle
            </button>
            <button
              className="btn btn-warning"
              onClick={() => onEditar(rutina)}
            >
              Editar
            </button>
            <button
              className="btn btn-danger"
              onClick={() => manejarEliminar(rutina.id)}
              disabled={eliminando === rutina.id}
            >
              {eliminando === rutina.id ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RutinasList;