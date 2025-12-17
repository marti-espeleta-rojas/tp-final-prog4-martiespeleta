
/**
 * COMPONENTE: ExerciseForm.jsx
 * DESCRIPCIÓN: Formulario para agregar/editar ejercicios
 * 
 * RESPONSABILIDADES:
 * - Validar datos del ejercicio
 * - Proporcionar interfaz para ingresar datos
 * - Manejar días de la semana
 * - Mostrar todos los campos de un ejercicio
 */

import { useState, useEffect } from 'react';

const DIAS_SEMANA = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
];

function ExerciseForm({ ejercicio, onAgregar, onCancelar }) {
  // =========================================================================
  // ESTADO DEL FORMULARIO
  // =========================================================================

  const [nombre, setNombre] = useState(ejercicio?.nombre || '');
  const [diaSemana, setDiaSemana] = useState(ejercicio?.dia_semana || 'Lunes');
  const [series, setSeries] = useState(ejercicio?.series?.toString() || '3');
  const [repeticiones, setRepeticiones] = useState(ejercicio?.repeticiones?.toString() || '10');
  const [peso, setPeso] = useState(ejercicio?.peso?.toString() || '');
  const [notas, setNotas] = useState(ejercicio?.notas || '');
  const [errores, setErrores] = useState({});

  // =========================================================================
  // EFECTOS
  // =========================================================================

  // Resetear formulario cuando cambia el ejercicio
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNombre(ejercicio?.nombre || '');
    setDiaSemana(ejercicio?.dia_semana || 'Lunes');
    setSeries(ejercicio?.series?.toString() || '3');
    setRepeticiones(ejercicio?.repeticiones?.toString() || '10');
    setPeso(ejercicio?.peso ? ejercicio.peso.toString() : '');
    setNotas(ejercicio?.notas || '');
    setErrores({});
  }, [ejercicio]);

  // =========================================================================
  // VALIDACIÓN
  // =========================================================================

  /**
   * FUNCIÓN: validar
   * 
   * RESPONSABILIDADES:
   * - Validar nombre no vacío
   * - Validar series > 0
   * - Validar repeticiones > 0
   * - Validar peso > 0 (si se proporciona)
   * - Validar día válido
   */
  function validar() {
    const nuevosErrores = {};

    if (!nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }

    const seriesNum = parseInt(series);
    if (!series || isNaN(seriesNum) || seriesNum <= 0) {
      nuevosErrores.series = 'Las series deben ser un número mayor a 0';
    }

    const repeticionesNum = parseInt(repeticiones);
    if (!repeticiones || isNaN(repeticionesNum) || repeticionesNum <= 0) {
      nuevosErrores.repeticiones = 'Las repeticiones deben ser un número mayor a 0';
    }

    if (peso) {
      const pesoNum = parseFloat(peso);
      if (isNaN(pesoNum) || pesoNum <= 0) {
        nuevosErrores.peso = 'El peso debe ser un número mayor a 0';
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  // =========================================================================
  // ENVÍO DEL FORMULARIO
  // =========================================================================

  /**
   * FUNCIÓN: manejarSubmit
   * 
   * RESPONSABILIDADES:
   * - Validar datos
   * - Construir objeto de ejercicio
   * - Llamar callback con datos
   */
  function manejarSubmit(e) {
    e.preventDefault();

    if (!validar()) {
      return;
    }

    const datosEjercicio = {
      nombre: nombre.trim(),
      dia_semana: diaSemana,
      series: parseInt(series),
      repeticiones: parseInt(repeticiones),
      peso: peso ? parseFloat(peso) : null,
      notas: notas.trim() || null,
      orden: ejercicio?.orden || 0
    };

    onAgregar(datosEjercicio);

    // Limpiar formulario solo si es crear nuevo
    if (!ejercicio) {
      setNombre('');
      setDiaSemana('Lunes');
      setSeries('3');
      setRepeticiones('10');
      setPeso('');
      setNotas('');
      setErrores({});
    }
  }

  // =========================================================================
  // RENDERIZAR
  // =========================================================================

  return (
    <div className="formulario-ejercicio">
      <h4>{ejercicio ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}</h4>

      <div onSubmit={manejarSubmit} className="form-ejercicio" style={{ display: 'contents' }}>
        {/* Nombre del ejercicio */}
        <div className="campo-grupo small">
          <label htmlFor="nombre-ej">Nombre *</label>
          <input
            id="nombre-ej"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Press de banca"
          />
          {errores.nombre && <span className="error">{errores.nombre}</span>}
        </div>

        {/* Día de la semana */}
        <div className="campo-grupo small">
          <label htmlFor="dia-ej">Día *</label>
          <select
            id="dia-ej"
            value={diaSemana}
            onChange={(e) => setDiaSemana(e.target.value)}
          >
            {DIAS_SEMANA.map(dia => (
              <option key={dia} value={dia}>{dia}</option>
            ))}
          </select>
        </div>

        {/* Series */}
        <div className="campo-grupo small">
          <label htmlFor="series-ej">Series *</label>
          <input
            id="series-ej"
            type="number"
            value={series}
            onChange={(e) => setSeries(e.target.value)}
            min="1"
          />
          {errores.series && <span className="error">{errores.series}</span>}
        </div>

        {/* Repeticiones */}
        <div className="campo-grupo small">
          <label htmlFor="rep-ej">Repeticiones *</label>
          <input
            id="rep-ej"
            type="number"
            value={repeticiones}
            onChange={(e) => setRepeticiones(e.target.value)}
            min="1"
          />
          {errores.repeticiones && <span className="error">{errores.repeticiones}</span>}
        </div>

        {/* Peso (opcional) */}
        <div className="campo-grupo small">
          <label htmlFor="peso-ej">Peso (kg) - Opcional</label>
          <input
            id="peso-ej"
            type="number"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            step="0.5"
            placeholder="Ej: 100"
          />
          {errores.peso && <span className="error">{errores.peso}</span>}
        </div>

        {/* Notas (opcional) */}
        <div className="campo-grupo small">
          <label htmlFor="notas-ej">Notas (opcional)</label>
          <textarea
            id="notas-ej"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Ej: Usar barra olimpica"
            rows="2"
          />
        </div>

        {/* Botones */}
        <div className="botones-ejercicio">
          <button type="button" onClick={manejarSubmit} className="btn btn-small btn-primary">
            {ejercicio ? 'Actualizar Ejercicio' : 'Agregar Ejercicio'}
          </button>
          <button
            type="button"
            className="btn btn-small btn-secondary"
            onClick={onCancelar}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExerciseForm;