💪 Sistema de Gestión de Rutinas de Gimnasio

Un sistema web completo para crear, visualizar, modificar y eliminar rutinas de entrenamiento de gimnasio con una arquitectura moderna cliente-servidor.

🎯 Descripción del Proyecto
Este proyecto es un sistema integral de gestión de rutinas de entrenamiento desarrollado como trabajo final para la materia Programación 4 de la Universidad Tecnológica Nacional (UTN).
Características Principales
✅ Crear rutinas con nombre, descripción y múltiples ejercicios
✅ Visualizar rutinas en listado con información resumida
✅ Ver detalle completo de rutinas con ejercicios organizados por día
✅ Buscar rutinas por nombre en tiempo real (case-insensitive)
✅ Editar rutinas y sus ejercicios de forma intuitiva
✅ Eliminar rutinas con confirmación (cascada de eliminación)
✅ Agregar ejercicios a rutinas existentes con sincronización inmediata
✅ Editar ejercicios individuales desde un modal interactivo
✅ Interfaz responsiva adaptable a diferentes tamaños de pantalla

🏗️ Arquitectura del Sistema
┌─────────────────────────────────────────────────────────┐
│                   USUARIO (Navegador)                   │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP REST API
                       ↓
┌──────────────────────────────────────────────────────────┐
│              FRONTEND (React + Vite)                     │
│  • Componentes React modulares                          │
│  • Gestión de estado con hooks                          │
│  • Comunicación HTTP con Fetch API                      │
│  • Validación cliente-lado                              │
└──────────────────────┬──────────────────────────────────┘
                       │ SQL Queries
                       ↓
┌──────────────────────────────────────────────────────────┐
│              BACKEND (FastAPI + Python)                  │
│  • API RESTful con 6 endpoints                          │
│  • Validación Pydantic                                   │
│  • ORM SQLAlchemy                                        │
│  • Manejo de transacciones BD                           │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓
┌──────────────────────────────────────────────────────────┐
│           BASE DE DATOS (PostgreSQL)                     │
│  • Tabla: rutinas (1:N)                                 │
│  • Tabla: ejercicios (relación con CASCADE)             │
│  • Índices optimizados                                  │
└──────────────────────────────────────────────────────────┘

🛠️ Tecnologías Utilizadas
Frontend

React 18.2 - Librería para interfaz de usuario
Vite 4 - Build tool y servidor de desarrollo
Fetch API - Comunicación HTTP
CSS3 - Estilos modernos y responsive

Backend

Python 3.10+ - Lenguaje de programación
FastAPI - Framework web de alto rendimiento
SQLAlchemy - ORM para base de datos
Pydantic - Validación de datos
Uvicorn - Servidor ASGI

Base de Datos

PostgreSQL - Base de datos relacional


📁 Estructura del Proyecto
gym-routine-manager/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RutinasList.jsx           # Listado de rutinas
│   │   │   ├── RutinaForm.jsx            # Crear/Editar rutinas
│   │   │   ├── RutinaDetail.jsx          # Vista detallada
│   │   │   ├── ExerciseForm.jsx          # Formulario de ejercicio
│   │   │   └── SearchBar.jsx             # Búsqueda en tiempo real
│   │   ├── App.jsx                       # Componente raíz
│   │   ├── App.css                       # Estilos principales
│   │   ├── api.js                        # Llamadas HTTP al backend
│   │   └── main.jsx                      # Punto de entrada
│   ├── package.json
│   ├── vite.config.js
│   ├── .env                              # Variables de entorno
│   └── README.md
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                       # Punto de entrada FastAPI
│   │   ├── database.py                   # Configuración PostgreSQL
│   │   ├── models.py                     # Modelos ORM
│   │   ├── schemas.py                    # Esquemas Pydantic
│   │   └── routers/
│   │       └── rutinas.py                # Endpoints de la API
│   ├── requirements.txt                  # Dependencias Python
│   ├── .env                              # Variables de entorno
│   └── README.md
│
└── README.md                              # Este archivo

🚀 Instalación y Configuración
Requisitos Previos

Python 3.10+
Node.js 16+
PostgreSQL 12+
pip (Python) y npm (Node.js)

Backend
1. Crear entorno virtual
bashcd backend
python -m venv venv
venv\Scripts\activate  # En Windows
# source venv/bin/activate  # En Linux/Mac
2. Instalar dependencias
bashpip install -r requirements.txt
3. Configurar base de datos
Crea un archivo .env en la carpeta backend/:
envDATABASE_URL=postgresql://usuario:contraseña@localhost:5432/gym_routines_db
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true
Crea la base de datos en PostgreSQL:
sqlCREATE DATABASE gym_routines_db;
4. Ejecutar el servidor
bashuvicorn app.main:app --reload
El backend estará disponible en: http://localhost:8000
Documentación interactiva: http://localhost:8000/docs
Frontend
1. Instalar dependencias
bashcd frontend
npm install
2. Configurar variables de entorno
Crea un archivo .env en la carpeta frontend/:
envVITE_API_URL=http://localhost:8000/api
3. Ejecutar en desarrollo
bashnpm run dev
El frontend estará disponible en: http://localhost:5173

📊 Base de Datos
Modelo de Datos
Tabla: rutinas
sqlCREATE TABLE rutinas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);
Campos:

id: Identificador único (auto-generado)
nombre: Nombre descriptivo (debe ser único)
descripcion: Detalles opcionales
fecha_creacion: Timestamp de creación automático

Tabla: ejercicios
sqlCREATE TABLE ejercicios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rutina_id INTEGER FOREIGN KEY NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    dia_semana ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo') NOT NULL,
    series INTEGER NOT NULL,
    repeticiones INTEGER NOT NULL,
    peso FLOAT,
    notas TEXT,
    orden INTEGER DEFAULT 0
);
Campos:

id: Identificador único
rutina_id: Referencia a rutina (Foreign Key con CASCADE)
nombre: Nombre del ejercicio
dia_semana: Día en que se realiza
series: Número de series
repeticiones: Repeticiones por serie
peso: Peso en kg (opcional)
notas: Observaciones adicionales
orden: Posición del ejercicio en el día

Relación

1 Rutina puede tener Muchos Ejercicios
Si se elimina una Rutina → Sus Ejercicios se eliminan automáticamente (CASCADE)


🔌 Endpoints de la API
Rutinas
MétodoEndpointDescripciónGET/api/rutinasListar todas las rutinas con ejerciciosGET/api/rutinas/{id}Obtener detalle de una rutinaGET/api/rutinas/buscar/nombre?nombre={texto}Buscar rutinas por nombrePOST/api/rutinasCrear nueva rutina con ejerciciosPUT/api/rutinas/{id}Actualizar rutina y sus ejerciciosDELETE/api/rutinas/{id}Eliminar rutina y sus ejercicios
Ejemplo de Request: Crear Rutina
bashcurl -X POST http://localhost:8000/api/rutinas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Pecho y Triceps",
    "descripcion": "Entrenamiento de empuje",
    "ejercicios": [
      {
        "nombre": "Press de banca",
        "dia_semana": "Lunes",
        "series": 4,
        "repeticiones": 8,
        "peso": 100.0,
        "notas": "Barra olimpica",
        "orden": 0
      }
    ]
  }'
Ejemplo de Response
json{
  "id": 1,
  "nombre": "Pecho y Triceps",
  "descripcion": "Entrenamiento de empuje",
  "fecha_creacion": "2024-01-15T10:30:00",
  "ejercicios": [
    {
      "id": 1,
      "nombre": "Press de banca",
      "dia_semana": "Lunes",
      "series": 4,
      "repeticiones": 8,
      "peso": 100.0,
      "notas": "Barra olimpica",
      "orden": 0
    }
  ]
}

🎯 Funcionalidades Implementadas
1. Crear Rutina

Formulario para nombre y descripción
Agregar múltiples ejercicios en la misma operación
Validación de datos (nombre único, al menos 1 ejercicio)
Status 201 al crear exitosamente

2. Listar Rutinas

Vista de tarjetas con información resumida
Muestra cantidad de ejercicios
Fecha de creación
Botones para ver detalle, editar, eliminar

3. Ver Detalle

Información completa de la rutina
Ejercicios organizados por día de la semana
Ordenados por posición dentro del día
Muestra solo días con ejercicios asignados

4. Buscar Rutinas

Búsqueda parcial por nombre
Case-insensitive (ignora mayúsculas)
En tiempo real mientras escribes
Botón para limpiar búsqueda

5. Editar Rutina

Cambiar nombre y descripción
Modal para agregar nuevos ejercicios
Modal para editar ejercicios existentes
Cambiar orden de ejercicios
Eliminar ejercicios individuales
Sincronización inmediata con backend

6. Eliminar Rutina

Confirmación antes de eliminar
Eliminación en cascada de ejercicios
Status 204 al eliminar exitosamente


✅ Validaciones Implementadas
Cliente (Frontend)

✅ Nombre de rutina no vacío
✅ Al menos un ejercicio por rutina
✅ Nombre de ejercicio requerido
✅ Series > 0
✅ Repeticiones > 0
✅ Peso > 0 (si se proporciona)
✅ Día válido (enum)

Servidor (Backend)

✅ Nombre de rutina único
✅ Estructura JSON válida (Pydantic)
✅ Tipos de datos correctos
✅ Restricciones numéricas
✅ Existencia de recurso (404)
✅ Mensajes de error descriptivos

Base de Datos

✅ Unicidad de nombres
✅ Foreign Key constraints
✅ Cascade delete automático
✅ Tipos de datos correctos
✅ Índices optimizados


📱 Diseño Responsive
La aplicación está diseñada para funcionar en:

📱 Mobile (320px+)
📱 Tablet (768px+)
💻 Desktop (1024px+)

Utiliza:

Grid layout flexible
Media queries
Componentes adaptables


🧪 Testing
Test Manual: Crear Rutina

Haz clic en "Nueva Rutina"
Ingresa nombre: "Test Rutina"
Ingresa descripción: "Prueba"
Haz clic en "+ Agregar Ejercicio"
Completa: Press de banca, Lunes, 4x8, 100kg
Haz clic en "Crear Rutina"
Debe aparecer en el listado

Test Manual: Editar Rutina

Haz clic en "Editar" de una rutina
Haz clic en "+ Agregar Ejercicio"
Completa un nuevo ejercicio
Haz clic en "Agregar Ejercicio"
Debe aparecer inmediatamente
Haz clic en "Finalizar Edición"
Debe guardarse en BD

Verificación en PostgreSQL
sql-- Ver todas las rutinas
SELECT * FROM rutinas;

-- Ver ejercicios de una rutina
SELECT * FROM ejercicios WHERE rutina_id = 1;

-- Contar ejercicios por rutina
SELECT rutina_id, COUNT(*) as total_ejercicios 
FROM ejercicios 
GROUP BY rutina_id;

🔒 Seguridad

✅ CORS configurado correctamente
✅ Validación en ambas capas (cliente y servidor)
✅ Protección contra SQL injection (SQLAlchemy ORM)
✅ Constraint de unicidad en BD
✅ Cascade delete previene datos huérfanos
✅ Manejo de errores con mensajes seguros


📈 Rendimiento

✅ Índices en campos de búsqueda
✅ Lazy loading de relaciones
✅ Paginación lista para implementar
✅ Caché en frontend (estado local)
✅ Sincronización inmediata sin lag


🎓 Objetivos de Aprendizaje Alcanzados
✅ Arquitectura cliente-servidor completa
✅ API RESTful con FastAPI
✅ ORM con SQLAlchemy
✅ Interfaz reactiva con React
✅ Gestión de estado con hooks
✅ Operaciones CRUD completas
✅ Base de datos relacional (PostgreSQL)
✅ Validación multinivel
✅ Comunicación HTTP asíncrona
✅ Diseño responsive

📚 Documentación Adicional

Backend README: Ver backend/README.md para detalles específicos del API
Frontend README: Ver frontend/README.md para detalles de componentes
API Docs Interactiva: http://localhost:8000/docs (cuando el backend está corriendo)


🤝 Contribuciones
Este es un proyecto educativo. Para contribuciones o mejoras, por favor:

Fork el proyecto
Crea una rama para tu feature (git checkout -b feature/AmazingFeature)
Commit tus cambios (git commit -m 'Add some AmazingFeature')
Push a la rama (git push origin feature/AmazingFeature)
Abre un Pull Request


📝 Licencia
Este proyecto está bajo la licencia MIT. Ver LICENSE para más detalles.

👨‍💻 Autor
Desarrollado como trabajo final para la materia Programación 4 de la Universidad Tecnológica Nacional (UTN).

🎯 Estado del Proyecto
Completado ✅
Todas las funcionalidades requeridas han sido implementadas y testeadas correctamente.

📞 Soporte
Para problemas o preguntas:

Revisa el README específico (backend o frontend)
Verifica la consola del navegador (F12)
Revisa los logs del backend
Verifica la conexión a PostgreSQL


🚀 Próximas Mejoras (Opcionales)

 Implementar autenticación de usuarios
 Agregar paginación
 Implementar drag & drop para reordenar ejercicios
 Exportar rutinas a PDF
 Calendario de entrenamiento
 Estadísticas de rutinas
 Duplicar rutinas existentes
 Historial de cambios


Gracias por usar Sistema de Gestión de Rutinas de Gimnasio 💪
