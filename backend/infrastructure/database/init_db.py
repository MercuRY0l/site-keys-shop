
from sqlalchemy import create_engine

from infrastructure.database.db_connector import Base

from infrastructure.database.models.user_model import UserModel
from infrastructure.database.models.log_model import Log

import os
from dotenv import load_dotenv

load_dotenv()

def init_db():
    engine = create_engine(os.getenv(key="SYNC_DB_URL"))
    Base.metadata.create_all(engine)