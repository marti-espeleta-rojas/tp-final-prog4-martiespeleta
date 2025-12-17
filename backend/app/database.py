"""
MÓDULO: database.py
DESCRIPCIÓN: Configuración de la conexión a la base de datos PostgreSQL
RESPONSABILIDADES:
- Crear la cadena de conexión a PostgreSQL
- Establecer la sesión de SQLAlchemy
- Crear las tablas automáticamente al iniciar
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# Cargar variables de entorno desde .env
load_dotenv()

# Obtener URL de conexión a base de datos
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL no está configurada en .env")

# Crear motor de SQLAlchemy
# - echo=True: muestra las queries SQL en la consola (útil para debugging)
# - pool_pre_ping=True: verifica que la conexión esté viva antes de usarla
engine = create_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True
)

# SessionLocal es la clase que crea sesiones de base de datos
# Cada request tendrá su propia sesión
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base es la clase base para todos nuestros modelos ORM
Base = declarative_base()


def get_db():
    """
    Generador de dependencias de FastAPI para inyectar sesión de BD
    
    CÓMO FUNCIONA:
    - FastAPI llama esta función en cada request
    - Crea una nueva sesión de base de datos
    - La usa durante el request
    - La cierra automáticamente después
    
    USO EN RUTAS:
        @router.get("/rutinas")
        def get_rutinas(db: Session = Depends(get_db)):
            # db es la sesión inyectada automáticamente
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()