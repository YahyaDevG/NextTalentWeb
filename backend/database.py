import os
from sqlalchemy import create_engine, Column, Integer, String, Float, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Utilise PostgreSQL en production (variable DATABASE_URL), SQLite en dev
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./nexttalent.db")

# Render.com renvoie "postgres://" mais SQLAlchemy 2.x exige "postgresql://"
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class UserModel(Base):
    __tablename__ = "users"
    id             = Column(Integer, primary_key=True, index=True)
    nom            = Column(String(200), nullable=False)
    email          = Column(String(200), unique=True, index=True, nullable=False)
    password_hash  = Column(String(200), nullable=False)
    role           = Column(String(50), nullable=False)  # "recruteur" | "candidat"


class CandidatModel(Base):
    __tablename__ = "candidats"
    id                 = Column(Integer, primary_key=True, index=True)
    nom_complet        = Column(String(200), index=True, nullable=True)
    email              = Column(String(200), unique=True, index=True, nullable=True)
    telephone          = Column(String(50), nullable=True)
    hard_skills        = Column(Text, nullable=True)
    soft_skills        = Column(Text, nullable=True)
    annees_experience  = Column(Float, default=0.0)
    dernier_poste      = Column(String(200), nullable=True)
    langues            = Column(String(200), nullable=True)


class OffreModel(Base):
    __tablename__ = "offres"
    id                        = Column(Integer, primary_key=True, index=True)
    titre                     = Column(String(300), index=True, nullable=False)
    description               = Column(Text, nullable=True)
    hard_skills_requis        = Column(Text, nullable=True)
    annees_experience_requises = Column(Float, default=0.0)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
