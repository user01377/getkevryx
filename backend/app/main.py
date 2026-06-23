import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from contextlib import asynccontextmanager
from app.routes import router
from app.database import Base, engine
from app import models, seed

from apscheduler.schedulers.background import BackgroundScheduler
from app.jobs import restock, status_updater

scheduler = BackgroundScheduler()

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
    
    # create tables
    Base.metadata.create_all(bind=engine)

    # seed database
    seed.seed_products()
    
    # add/start jobs
    scheduler.add_job(restock.restock_products, "interval", seconds=120)
    scheduler.add_job(status_updater.update_order_status, "interval", seconds=60)
    scheduler.start()

    yield

    scheduler.shutdown()
    # add shutdown logic here


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "http://localhost"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)