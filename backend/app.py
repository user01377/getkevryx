from fastapi import FastAPI
import time
from contextlib import asynccontextmanager
from routes import router
from database import Base, engine
import models
from sqlalchemy import text

def wait_for_db(engine, retries=10):
    for i in range(retries):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
                return
        except Exception:
            print("db unresponsive, retrying..")
            time.sleep(2 ** i)

    raise Exception("DB offline")

@asynccontextmanager
async def lifespan(app: FastAPI):
    wait_for_db(engine)
    
    print("creating tables..")
    Base.metadata.create_all(bind=engine)
    print("created tables")

    yield

    # add shutdown logic here


app = FastAPI(lifespan=lifespan)

app.include_router(router)