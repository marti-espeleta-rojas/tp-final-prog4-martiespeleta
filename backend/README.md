API de Gestión de Rutinas de Gimnasio - Backend
Descripción del Proyecto
Este es el backend RESTful desarrollado con FastAPI que proporciona todos los endpoints necesarios para gestionar rutinas de entrenamiento de gimnasio. La API permite crear, leer, actualizar y eliminar rutinas con sus ejercicios asociados.
Requisitos Previos

Python 3.10 o superior
PostgreSQL instalado y corriendo

Usuario y contraseña configurados
Base de datos creada (o será creada automáticamente)



Instalación
1. Crear entorno virtual
bashpython -m venv venv
venv\Scripts\activate  # En Windows
# source venv/bin/activate  # En Linux/Mac
2. Instalar dependencias
bashpip install -r requirements.txt
Configuración de la Base de Datos
Paso 1: Instalar PostgreSQL
Si no tienes PostgreSQL instalado, descárgalo desde postgresql.org
Paso 2: Crear la base de datos
bash# Abre psql (prompt de PostgreSQL)
psql -U postgres

# Crea la base de datos
CREATE DATABASE gym_routines_db;

# Verifica que se creó
\l

# Salir de psql
\q
Paso 3: Configurar el archivo .env
Crea un archivo .env en la carpeta backend/ con las siguientes variables:
env# Configuración de Base de Datos PostgreSQL
# Formato: postgresql://usuario:contraseña@host:puerto/nombre_bd
DATABASE_URL=postgresql://postgres:tu_contraseña@localhost:5432/gym_routines_db

# Configuración del servidor
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true
Reemplaza:

tu_contraseña: La contraseña que estableciste al instalar PostgreSQL
postgres: El usuario de PostgreSQL (por defecto es "postgres")

Ejemplo de .env completo:
envDATABASE_URL=postgresql://postgres:Micontraseña123@localhost:5432/gym_routines_db
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true
Paso 4: Las tablas se crearán automáticamente
Cuando ejecutes la aplicación por primera vez, FastAPI creará automáticamente todas las tablas necesarias en PostgreSQL.
Ejecución
Iniciar el servidor
bashuvicorn app.main:app --reload
Salida esperada:
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
Acceder a la documentación interactiva
Una vez que el servidor esté corriendo, puedes acceder a:

Swagger UI (Interfaz interactiva): http://localhost:8000/docs
ReDoc (Documentación alternativa): http://localhost:8000/redoc

Endpoints Disponibles
Rutinas (TODOS LOS CAMBIOS SE HACEN AQUÍ)
Listar todas las rutinas (CON EJERCICIOS)
GET /api/rutinas
Retorna todas las rutinas creadas CON todos sus ejercicios incluidos
Ejemplo de respuesta:
json[
  {
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
        "notas": "Usar barra olimpica",
        "orden": 0
      }
    ]
  }
]
Obtener detalle de una rutina
GET /api/rutinas/{id}
Retorna una rutina específica con todos sus ejercicios
Buscar rutinas por nombre (CON EJERCICIOS)
GET /api/rutinas/buscar/nombre?nombre={texto}
Búsqueda parcial insensible a mayúsculas - retorna rutinas COMPLETAS
Crear una nueva rutina (CON EJERCICIOS)
POST /api/rutinas
Crea rutina y ejercicios en UNA SOLA solicitud
Body JSON:
json{
  "nombre": "Rutina Pecho y Triceps",
  "descripcion": "Entrenamiento de empuje",
  "ejercicios": [
    {
      "nombre": "Press de banca",
      "dia_semana": "Lunes",
      "series": 4,
      "repeticiones": 8,
      "peso": 100.0,
      "notas": "Usar barra olimpica",
      "orden": 0
    },
    {
      "nombre": "Flexiones",
      "dia_semana": "Lunes",
      "series": 3,
      "repeticiones": 10,
      "peso": null,
      "notas": "Peso corporal",
      "orden": 1
    }
  ]
}
Actualizar una rutina (NOMBRE, DESCRIPCIÓN Y EJERCICIOS)
PUT /api/rutinas/{id}
Actualiza COMPLETAMENTE la rutina incluyendo todos sus ejercicios
Body JSON:
json{
  "nombre": "Nuevo nombre",
  "descripcion": "Nueva descripción",
  "ejercicios": [
    {
      "id": 1,
      "nombre": "Press de banca - MODIFICADO",
      "dia_semana": "Lunes",
      "series": 5,
      "repeticiones": 5,
      "peso": 120.0,
      "notas": "Carga más pesada",
      "orden": 0
    },
    {
      "nombre": "Nuevo ejercicio (sin id)",
      "dia_semana": "Martes",
      "series": 3,
      "repeticiones": 8,
      "peso": 80.0,
      "notas": null,
      "orden": 1
    }
  ]
}
Comportamiento:

Ejercicios con id: Se actualizan
Ejercicios sin id: Se crean nuevos
Ejercicios no incluidos: Se eliminan

Eliminar una rutina
DELETE /api/rutinas/{id}
Elimina la rutina y todos sus ejercicios en cascada
Endpoints ELIMINADOS
Los siguientes endpoints ya NO existen porque todo se maneja desde Rutinas:

POST /api/rutinas/{id}/ejercicios → Usar PUT /api/rutinas/{id}
PUT /api/rutinas/ejercicios/{id} → Usar PUT /api/rutinas/{id}
DELETE /api/rutinas/ejercicios/{id} → Usar PUT /api/rutinas/{id}

Estructura del Proyecto
backend/
├── app/
│   ├── __init__.py          # Marca 'app' como paquete Python
│   ├── main.py              # Punto de entrada de FastAPI
│   ├── database.py          # Configuración de conexión a PostgreSQL
│   ├── models.py            # Modelos ORM (Rutina, Ejercicio)
│   ├── schemas.py           # Esquemas Pydantic para validación
│   └── routers/
│       └── rutinas.py       # Todos los endpoints de la API
├── requirements.txt         # Dependencias de Python
├── .env                     # Variables de entorno (no subir a Git)
└── README.md               # Este archivo
Validaciones Implementadas

✓ Nombre de rutina único
✓ Nombre de rutina no vacío
✓ Series y repeticiones > 0
✓ Peso positivo (si se proporciona)
✓ Día de la semana válido (Lunes a Domingo)
✓ Todos los campos requeridos presentes

Códigos HTTP Retornados
CódigoSignificado200OK - Solicitud exitosa201Created - Recurso creado204No Content - Eliminado exitosamente400Bad Request - Datos inválidos404Not Found - Recurso no encontrado500Server Error - Error interno
Solución de Problemas
Error: "postgresql://... could not be resolved"

Verifica que PostgreSQL esté corriendo
Verifica el .env tiene la contraseña correcta
Verifica que la base de datos existe

Error: "tables already exist"

Las tablas ya existen, es normal
La aplicación no recreará tablas si ya existen

Error: "Port 8000 is already in use"

Cambia el puerto en el .env: API_PORT=8001
O termina el proceso que usa el puerto

Notas Importantes

Las tablas se crean automáticamente al iniciar
Los ejercicios se eliminan en cascada cuando se elimina una rutina
La búsqueda no es case-sensitive (insensible a mayúsculas)
El API es stateless (sin estado) - cada request es independiente