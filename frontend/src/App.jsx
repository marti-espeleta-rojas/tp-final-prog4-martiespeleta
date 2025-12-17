/**
 * COMPONENTE: App.jsx
 * DESCRIPCIÓN: Componente raíz de la aplicación
 * 
 * RESPONSABILIDADES:
 * - Gestionar navegación entre vistas
 * - Mantener estado global de la aplicación
 * - Renderizar vista principal y componentes secundarios
 */

import { useState, useEffect } from 'react';
import './App.css';
import RutinasList from './components/RutinasList';
import RutinaForm from './components/RutinaForm';
import RutinaDetail from './components/RutinaDetail';
import SearchBar from './components/SearchBar';
import { getRutinas, buscarRutinas } from './api';

function App() {
  // =========================================================================
  // ESTADO DE LA APLICACIÓN
  // =========================================================================

  // Vista actual: 'lista', 'crear', 'editar', 'detalle'
  const [vistaActual, setVistaActual] = useState('lista');

  // Lista de todas las rutinas
  const [rutinas, setRutinas] = useState([]);

  // Rutina seleccionada (para editar o ver detalle)
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);

  // Resultados de búsqueda
  const [resultadosBusqueda, setResultadosBusqueda] = useState(null);

  // Estado de carga
  const [cargando, setCargando] = useState(false);

  // Mensajes de error
  const [error, setError] = useState(null);

  // =========================================================================
  // EFECTOS (Ejecutan código cuando cambia el estado)
  // =========================================================================

  // Al cargar la aplicación, obtener rutinas
  useEffect(() => {
    cargarRutinas();
  }, []);

  // =========================================================================
  // FUNCIONES DE LÓGICA DE NEGOCIO
  // =========================================================================

  /**
   * FUNCIÓN: cargarRutinas
   * 
   * RESPONSABILIDADES:
   * - Obtener todas las rutinas del backend
   * - Manejar estados de carga y error
   */
  async function cargarRutinas() {
    try {
      setCargando(true);
      setError(null);
      const data = await getRutinas();
      setRutinas(data);
      setResultadosBusqueda(null); // Limpiar búsqueda
    } catch (err) {
      setError(`Error al cargar rutinas: ${err.message}`);
      console.error(err);
    } finally {
      setCargando(false);
    }
  }

  /**
   * FUNCIÓN: manejarBusqueda
   * 
   * RESPONSABILIDADES:
   * - Buscar rutinas por nombre
   * - Si está vacío, mostrar todas las rutinas
   * - Manejar errores de búsqueda
   * 
   * PARÁMETROS:
   * - texto: Texto de búsqueda
   */
  async function manejarBusqueda(texto) {
    try {
      setError(null);
      if (!texto.trim()) {
        setResultadosBusqueda(null);
        return;
      }
      const resultados = await buscarRutinas(texto);
      setResultadosBusqueda(resultados);
    } catch (err) {
      setError(`Error en búsqueda: ${err.message}`);
      setResultadosBusqueda([]);
    }
  }

  /**
   * FUNCIÓN: manejarCreacion
   * 
   * RESPONSABILIDADES:
   * - Actualizar lista después de crear rutina
   * - Volver a la vista de lista
   */
  function manejarCreacion() {
    cargarRutinas();
    setVistaActual('lista');
  }

  /**
   * FUNCIÓN: manejarActualizacion
   * 
   * RESPONSABILIDADES:
   * - Actualizar lista después de editar rutina
   * - Volver a la vista de lista
   */
  function manejarActualizacion() {
    cargarRutinas();
    setVistaActual('lista');
    setRutinaSeleccionada(null);
  }

  /**
   * FUNCIÓN: manejarEliminar
   * 
   * RESPONSABILIDADES:
   * - Actualizar lista después de eliminar
   * - Cerrar vista actual
   */
  function manejarEliminar() {
    cargarRutinas();
    setVistaActual('lista');
    setRutinaSeleccionada(null);
  }

  /**
   * FUNCIÓN: editarRutina
   * 
   * RESPONSABILIDADES:
   * - Cambiar a vista de edición
   * - Mantener la rutina seleccionada
   */
  function editarRutina(rutina) {
    setRutinaSeleccionada(rutina);
    setVistaActual('editar');
  }

  /**
   * FUNCIÓN: verDetalleRutina
   * 
   * RESPONSABILIDADES:
   * - Cambiar a vista de detalle
   * - Obtener rutina seleccionada
   */
  function verDetalleRutina(rutina) {
    setRutinaSeleccionada(rutina);
    setVistaActual('detalle');
  }

  // =========================================================================
  // RENDERIZADO CONDICIONAL DE VISTAS
  // =========================================================================

  let contenido;

  if (cargando && vistaActual === 'lista') {
    contenido = <div className="cargando">Cargando rutinas...</div>;
  } else if (vistaActual === 'lista') {
    contenido = (
      <>
        <div className="controles">
          <button 
            className="btn btn-primary"
            onClick={() => setVistaActual('crear')}
          >
            + Nueva Rutina
          </button>
          <SearchBar onBusqueda={manejarBusqueda} />
        </div>
        <RutinasList
          rutinas={resultadosBusqueda !== null ? resultadosBusqueda : rutinas}
          onEditar={editarRutina}
          onVerDetalle={verDetalleRutina}
          onActualizar={manejarActualizacion}
          sinResultados={resultadosBusqueda !== null && resultadosBusqueda.length === 0}
        />
      </>
    );
  } else if (vistaActual === 'crear') {
    contenido = (
      <RutinaForm
        onCreado={manejarCreacion}
        onCancelar={() => setVistaActual('lista')}
      />
    );
  } else if (vistaActual === 'editar') {
    contenido = (
      <RutinaForm
        rutina={rutinaSeleccionada}
        onCreado={manejarActualizacion}
        onCancelar={() => setVistaActual('lista')}
      />
    );
  } else if (vistaActual === 'detalle') {
    contenido = (
      <RutinaDetail
        rutina={rutinaSeleccionada}
        onEditar={() => editarRutina(rutinaSeleccionada)}
        onVolver={() => setVistaActual('lista')}
        onActualizar={manejarActualizacion}
        onEliminar={manejarEliminar}
      />
    );
  }

  // =========================================================================
  // RENDERIZAR COMPONENTE
  // =========================================================================

  return (
    <div className="app">
      <header className="header">
        <h1>💪 Gestor de Rutinas de Gimnasio</h1>
        <p>Crea y gestiona tus planes de entrenamiento</p>
      </header>

      {error && (
        <div className="alerta-error">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <main className="contenido">
        {contenido}
      </main>

      <footer className="footer">
        <p>Sistema de Gestión de Rutinas - Programación 4 UTN</p>
      </footer>
    </div>
  );
}

export default App;