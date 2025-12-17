/**
 * COMPONENTE: RutinaDetail.jsx
 * DESCRIPCIÓN: Vista detallada de una rutina con sus ejercicios
 * 
 * RESPONSABILIDADES:
 * - Mostrar información completa de la rutina
 * - Organizar ejercicios por día de la semana
 * - Permitir editar, eliminar, volver
 */

import { useState, useEffect } from 'react';
import { getRutina, eliminarRutina } from '../api';

function RutinaDetail({ rutina, onEditar, onVolver, onEliminar }) {
  // =========================================================================
  // ESTADO
  // =========================================================================

  const [rutinaDetalle, setRutinaDetalle] = useState(rutina);
  const [cargando, setCargando] = useState(!rutina);
  const [error, setError] = useState(null);

  // =========================================================================
  // EFECTOS
  // =========================================================================

  // Si no tenemos detalle, cargarlo del backend
  useEffect(() => {
    if (!rutina) return;

    async function cargarDetalle() {
      try {
        setCargando(true);
        const detalle = await getRutina(rutina.id);
        setRutinaDetalle(detalle);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargarDetalle();
  }, [rutina]);

  // =========================================================================
  // FUNCIONES
  // =========================================================================

  /**
   * FUNCIÓN: manejarEliminar
   * 
   * RESPONSABILIDADES:
   * - Confirmar eliminación
   * - Llamar API
   * - Volver a lista
   */
  async function manejarEliminar() {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta rutina y todos sus ejercicios?')) {
      return;
    }

    try {
      await eliminarRutina(rutinaDetalle.id);
      onEliminar();
    } catch (err) {
      setError(`Error al eliminar: ${err.message}`);
    }
  }

  /**
   * FUNCIÓN: agruparEjerciciosPorDia
   * 
   * RESPONSABILIDADES:
   * - Organizar ejercicios por día de la semana
   * - Retornar objeto con días como claves
   * 
   * RETORNA:
   * - { "Lunes": [...ejercicios], "Martes": [...] }
   */
  function agruparEjerciciosPorDia() {
    const agrupados = {};

    if (!rutinaDetalle.ejercicios) return agrupados;

    rutinaDetalle.ejercicios.forEach(ej => {
      if (!agrupados[ej.dia_semana]) {
        agrupados[ej.dia_semana] = [];
      }
      agrupados[ej.dia_semana].push(ej);
    });

    // Ordenar por día de la semana
    const diasOrdenados = [
      'Lunes', 'Martes', 'Miércoles', 'Jueves',
      'Viernes', 'Sábado', 'Domingo'
    ];

    const resultado = {};
    diasOrdenados.forEach(dia => {
      if (agrupados[dia]) {
        resultado[dia] = agrupados[dia].sort((a, b) => a.orden - b.orden);
      }
    });

    return resultado;
  }

  // =========================================================================
  // RENDERIZAR
  // =========================================================================

  if (cargando) {
    return <div className="cargando">Cargando detalle...</div>;
  }

  if (error) {
    return (
      <div className="error-detail">
        <p>Error: {error}</p>
        <button className="btn btn-secondary" onClick={onVolver}>
          Volver
        </button>
      </div>
    );
  }

  if (!rutinaDetalle) {
    return (
      <div className="error-detail">
        <p>Rutina no encontrada</p>
        <button className="btn btn-secondary" onClick={onVolver}>
          Volver
        </button>
      </div>
    );
  }

  const ejerciciosPorDia = agruparEjerciciosPorDia();

  return (
    <div className="rutina-detail">
      {/* Encabezado */}
      <div className="detail-header">
        <div>
          <h2>{rutinaDetalle.nombre}</h2>
          {rutinaDetalle.descripcion && (
            <p className="descripcion">{rutinaDetalle.descripcion}</p>
          )}
          <p className="fecha-creacion">
            Creada: {new Date(rutinaDetalle.fecha_creacion).toLocaleDateString()}
          </p>
        </div>

        <div className="detail-acciones">
          <button className="btn btn-warning" onClick={onEditar}>
            Editar
          </button>
          <button className="btn btn-danger" onClick={manejarEliminar}>
            Eliminar
          </button>
          <button className="btn btn-secondary" onClick={onVolver}>
            Volver
          </button>
        </div>
      </div>

      {/* Ejercicios */}
      <div className="detail-content">
        {Object.keys(ejerciciosPorDia).length === 0 ? (
          <p className="sin-ejercicios">Esta rutina no tiene ejercicios aún.</p>
        ) : (
          <div className="ejercicios-por-dia">
            {Object.entries(ejerciciosPorDia).map(([dia, ejercicios]) => (
              <div key={dia} className="dia-seccion">
                <h3>{dia}</h3>
                <div className="ejercicios-lista">
                  {ejercicios.map((ej, idx) => (
                    <div key={ej.id} className="ejercicio-item">
                      <div className="ejercicio-numero">
                        {idx + 1}
                      </div>
                      <div className="ejercicio-datos">
                        <h4>{ej.nombre}</h4>
                        <div className="stats">
                          <span className="stat">
                            <strong>Series:</strong> {ej.series}
                          </span>
                          <span className="stat">
                            <strong>Repeticiones:</strong> {ej.repeticiones}
                          </span>
                          {ej.peso && (
                            <span className="stat">
                              <strong>Peso:</strong> {ej.peso} kg
                            </span>
                          )}
                        </div>
                        {ej.notas && (
                          <p className="notas">
                            <strong>Notas:</strong> {ej.notas}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumen */}
      <div className="detail-summary">
        <p>
          Total de ejercicios: <strong>{rutinaDetalle.ejercicios?.length || 0}</strong>
        </p>
        <p>
          Días de entrenamiento: <strong>{Object.keys(ejerciciosPorDia).length}</strong>
        </p>
      </div>
    </div>
  );
}

export default RutinaDetail;