"""
MÓDULO: models.py
DESCRIPCIÓN: Modelos ORM de SQLAlchemy para la base de datos
RESPONSABILIDADES:
- Definir la estructura de las tablas
- Establecer relaciones entre Rutinas y Ejercicios
- Validar tipos de datos
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base


class DiaSemanEnum(str, enum.Enum):
    """
    Enumeración de los días de la semana válidos
    Esto asegura que solo se puedan usar estos valores
    """
    LUNES = "Lunes"
    MARTES = "Martes"
    MIERCOLES = "Miércoles"
    JUEVES = "Jueves"
    VIERNES = "Viernes"
    SABADO = "Sábado"
    DOMINGO = "Domingo"


class Rutina(Base):
    """
    MODELO: Rutina
    TABLA: rutinas
    
    DESCRIPCIÓN:
    Representa un plan de entrenamiento con ejercicios organizados por día
    
    CAMPOS:
    - id: Identificador único (PRIMARY KEY)
    - nombre: Nombre descriptivo de la rutina (UNIQUE)
    - descripcion: Detalles opcionales sobre la rutina
    - fecha_creacion: Timestamp de creación
    - ejercicios: Relación con la tabla Ejercicio (1 a muchos)
    
    RELACIONES:
    - Una Rutina puede tener muchos Ejercicios
    - Si se elimina una Rutina, se eliminan todos sus Ejercicios (cascade)
    """
    __tablename__ = "rutinas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), unique=True, nullable=False, index=True)
    descripcion = Column(Text, nullable=True)
    fecha_creacion = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relación con Ejercicio
    # - back_populates: sincroniza la relación bidireccional
    # - cascade: si se borra la rutina, se borran sus ejercicios
    ejercicios = relationship(
        "Ejercicio",
        back_populates="rutina",
        cascade="all, delete-orphan",
        lazy="joined"
    )

    def __repr__(self):
        return f"<Rutina(id={self.id}, nombre='{self.nombre}')>"


class Ejercicio(Base):
    """
    MODELO: Ejercicio
    TABLA: ejercicios
    
    DESCRIPCIÓN:
    Representa un ejercicio dentro de una rutina, asociado a un día específico
    
    CAMPOS:
    - id: Identificador único (PRIMARY KEY)
    - rutina_id: Referencia a la Rutina (FOREIGN KEY)
    - nombre: Nombre del ejercicio (ej: "Press de banca")
    - dia_semana: Día de la semana (enum validado)
    - series: Número de series (debe ser positivo)
    - repeticiones: Repeticiones por serie (debe ser positivo)
    - peso: Peso en kg (opcional, para ejercicios con peso corporal)
    - notas: Observaciones adicionales
    - orden: Posición del ejercicio dentro del día
    - rutina: Relación inversa con Rutina
    
    RELACIONES:
    - Muchos Ejercicios pertenecen a Una Rutina
    """
    __tablename__ = "ejercicios"

    id = Column(Integer, primary_key=True, index=True)
    rutina_id = Column(Integer, ForeignKey("rutinas.id", ondelete="CASCADE"), nullable=False)
    nombre = Column(String(255), nullable=False)
    dia_semana = Column(SQLEnum(DiaSemanEnum), nullable=False)
    series = Column(Integer, nullable=False)
    repeticiones = Column(Integer, nullable=False)
    peso = Column(Float, nullable=True)  # NULL para ejercicios de peso corporal
    notas = Column(Text, nullable=True)
    orden = Column(Integer, default=0)
    
    # Relación con Rutina
    # - back_populates: sincroniza la relación bidireccional
    rutina = relationship("Rutina", back_populates="ejercicios")

    def __repr__(self):
        return f"<Ejercicio(id={self.id}, nombre='{self.nombre}', dia='{self.dia_semana}')>"