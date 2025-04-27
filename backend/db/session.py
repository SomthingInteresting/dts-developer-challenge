from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from ..core.config import DATABASE_URL

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the environment variables.")

# Create the SQLAlchemy engine
# connect_args are often needed for SQLite, but generally not for PostgreSQL
# For PostgreSQL, pool_pre_ping=True is often a good idea in production
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) 