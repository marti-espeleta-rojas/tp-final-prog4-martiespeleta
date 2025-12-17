"""
MÓDULO: schemas.py
DESCRIPCIÓN: Esquemas Pydantic para validación de datos
RESPONSABILIDADES:
- Validar datos que vienen del frontend
- Definir la estructura de respuestas de la API
- Proporcionar transformación de datos (ORM a JSON)
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime
from enum import Enum


class DiaSemanEnum(str, Enum):
    """Valores válidos para día de la semana"""
    LUNES = "Lunes"
    MARTES = "Martes"
    MIERCOLES = "Miércoles"
    JUEVES = "Jueves"
    VIERNES = "Viernes"
    SABADO = "Sábado"
    DOMINGO = "Domingo"


class EjercicioBase(BaseModel):
    """
    ESQUEMA BASE: EjercicioBase
    Campos comunes entre creación y actualización de ejercicios
    """
    nombre: str = Field(..., min_length=1, max_length=255)
    dia_semana: DiaSemanEnum
    series: int = Field(..., gt=0)  # gt=0: debe ser mayor a 0
    repeticiones: int = Field(..., gt=0)
    peso: Optional[float] = Field(None, gt=0)
    notas: Optional[str] = None
    orden: int = Field(default=0, ge=0)  # ge=0: mayor o igual a 0

    @validator('nombre')
    def nombre_no_vacio(cls, v):
        """Validar que el nombre no sea solo espacios"""
        if not v.strip():
            raise ValueError('El nombre del ejercicio no puede estar vacío')
        return v.strip()


class EjercicioCreate(EjercicioBase):
    """
    ESQUEMA: EjercicioCreate
    Se usa cuando se crea un nuevo ejercicio desde el frontend
    """
    pass


class EjercicioUpdate(EjercicioBase):
    """
    ESQUEMA: EjercicioUpdate
    Se usa cuando se actualiza un ejercicio existente
    """
    nombre: Optional[str] = Field(None, min_length=1, max_length=255)
    dia_semana: Optional[DiaSemanEnum] = None
    series: Optional[int] = Field(None, gt=0)
    repeticiones: Optional[int] = Field(None, gt=0)


class EjercicioUpdateWithId(BaseModel):
    """
    ESQUEMA: EjercicioUpdateWithId
    Se usa cuando se actualiza ejercicios dentro de una rutina
    El ID es opcional: si tiene ID, actualiza; si no, crea nuevo
    """
    id: Optional[int] = None  # Si es None, se crea nuevo
    nombre: str = Field(..., min_length=1, max_length=255)
    dia_semana: DiaSemanEnum
    series: int = Field(..., gt=0)
    repeticiones: int = Field(..., gt=0)
    peso: Optional[float] = Field(None, gt=0)
    notas: Optional[str] = None
    orden: int = Field(default=0, ge=0)

    class Config:
        from_attributes = True


class EjercicioResponse(EjercicioBase):
    """
    ESQUEMA: EjercicioResponse
    Se devuelve cuando se solicita un ejercicio (contiene id)
    """
    id: int

    class Config:
        from_attributes = True  # Permite leer desde objetos ORM


class RutinaBase(BaseModel):
    """
    ESQUEMA BASE: RutinaBase
    Campos comunes entre creación y actualización de rutinas
    """
    nombre: str = Field(..., min_length=1, max_length=255)
    descripcion: Optional[str] = None

    @validator('nombre')
    def nombre_no_vacio(cls, v):
        """Validar que el nombre no sea solo espacios"""
        if not v.strip():
            raise ValueError('El nombre de la rutina no puede estar vacío')
        return v.strip()


class RutinaCreate(RutinaBase):
    """
    ESQUEMA: RutinaCreate
    Se usa cuando se crea una nueva rutina desde el frontend
    Puede incluir ejercicios iniciales
    """
    ejercicios: Optional[List[EjercicioCreate]] = []

    class Config:
        from_attributes = True


class RutinaUpdate(RutinaBase):
    """
    ESQUEMA: RutinaUpdate
    Se usa cuando se actualiza una rutina existente
    CAMBIO: Ahora puede incluir ejercicios para actualizar completamente la rutina
    """
    nombre: Optional[str] = Field(None, min_length=1, max_length=255)
    ejercicios: Optional[List[EjercicioUpdateWithId]] = None

    class Config:
        from_attributes = True


class RutinaResponse(RutinaBase):
    """
    ESQUEMA: RutinaResponse
    Se devuelve cuando se solicita una rutina (sin ejercicios detallados)
    """
    id: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True


class RutinaDetailResponse(RutinaResponse):
    """
    ESQUEMA: RutinaDetailResponse
    Se devuelve cuando se solicita el detalle completo de una rutina
    Incluye todos sus ejercicios organizados
    """
    ejercicios: List[EjercicioResponse] = []

    class Config:
        from_attributes = True