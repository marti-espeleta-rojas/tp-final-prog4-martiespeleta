Frontend - Sistema de Gestión de Rutinas de Gimnasio
Descripción del Proyecto
Aplicación web moderna y responsiva desarrollada con React y Vite que proporciona una interfaz intuitiva para gestionar rutinas de entrenamiento de gimnasio. Permite crear, editar, visualizar y eliminar rutinas con sus ejercicios asociados.
Requisitos Previos

Node.js 16+
npm o yarn
Backend corriendo en http://localhost:8000

Instalación
1. Instalar dependencias
bashnpm install
2. Configurar variables de entorno
Crea un archivo .env en la raíz del proyecto frontend:
envVITE_API_URL=http://localhost:8000/api
Si tu backend corre en otro puerto, ajusta la URL acorde.
Ejecución
Modo desarrollo
bashnpm run dev
La aplicación estará disponible en: http://localhost:5173
Compilar para producción
bashnpm run build
Genera los archivos optimizados en la carpeta dist/
Preview de producción
bashnpm run preview
Estructura del Proyecto
frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── RutinasList.jsx     # Listado de rutinas
│   │   ├── RutinaForm.jsx      # Crear/editar rutinas
│   │   ├── RutinaDetail.jsx    # Ver detalle de rutina
│   │   ├── ExerciseForm.jsx    # Crear/editar ejercicios
│   │   └── SearchBar.jsx       # Barra de búsqueda
│   ├── App.jsx             # Componente raíz
│   ├── App.css             # Estilos principales
│   ├── api.js              # Llamadas HTTP al backend
│   └── main.jsx            # Punto de entrada
├── index.html              # HTML principal
├── package.json            # Dependencias
├── vite.config.js          # Configuración de Vite
├── .env                    # Variables de entorno
└── README.md              # Este archivo
Tecnologías Utilizadas

React 18.2: Librería para interfaces de usuario
Vite: Build tool y servidor de desarrollo
Fetch API: Para comunicación HTTP
CSS3: Estilos modernos y responsive

Funcionalidades Principales
1. Listar Rutinas

Ver todas las rutinas creadas
Mostrar información resumida (nombre, cantidad de ejercicios, fecha)
Interfaz responsiva con tarjetas

2. Crear Rutina

Formulario para nuevo plan de entrenamiento
Agregar múltiples ejercicios
Validación de datos

3. Editar Rutina

Modificar nombre y descripción
Agregar, editar o eliminar ejercicios
Actualizar información sincronizada

4. Ver Detalle

Visualización completa de rutina
Ejercicios organizados por día de la semana
Información detallada de cada ejercicio

5. Eliminar Rutina

Confirmación antes de eliminar
Eliminación en cascada de ejercicios

6. Buscar Rutinas

Búsqueda en tiempo real
Búsqueda case-insensitive
Resultados instantáneos

Flujo de la Aplicación
Inicio
  ↓
Listar Rutinas (Vista principal)
  ├─→ Nueva Rutina → Crear Rutina → Listar Rutinas
  ├─→ Editar → Editar Rutina → Listar Rutinas
  ├─→ Ver Detalle → Detalle Rutina
  │                      ├─→ Editar → Editar Rutina
  │                      └─→ Eliminar → Listar Rutinas
  └─→ Buscar → Mostrar Resultados
Componentes Principales
App.jsx
Componente raíz que gestiona:

Navegación entre vistas
Estado global de rutinas
Manejo de errores

RutinasList.jsx
Responsabilidades:

Mostrar tarjetas de rutinas
Botones para editar, ver detalle, eliminar
Confirmación de eliminación

RutinaForm.jsx
Responsabilidades:

Crear o editar rutinas
Gestionar lista de ejercicios
Validación de datos
Sincronización con backend

RutinaDetail.jsx
Responsabilidades:

Mostrar información completa
Organizar ejercicios por día
Permitir editar o eliminar

ExerciseForm.jsx
Responsabilidades:

Formulario para ejercicios
Validación de datos
Interfaz limpia y simple

SearchBar.jsx
Responsabilidades:

Búsqueda en tiempo real
Botón limpiar
Interfaz intuitiva

Comunicación con el Backend
El archivo api.js centraliza todas las llamadas HTTP:
javascript// Ejemplos de uso - TODO SE HACE DESDE RUTINAS
getRutinas()                              // GET /api/rutinas (retorna con ejercicios)
getRutina(id)                            // GET /api/rutinas/{id}
buscarRutinas(nombre)                    // GET /api/rutinas/buscar/nombre (retorna con ejercicios)
crearRutina(datos)                       // POST /api/rutinas (incluye ejercicios)
actualizarRutina(id, datos)              // PUT /api/rutinas/{id} (actualiza todo incluido ejercicios)
eliminarRutina(id)                       // DELETE /api/rutinas/{id}

// NOTA: Los siguientes ya NO existen
// agregarEjercicio()    - Usar actualizarRutina() con array de ejercicios
// actualizarEjercicio() - Usar actualizarRutina() con array de ejercicios
// eliminarEjercicio()   - Usar actualizarRutina() sin el ejercicio en el array
Validaciones en Cliente

✓ Nombre de rutina no vacío
✓ Al menos un ejercicio por rutina
✓ Nombre de ejercicio requerido
✓ Series > 0
✓ Repeticiones > 0
✓ Peso positivo (si se proporciona)
✓ Día de la semana válido

Manejo de Estados

cargando: Indica si se está consultando el backend
error: Mensaje de error a mostrar
rutinas: Lista de todas las rutinas
vistaActual: Qué componente mostrar ('lista', 'crear', 'editar', 'detalle')

Estilos y Diseño
Colores

Primario: #667eea (Morado)
Secundario: #764ba2 (Morado oscuro)
Peligro: #f44336 (Rojo)
Advertencia: #ff9800 (Naranja)

Características

Responsive design (mobile, tablet, desktop)
Transiciones suaves
Hover effects en botones
Gradientes en headers
Tarjetas con sombras

Solución de Problemas
Error: "Cannot reach backend"

Verifica que el backend esté corriendo en http://localhost:8000
Verifica la URL en .env

Error: "CORS error"

Asegúrate que FastAPI tiene CORS configurado
El backend debe aceptar requests desde http://localhost:5173

La búsqueda no funciona

Verifica que el backend esté corriendo
Abre la consola del navegador para ver errores

Los estilos no se aplican

Limpiar cache: Ctrl+F5
Reiniciar servidor de desarrollo

Notas Importantes

La comunicación con el backend usa Fetch API (sin dependencias externas)
Todos los errores se muestran en alertas
Los cambios se sincronizan inmediatamente con el backend
La aplicación es completamente responsiva
Los estilos están en un único archivo CSS

Variables de Entorno
VariableDescripciónValor por defectoVITE_API_URLURL del backendhttp://localhost:8000/api
Mejoras Futuras

Autenticación de usuarios
Historial de cambios
Exportar rutinas a PDF
Calendario de entrenamiento
Estadísticas de rutinas