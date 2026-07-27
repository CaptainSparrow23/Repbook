from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_PATH = Path(__file__).resolve().parent.parent / "fastapi_project.db"
SQL_ALCHEMY_DATABASE_URL = f"sqlite:///{DATABASE_PATH}"


# creates engine object, which is SQLAlchemy's starting point for any SQL operation. 
# It manages the connection pool and database dialect. (Conenction manager)
engine = create_engine(
    SQL_ALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
