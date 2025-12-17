/**
 * MÓDULO: api.js
 * DESCRIPCIÓN: Manejo de comunicaciones HTTP con el backend
 * RESPONSABILIDADES:
 * - Centralizar todas las llamadas fetch al API
 * - Manejar errores de red y del servidor
 * - Proporcionar funciones reutilizables para cada operación CRUD
 */

// URL base del backend
// Se puede configurar con variable de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * FUNCIÓN AUXILIAR: handleResponse
 * 
 * RESPONSABILIDADES:
 * - Convertir respuesta JSON
 * - Manejar errores HTTP (4xx, 5xx)
 * - Proporcionar mensajes de error consistentes
 * 
 * PARÁMETROS:
 * - response: Objeto Response de fetch
 * 
 * RETORNA:
 * - JSON parseado si está OK
 * - Lanza error si no está OK
 */
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error: ${response.status} ${response.statusText}`);
  }
  
  // Para DELETE con status 204, no hay contenido
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
}

// ============================================================================
// OPERACIONES CRUD DE RUTINAS
// ============================================================================

/**
 * OPERACIÓN: Obtener todas las rutinas
 * 
 * MÉTODO: GET /api/rutinas
 * 
 * RESPONSABILIDADES:
 * - Recuperar lista completa de rutinas
 * - Retornar en formato consistente
 * 
 * RETORNA:
 * - Array de objetos Rutina
 */
export async function getRutinas() {
  const response = await fetch(`${API_BASE_URL}/rutinas`);
  return handleResponse(response);
}

/**
 * OPERACIÓN: Obtener una rutina específica con todos sus ejercicios
 * 
 * MÉTODO: GET /api/rutinas/{id}
 * 
 * RESPONSABILIDADES:
 * - Obtener detalle completo de una rutina
 * - Incluir todos sus ejercicios organizados
 * 
 * PARÁMETROS:
 * - id: ID de la rutina
 * 
 * RETORNA:
 * - Objeto Rutina completo con ejercicios
 */
export async function getRutina(id) {
  const response = await fetch(`${API_BASE_URL}/rutinas/${id}`);
  return handleResponse(response);
}

/**
 * OPERACIÓN: Buscar rutinas por nombre
 * 
 * MÉTODO: GET /api/rutinas/buscar/nombre?nombre={texto}
 * 
 * RESPONSABILIDADES:
 * - Búsqueda parcial case-insensitive
 * - Retornar coincidencias en tiempo real
 * 
 * PARÁMETROS:
 * - nombre: Texto a buscar
 * 
 * RETORNA:
 * - Array de Rutinas que coinciden
 */
export async function buscarRutinas(nombre) {
  const params = new URLSearchParams({ nombre });
  const response = await fetch(`${API_BASE_URL}/rutinas/buscar/nombre?${params}`);
  return handleResponse(response);
}

/**
 * OPERACIÓN: Crear una nueva rutina
 * 
 * MÉTODO: POST /api/rutinas
 * 
 * RESPONSABILIDADES:
 * - Crear rutina con datos validados
 * - Opcionalmente agregar ejercicios iniciales
 * 
 * PARÁMETROS:
 * - rutina: Objeto con { nombre, descripcion, ejercicios }
 * 
 * RETORNA:
 * - Objeto Rutina creado con ID asignado
 */
export async function crearRutina(rutina) {
  const response = await fetch(`${API_BASE_URL}/rutinas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rutina),
  });
  return handleResponse(response);
}

/**
 * OPERACIÓN: Actualizar una rutina existente
 * 
 * MÉTODO: PUT /api/rutinas/{id}
 * 
 * RESPONSABILIDADES:
 * - Actualizar nombre y descripción
 * - Validar que el nuevo nombre sea único
 * 
 * PARÁMETROS:
 * - id: ID de la rutina
 * - rutina: Objeto con campos a actualizar
 * 
 * RETORNA:
 * - Objeto Rutina actualizado
 */
export async function actualizarRutina(id, rutina) {
  const response = await fetch(`${API_BASE_URL}/rutinas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rutina),
  });
  return handleResponse(response);
}

/**
 * OPERACIÓN: Eliminar una rutina
 * 
 * MÉTODO: DELETE /api/rutinas/{id}
 * 
 * RESPONSABILIDADES:
 * - Eliminar rutina y todos sus ejercicios (cascada)
 * - Confirmar eliminación exitosa
 * 
 * PARÁMETROS:
 * - id: ID de la rutina a eliminar
 * 
 * RETORNA:
 * - null (sin contenido en respuesta 204)
 */
export async function eliminarRutina(id) {
  const response = await fetch(`${API_BASE_URL}/rutinas/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

// ============================================================================
// OPERACIONES CRUD DE EJERCICIOS - ELIMINADAS
// ============================================================================
// CAMBIO: Estos endpoints ya no existen porque todo se maneja desde Rutinas
// 
// AHORA SE USA:
// - Para agregar ejercicio: actualizarRutina(id, { ejercicios: [...] })
// - Para editar ejercicio: actualizarRutina(id, { ejercicios: [...] })
// - Para eliminar ejercicio: actualizarRutina(id, { ejercicios: [...] sin el ejercicio })
//
// Los siguientes son FUNCIONES AUXILIARES para mantener compatibilidad
// pero internamente usan actualizarRutina
// ============================================================================