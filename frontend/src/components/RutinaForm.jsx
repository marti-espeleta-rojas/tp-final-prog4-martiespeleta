/**
 * COMPONENTE: RutinaForm.jsx
 * DESCRIPCIÓN: Formulario para crear/editar rutinas
 * 
 * RESPONSABILIDADES:
 * - Validar datos del usuario
 * - Enviar datos al backend
 * - Gestionar ejercicios de la rutina
 * - IMPORTANTE: Sincronizar cambios con backend INMEDIATAMENTE
 */

import { useState } from 'react';
import { crearRutina, actualizarRutina } from '../api';
import ExerciseForm from './ExerciseForm';

function RutinaForm({ rutina, onCreado, onCancelar }) {
  // =========================================================================
  // ESTADO DEL FORMULARIO - RUTINA
  // =========================================================================

  const [nombre, setNombre] = useState(rutina?.nombre || '');
  const [descripcion, setDescripcion] = useState(rutina?.descripcion || '');
  const [ejercicios, setEjercicios] = useState(rutina?.ejercicios || []);
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({});

  // =========================================================================
  // ESTADO - MODAL DE EJERCICIO
  // =========================================================================

  const [mostrarModalEjercicio, setMostrarModalEjercicio] = useState(false);
  const [ejercicioEnEdicion, setEjercicioEnEdicion] = useState(null);

  // =========================================================================
  // VALIDACIÓN
  // =========================================================================

  function validar() {
    const nuevosErrores = {};

    if (!nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }

    if (ejercicios.length === 0) {
      nuevosErrores.ejercicios = 'Debes agregar al menos un ejercicio';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  // =========================================================================
  // FUNCIONES DE EJERCICIOS
  // =========================================================================

  /**
   * Abre el modal para crear un nuevo ejercicio
   */
  function abrirCrearEjercicio() {
    setEjercicioEnEdicion(null);
    setMostrarModalEjercicio(true);
  }

  /**
   * Abre el modal para editar un ejercicio existente
   */
  function abrirEditarEjercicio(ejercicio) {
    setEjercicioEnEdicion(ejercicio);
    setMostrarModalEjercicio(true);
  }

  /**
   * Cierra el modal de ejercicio
   */
  function cerrarModalEjercicio() {
    setMostrarModalEjercicio(false);
    setEjercicioEnEdicion(null);
  }

  /**
   * Guarda un ejercicio (nuevo o editado)
   * IMPORTANTE: Si es rutina existente, sincroniza inmediatamente con backend
   */
  async function guardarEjercicio(datosEjercicio) {
    let nuevosEjercicios;

    if (ejercicioEnEdicion) {
      // Estamos editando un ejercicio existente
      nuevosEjercicios = ejercicios.map(ej =>
        ej.id === ejercicioEnEdicion.id
          ? { ...ej, ...datosEjercicio }
          : ej
      );
    } else {
      // Estamos creando un nuevo ejercicio
      const nuevoEjercicio = {
        id: `temp_${Date.now()}`,
        ...datosEjercicio,
        orden: ejercicios.length
      };
      nuevosEjercicios = [...ejercicios, nuevoEjercicio];
    }

    // Actualizar estado local
    setEjercicios(nuevosEjercicios);

    // IMPORTANTE: Si es rutina existente, sincronizar con backend AHORA
    if (rutina && rutina.id) {
      try {
        setCargando(true);

        // Preparar datos para enviar
        const ejerciciosParaEnviar = nuevosEjercicios.map((ej, idx) => ({
          id: typeof ej.id === 'string' && ej.id.startsWith('temp_') ? null : ej.id,
          nombre: ej.nombre,
          dia_semana: ej.dia_semana,
          series: ej.series,
          repeticiones: ej.repeticiones,
          peso: ej.peso || null,
          notas: ej.notas || null,
          orden: ej.orden || idx
        }));

        const datosRutina = {
          nombre: nombre.trim(),
          descripcion: descripcion.trim() || null,
          ejercicios: ejerciciosParaEnviar
        };

        // Enviar al backend INMEDIATAMENTE
        await actualizarRutina(rutina.id, datosRutina);
      } catch (error) {
        setErrores({ submit: `Error al guardar ejercicio: ${error.message}` });
      } finally {
        setCargando(false);
      }
    }

    cerrarModalEjercicio();
  }

  /**
   * Elimina un ejercicio
   * IMPORTANTE: Si es rutina existente, sincroniza inmediatamente con backend
   */
  async function eliminarEjercicio(id) {
    if (!window.confirm('¿Eliminar este ejercicio?')) {
      return;
    }

    const nuevosEjercicios = ejercicios.filter(ej => ej.id !== id);
    setEjercicios(nuevosEjercicios);

    // IMPORTANTE: Si es rutina existente, sincronizar con backend AHORA
    if (rutina && rutina.id) {
      try {
        setCargando(true);

        // Preparar datos para enviar
        const ejerciciosParaEnviar = nuevosEjercicios.map((ej, idx) => ({
          id: typeof ej.id === 'string' && ej.id.startsWith('temp_') ? null : ej.id,
          nombre: ej.nombre,
          dia_semana: ej.dia_semana,
          series: ej.series,
          repeticiones: ej.repeticiones,
          peso: ej.peso || null,
          notas: ej.notas || null,
          orden: ej.orden || idx
        }));

        const datosRutina = {
          nombre: nombre.trim(),
          descripcion: descripcion.trim() || null,
          ejercicios: ejerciciosParaEnviar
        };

        // Enviar al backend INMEDIATAMENTE
        await actualizarRutina(rutina.id, datosRutina);
      } catch (error) {
        setErrores({ submit: `Error al eliminar ejercicio: ${error.message}` });
      } finally {
        setCargando(false);
      }
    }
  }

  // =========================================================================
  // ENVÍO DEL FORMULARIO
  // =========================================================================

  /**
   * Envía la rutina completa al backend
   * Se usa solo cuando se crea una rutina NUEVA
   * Para rutinas existentes, ya se sincroniza en guardarEjercicio()
   */
  async function manejarSubmit(e) {
    e.preventDefault();

    if (!validar()) {
      return;
    }

    try {
      setCargando(true);

      // Preparar datos de ejercicios para enviar
      const ejerciciosParaEnviar = ejercicios.map((ej, idx) => ({
        id: typeof ej.id === 'string' && ej.id.startsWith('temp_') ? null : ej.id,
        nombre: ej.nombre,
        dia_semana: ej.dia_semana,
        series: ej.series,
        repeticiones: ej.repeticiones,
        peso: ej.peso || null,
        notas: ej.notas || null,
        orden: ej.orden || idx
      }));

      const datosRutina = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || null,
        ejercicios: ejerciciosParaEnviar
      };

      if (rutina && rutina.id) {
        // Solo actualizar nombre/descripción (ejercicios ya se sincronizaron)
        await actualizarRutina(rutina.id, datosRutina);
      } else {
        // Crear rutina nueva con ejercicios
        await crearRutina(datosRutina);
      }

      onCreado();
    } catch (error) {
      setErrores({ submit: error.message });
    } finally {
      setCargando(false);
    }
  }

  // =========================================================================
  // RENDERIZAR
  // =========================================================================

  return (
    <div className="formulario-container">
      <h2>{rutina ? 'Editar Rutina' : 'Nueva Rutina'}</h2>

      <form onSubmit={manejarSubmit} className="formulario">
        {/* Campo: Nombre */}
        <div className="campo-grupo">
          <label htmlFor="nombre">Nombre de la Rutina *</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Rutina Pecho y Triceps"
            disabled={cargando}
          />
          {errores.nombre && <span className="error">{errores.nombre}</span>}
        </div>

        {/* Campo: Descripción */}
        <div className="campo-grupo">
          <label htmlFor="descripcion">Descripción (opcional)</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe tu rutina..."
            rows="3"
            disabled={cargando}
          />
        </div>

        {/* Sección: Ejercicios */}
        <div className="campo-grupo">
          <h3>Ejercicios ({ejercicios.length})</h3>

          {ejercicios.length === 0 ? (
            <p className="info">No hay ejercicios agregados aún.</p>
          ) : (
            <div className="lista-ejercicios">
              {ejercicios.map((ej) => (
                <div key={ej.id} className="item-ejercicio">
                  <div>
                    <strong>{ej.nombre}</strong>
                    <p>{ej.dia_semana} - {ej.series}x{ej.repeticiones}</p>
                    {ej.peso && <p>Peso: {ej.peso} kg</p>}
                    {ej.notas && <p>Notas: {ej.notas}</p>}
                  </div>
                  <div className="acciones-ejercicio">
                    <button
                      type="button"
                      className="btn btn-small btn-warning"
                      onClick={() => abrirEditarEjercicio(ej)}
                      disabled={cargando || mostrarModalEjercicio}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-small btn-danger"
                      onClick={() => eliminarEjercicio(ej.id)}
                      disabled={cargando || mostrarModalEjercicio}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {errores.ejercicios && (
            <span className="error">{errores.ejercicios}</span>
          )}

          <button
            type="button"
            className="btn btn-secondary"
            onClick={abrirCrearEjercicio}
            disabled={cargando || mostrarModalEjercicio}
          >
            + Agregar Ejercicio
          </button>
        </div>

        {/* Modal de Ejercicio */}
        {mostrarModalEjercicio && (
          <div className="modal-ejercicio">
            <div className="modal-contenido">
              <ExerciseForm
                ejercicio={ejercicioEnEdicion}
                onAgregar={guardarEjercicio}
              />
            </div>
          </div>
        )}

        {/* Errores generales */}
        {errores.submit && (
          <div className="alerta-error">{errores.submit}</div>
        )}

        {/* Botones de acción */}
        <div className="botones-formulario">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={cargando || mostrarModalEjercicio}
          >
            {cargando ? 'Guardando...' : rutina ? 'Finalizar Edición' : 'Crear Rutina'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancelar}
            disabled={cargando}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}


export default RutinaForm;

















