"""
This file contains all necessary start tasks for backend container

This code used to be directly inside 
of main.py and the fastapi lifespan function,
but was moved here for modularity and SOC.
"""

import time
from sqlalchemy import text
from app.database import Base, engine
from app.seed import seed_products
from apscheduler.schedulers.background import BackgroundScheduler
from app.jobs import restock, status_updater

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

def create_tables():
    Base.metadata.create_all(bind=engine)

scheduler = BackgroundScheduler()

# THE MAIN APP STARTUP FUNCTION TO BE IMPORTED AND CALLED FROM MAIN.PY
def startup_backend():
    # wait for db to become online and queryable
    wait_for_db(engine)

    # create tables
    create_tables()

    # seed database
    seed_products()
    
    # add/start background jobs
    scheduler.add_job(restock.restock_products, "interval", seconds=120)
    scheduler.add_job(status_updater.update_order_status, "interval", seconds=60)
    scheduler.start()

def shutdown_scheduler():
    scheduler.shutdown()