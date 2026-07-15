"""
This file contains all necessary start tasks for backend container

This code used to be directly inside
of main.py and the fastapi lifespan function,
but was moved here for modularity and SOC.
"""

import time
from sqlalchemy import text
from app.database import Base, engine

def wait_for_db(retries=10):
    for i in range(retries):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
                return
        except Exception as e:
            print(f"Database Connection Error: {e}")
            time.sleep(2**i)

    raise Exception("DB offline")


# THE MAIN APP STARTUP FUNCTION TO BE IMPORTED AND CALLED FROM MAIN.PY
def startup_backend():
    # wait for db to become online and queryable
    wait_for_db()