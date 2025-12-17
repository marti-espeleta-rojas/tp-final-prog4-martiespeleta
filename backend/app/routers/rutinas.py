"""
MÓDULO: routers/rutinas.py
DESCRIPCIÓN: Endpoints (rutas) de la API REST para gestionar rutinas
RESPONSABILIDADES:
- Manejar todas las solicitudes HTTP (GET, POST, PUT, DELETE)
- Interactuar con la base de datos
- Validar datos y retornar respuestas apropiadas
- Implementar lógica de negocio
- CAMBIO: Todo se maneja desde Rutinas, no desde Ejercicios individuales
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.database import get_db
from app.models import Rutina, Ejercicio, DiaSemanEnum
from app.schemas import (
    RutinaCreate,
    RutinaUpdate,
    RutinaResponse,
    RutinaDetailResponse,
    EjercicioCreate,
    EjercicioUpdate,
    EjercicioResponse
)

router = APIRouter(
    prefix="/api/rutinas",
    tags=["rutinas"]
)


# ============================================================================
# ENDPOINTS DE RUTINAS
# ============================================================================

@router.get("", response_model=List[RutinaDetailResponse])
def listar_rutinas(db: Session = Depends(get_db)):
    """
    OPERACIÓN: LISTAR TODAS LAS RUTINAS CON EJERCICIOS
    
    MÉTODO HTTP: GET /api/rutinas
    
    DESCRIPCIÓN:
    Obtiene un listado de todas las rutinas creadas en el sistema
    INCLUYENDO todos sus ejercicios asociados.
    
    PARÁMETROS:
    - db: Sesión de base de datos (inyectada automáticamente)
    
    RETORNA:
    - Lista de objetos Rutina COMPLETOS (con ejercicios incluidos)
    
    CÓDIGOS HTTP:
    - 200: Éxito (incluso si la lista está vacía)
    
    LÓGICA:
    1. Consultar todas las rutinas de la BD ordenadas por fecha
    2. CAMBIO: Ahora retornan con exercicios incluidos (lazy="joined")
    3. Convertirlas automáticamente a RutinaDetailResponse
    4. Devolverlas al frontend
    
    CAMBIO IMPORTANTE:
    Antes retornaba RutinaResponse (sin ejercicios)
    Ahora retorna RutinaDetailResponse (CON ejercicios)
    """
    rutinas = db.query(Rutina).order_by(Rutina.fecha_creacion.desc()).all()
    return rutinas


@router.get("/{rutina_id}", response_model=RutinaDetailResponse)
def obtener_rutina(rutina_id: int, db: Session = Depends(get_db)):
    """
    OPERACIÓN: OBTENER DETALLE DE UNA RUTINA
    
    MÉTODO HTTP: GET /api/rutinas/{rutina_id}
    
    DESCRIPCIÓN:
    Obtiene toda la información de una rutina específica incluyendo
    todos sus ejercicios organizados
    
    PARÁMETROS:
    - rutina_id: ID de la rutina a obtener
    - db: Sesión de base de datos (inyectada automáticamente)
    
    RETORNA:
    - Objeto Rutina completo con lista de Ejercicios
    
    CÓDIGOS HTTP:
    - 200: Éxito
    - 404: Rutina no encontrada
    
    LÓGICA:
    1. Buscar rutina por ID
    2. Si no existe, retornar error 404
    3. Si existe, retornarla con sus ejercicios
    """
    rutina = db.query(Rutina).filter(Rutina.id == rutina_id).first()
    
    if not rutina:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rutina con ID {rutina_id} no encontrada"
        )
    
    return rutina


@router.get("/buscar/nombre", response_model=List[RutinaDetailResponse])
def buscar_rutinas(nombre: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    """
    OPERACIÓN: BUSCAR RUTINAS POR NOMBRE (CON EJERCICIOS)
    
    MÉTODO HTTP: GET /api/rutinas/buscar/nombre?nombre={texto}
    
    DESCRIPCIÓN:
    Busca rutinas cuyo nombre contenga el texto proporcionado
    La búsqueda es insensible a mayúsculas/minúsculas
    CAMBIO: Ahora retorna rutinas COMPLETAS con ejercicios
    
    PARÁMETROS:
    - nombre: Texto a buscar (parámetro query)
    - db: Sesión de base de datos (inyectada automáticamente)
    
    RETORNA:
    - Lista de Rutinas completas que coinciden con la búsqueda
    - Lista vacía si no hay coincidencias
    
    CÓDIGOS HTTP:
    - 200: Éxito
    
    LÓGICA:
    1. Usar ILIKE para búsqueda case-insensitive
    2. Búsqueda parcial: "ABC%" + "%ABC" = contiene "ABC"
    3. Retornar todas las coincidencias CON ejercicios
    """
    busqueda = f"%{nombre}%"
    rutinas = db.query(Rutina).filter(
        Rutina.nombre.ilike(busqueda)
    ).order_by(Rutina.fecha_creacion.desc()).all()
    
    return rutinas


@router.post("", response_model=RutinaDetailResponse, status_code=status.HTTP_201_CREATED)
def crear_rutina(rutina: RutinaCreate, db: Session = Depends(get_db)):
    """
    OPERACIÓN: CREAR NUEVA RUTINA CON EJERCICIOS
    
    MÉTODO HTTP: POST /api/rutinas
    
    DESCRIPCIÓN:
    Crea una nueva rutina con ejercicios en un único request.
    CAMBIO: Ahora se pueden crear los ejercicios directamente en la misma 
    operación, sin necesidad de operaciones separadas.
    
    PARÁMETROS:
    - rutina: Objeto RutinaCreate con:
      * nombre (obligatorio)
      * descripción (opcional)
      * ejercicios (array de ejercicios, puede estar vacío)
    - db: Sesión de base de datos (inyectada automáticamente)
    
    RETORNA:
    - Rutina creada con ID asignado e INCLUIDOS todos sus ejercicios
    
    CÓDIGOS HTTP:
    - 201: Rutina creada exitosamente
    - 400: El nombre de la rutina ya existe
    
    LÓGICA:
    1. Validar que el nombre sea único
    2. Crear nuevo objeto Rutina
    3. Agregar TODOS los ejercicios en la misma operación
    4. Guardar en BD
    5. Retornar la rutina creada COMPLETA
    
    CAMBIO:
    Antes: Solo podía crear rutina vacía, luego agregar ejercicios
    Ahora: Puede crear rutina con ejercicios de una sola vez
    
    EJEMPLO JSON:
    {
      "nombre": "Rutina Pecho",
      "descripcion": "Ejercicios de pecho",
      "ejercicios": [
        {
          "nombre": "Press de banca",
          "dia_semana": "Lunes",
          "series": 4,
          "repeticiones": 8,
          "peso": 100.0,
          "notas": "Barra olimpica",
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
    """
    # Verificar que el nombre sea único
    existente = db.query(Rutina).filter(Rutina.nombre == rutina.nombre).first()
    if existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe una rutina con el nombre '{rutina.nombre}'"
        )
    
    # Crear nueva rutina
    nueva_rutina = Rutina(
        nombre=rutina.nombre,
        descripcion=rutina.descripcion
    )
    
    # Agregar ejercicios si los hay
    if rutina.ejercicios:
        for idx, ejercicio_data in enumerate(rutina.ejercicios):
            ejercicio = Ejercicio(
                nombre=ejercicio_data.nombre,
                dia_semana=ejercicio_data.dia_semana,
                series=ejercicio_data.series,
                repeticiones=ejercicio_data.repeticiones,
                peso=ejercicio_data.peso,
                notas=ejercicio_data.notas,
                orden=ejercicio_data.orden if ejercicio_data.orden is not None else idx
            )
            nueva_rutina.ejercicios.append(ejercicio)
    
    # Guardar en BD
    db.add(nueva_rutina)
    db.commit()
    db.refresh(nueva_rutina)
    
    return nueva_rutina


@router.put("/{rutina_id}", response_model=RutinaDetailResponse)
def actualizar_rutina(
    rutina_id: int,
    rutina_update: RutinaUpdate,
    db: Session = Depends(get_db)
):
    """
    OPERACIÓN: ACTUALIZAR RUTINA (NOMBRE, DESCRIPCIÓN Y EJERCICIOS)
    
    MÉTODO HTTP: PUT /api/rutinas/{rutina_id}
    
    DESCRIPCIÓN:
    Actualiza COMPLETAMENTE una rutina: nombre, descripción y ejercicios.
    
    PARÁMETROS:
    - rutina_id: ID de la rutina a actualizar
    - rutina_update: Datos a actualizar
    - db: Sesión de base de datos (inyectada automáticamente)
    
    RETORNA:
    - Rutina actualizada CON todos sus ejercicios
    
    CÓDIGOS HTTP:
    - 200: Éxito
    - 404: Rutina no encontrada
    - 400: El nuevo nombre ya existe
    
    LÓGICA:
    1. Buscar rutina por ID
    2. Si no existe, retornar error 404
    3. Validar nombre único si cambió
    4. Actualizar nombre y descripción
    5. Manejar actualización de ejercicios:
       - Eliminar todos los ejercicios antiguos
       - Crear todos los nuevos ejercicios
    6. Guardar cambios
    """
    rutina = db.query(Rutina).filter(Rutina.id == rutina_id).first()
    
    if not rutina:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rutina con ID {rutina_id} no encontrada"
        )
    
    # Validar nombre único si cambió
    if rutina_update.nombre and rutina_update.nombre != rutina.nombre:
        existente = db.query(Rutina).filter(
            Rutina.nombre == rutina_update.nombre
        ).first()
        if existente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe una rutina con el nombre '{rutina_update.nombre}'"
            )
    
    # Actualizar nombre y descripción
    if rutina_update.nombre:
        rutina.nombre = rutina_update.nombre
    if rutina_update.descripcion is not None:
        rutina.descripcion = rutina_update.descripcion
    
    # SIMPLIFICADO: Manejar actualización de ejercicios
    if rutina_update.ejercicios is not None:
        # Eliminar todos los ejercicios existentes
        db.query(Ejercicio).filter(Ejercicio.rutina_id == rutina_id).delete()
        db.flush()  # Asegurar que se eliminen antes de crear nuevos
        
        # Crear nuevos ejercicios
        for idx, ej_data in enumerate(rutina_update.ejercicios):
            nuevo_ej = Ejercicio(
                rutina_id=rutina_id,
                nombre=ej_data.nombre,
                dia_semana=ej_data.dia_semana,
                series=ej_data.series,
                repeticiones=ej_data.repeticiones,
                peso=ej_data.peso,
                notas=ej_data.notas,
                orden=ej_data.orden if ej_data.orden is not None else idx
            )
            db.add(nuevo_ej)
    
    db.commit()
    db.refresh(rutina)
    
    return rutina


@router.delete("/{rutina_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_rutina(rutina_id: int, db: Session = Depends(get_db)):
    """
    OPERACIÓN: ELIMINAR RUTINA
    
    MÉTODO HTTP: DELETE /api/rutinas/{rutina_id}
    
    DESCRIPCIÓN:
    Elimina una rutina y todos sus ejercicios asociados (cascada)
    
    PARÁMETROS:
    - rutina_id: ID de la rutina a eliminar
    - db: Sesión de base de datos (inyectada automáticamente)
    
    CÓDIGOS HTTP:
    - 204: Eliminada exitosamente (sin contenido)
    - 404: Rutina no encontrada
    
    LÓGICA:
    1. Buscar rutina por ID
    2. Si no existe, retornar error 404
    3. Eliminar la rutina (SQLAlchemy elimina automáticamente sus ejercicios)
    4. Confirmar cambios
    """
    rutina = db.query(Rutina).filter(Rutina.id == rutina_id).first()
    
    if not rutina:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rutina con ID {rutina_id} no encontrada"
        )
    
    db.delete(rutina)
    db.commit()


# ============================================================================
# NOTA IMPORTANTE: ENDPOINTS DE EJERCICIOS INDIVIDUALES ELIMINADOS
# ============================================================================
# 
# CAMBIO: Los siguientes endpoints han sido ELIMINADOS porque todas las
# operaciones con ejercicios ahora se hacen a través de la Rutina:
#
# - POST /api/rutinas/{rutina_id}/ejercicios  → Crear ejercicio
# - PUT /api/rutinas/ejercicios/{id}          → Actualizar ejercicio
# - DELETE /api/rutinas/ejercicios/{id}       → Eliminar ejercicio
#
# RAZÓN: Es más lógico trabajar desde las Rutinas, ya que los ejercicios
# son parte de las rutinas. Esto simplifica la API y mejora la coherencia.
#
# CÓMO FUNCIONA AHORA:
# - Para agregar ejercicio: PUT /api/rutinas/{id} con ejercicios en el JSON
# - Para editar ejercicio: PUT /api/rutinas/{id} con ejercicio modificado
# - Para eliminar ejercicio: PUT /api/rutinas/{id} sin ese ejercicio
#
# VENTAJAS:
# 1. API más simple (menos endpoints)
# 2. Operaciones más coherentes (ejercicios siempre desde rutinas)
# 3. Menos confusión para el cliente
# 4. Mejor manejo de transacciones (todo en una sola operación)
# ============================================================================