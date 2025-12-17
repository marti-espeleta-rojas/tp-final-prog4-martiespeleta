"""
MÓDULO: main.py
DESCRIPCIÓN: Punto de entrada principal de la aplicación FastAPI
RESPONSABILIDADES:
- Crear la aplicación FastAPI
- Registrar routers
- Crear tablas automáticamente
- Configurar CORS para acepta solicitudes desde frontend
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Importar configuración de BD y routers
from app.database import engine, Base
from app.routers import rutinas

# Cargar variables de entorno
load_dotenv()

# ============================================================================
# CREAR APLICACIÓN FASTAPI
# ============================================================================

app = FastAPI(
    title="API de Gestión de Rutinas de Gimnasio",
    description="Sistema completo para crear, editar y eliminar rutinas de entrenamiento",
    version="1.0.0"
)

# ============================================================================
# CONFIGURAR CORS (Cross-Origin Resource Sharing)
# ============================================================================
# Permite que el frontend (que corre en otro puerto) haga peticiones al backend

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Puertos posibles de Vite
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos HTTP
    allow_headers=["*"],  # Permite todos los headers
)

# ============================================================================
# CREAR TABLAS EN LA BASE DE DATOS
# ============================================================================
# Al iniciar, FastAPI crea automáticamente todas las tablas definidas en models.py

@app.on_event("startup")
def startup_event():
    """Se ejecuta cuando FastAPI inicia"""
    Base.metadata.create_all(bind=engine)
    print("✓ Tablas de base de datos creadas exitosamente")


# ============================================================================
# REGISTRAR ROUTERS
# ============================================================================
# Los routers contienen los endpoints de la API

app.include_router(rutinas.router)


# ============================================================================
# ENDPOINT DE BIENVENIDA
# ============================================================================

@app.get("/")
def read_root():
    """
    Endpoint raíz para verificar que la API está funcionando
    
    MÉTODO HTTP: GET /
    RETORNA: Mensaje de bienvenida
    """
    return {
        "mensaje": "Bienvenido a la API de Gestión de Rutinas de Gimnasio",
        "documentacion": "http://localhost:8000/docs",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    """
    Endpoint de verificación de salud
    Útil para monitoreo y debugging
    
    MÉTODO HTTP: GET /health
    RETORNA: Estado de la API
    """
    return {"status": "ok", "message": "API funcionando correctamente"}


# ============================================================================
# PUNTO DE ENTRADA
# ============================================================================
# Se ejecuta cuando se corre: uvicorn app.main:app --reload

if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    reload = os.getenv("API_RELOAD", "true").lower() == "true"
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=reload
    )