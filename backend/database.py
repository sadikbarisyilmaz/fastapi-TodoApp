from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:ibanthee@localhost/TodoApplicationDatabase"

from dotenv import load_dotenv
import os
load_dotenv()
asd =  os.getenv('SQLALCHEMY_DATABASE_URL')

print(asd)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)
Base=declarative_base()