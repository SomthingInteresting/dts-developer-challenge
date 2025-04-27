import logging

from backend.db.session import engine
from backend.db.base_class import Base # Import Base
from backend.models.task import Task # Import models to ensure they are registered

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db() -> None:
    logger.info("Creating initial database tables...")
    try:
        # Create all tables defined in models imported via Base
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully.")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        raise

if __name__ == "__main__":
    init_db() 