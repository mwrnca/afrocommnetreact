from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# this creates a local SQLite file called afrocommnet.db in your backend folder
# when you deploy you swap this URL for PostgreSQL
DATABASE_URL = "sqlite:///./afrocommnet.db"

# create the database engine — this is what actually connects to the database
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # needed for SQLite only
)

# sessionmaker creates database sessions
# a session is like a conversation with the database
# you open one, do your queries, then close it
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base is what your models will inherit from
# it keeps track of all your tables
Base = declarative_base()

# this function gives you a database session
# FastAPI will call this for every request that needs the database
def get_db():
    db = SessionLocal()
    try:
        yield db        # give the session to the route
    finally:
        db.close()      # always close it when done